import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';
import { io } from 'socket.io-client';

const token = () => localStorage.getItem('token');
const SOCKET_URL = API_URL.split('/api')[0];

// Socket instance management - kept outside component to persist across renders
let socket;

const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }
  return socket;
};

// Separate API service functions
const messagesApi = {
  fetchMessages: async (chatId) => {
    if (!chatId) return [];
    const response = await axios.get(`${API_URL}/messages/${chatId}`, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    return response.data;
  },

  sendMessage: async ({ chatId, content }) => {
    const response = await axios.post(
      `${API_URL}/messages/send`,
      { chatId, content },
      {
        headers: { Authorization: `Bearer ${token()}` },
      }
    );
    return response.data;
  },
};

// Helper to ensure messages have unique IDs
const ensureUniqueMessages = (messages) => {
  const seen = new Set();
  return messages.filter((message) => {
    if (!message._id) return true; // Keep messages without IDs

    // If we've seen this ID before, filter it out
    if (seen.has(message._id)) return false;

    // Otherwise, mark it as seen and keep it
    seen.add(message._id);
    return true;
  });
};

export function useMessages(chatId) {
  const queryClient = useQueryClient();
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  // Track socket listeners to avoid duplicates
  const listenersRef = useRef({});

  // Fetch messages query
  const {
    data: messagesData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => messagesApi.fetchMessages(chatId),
    enabled: !!chatId,
    staleTime: 60000,
  });

  // Ensure messages are unique
  const messages = ensureUniqueMessages(messagesData);

  // Send message mutation
  const {
    mutate: sendMessage,
    isPending: isSending,
    isError: isSendError,
    error: sendError,
  } = useMutation({
    mutationFn: (content) => messagesApi.sendMessage({ chatId, content }),
    onSuccess: (newMessage) => {
      // Update the cache with the new message
      queryClient.setQueryData(['messages', chatId], (oldData = []) => {
        // First ensure we don't have duplicates in existing data
        const uniqueOldData = ensureUniqueMessages(oldData);

        // Then check if the new message already exists
        const messageExists = uniqueOldData.some(
          (m) => m._id === newMessage._id
        );
        if (messageExists) {
          return uniqueOldData;
        }
        return [...uniqueOldData, newMessage];
      });
    },
  });

  // Socket connection and message handling
  useEffect(() => {
    if (!chatId) return;

    const socket = getSocket();
    const currentUserId = localStorage.getItem('userId');

    // Clean up any existing listeners for this chat
    if (listenersRef.current[chatId]) {
      socket.off('reciveMessage', listenersRef.current[chatId].messageHandler);
      socket.off('userOnline', listenersRef.current[chatId].onlineHandler);
      socket.off('userOffline', listenersRef.current[chatId].offlineHandler);
      socket.off('onlineUsers', listenersRef.current[chatId].usersHandler);
    }

    // Create new handlers
    const messageHandler = (message) => {
      console.log('Received message:', message);

      if (message.sender._id !== currentUserId) {
        queryClient.setQueryData(['messages', chatId], (oldData = []) => {
          // Ensure old data is unique
          const uniqueOldData = ensureUniqueMessages(oldData);

          // Check if this message already exists
          const messageExists = uniqueOldData.some(
            (m) => m._id === message._id
          );
          if (messageExists) {
            return uniqueOldData;
          }
          return [...uniqueOldData, message];
        });
      }
    };

    const onlineHandler = (userId) => {
      setOnlineUsers((prev) => new Set([...prev, userId]));
    };

    const offlineHandler = (userId) => {
      setOnlineUsers((prev) => {
        const newSet = new Set([...prev]);
        newSet.delete(userId);
        return newSet;
      });
    };

    const usersHandler = (users) => {
      setOnlineUsers(new Set(users));
    };

    // Store the handlers so we can remove them later
    listenersRef.current[chatId] = {
      messageHandler,
      onlineHandler,
      offlineHandler,
      usersHandler,
    };

    // Join the chat room
    socket.emit('joinRoom', chatId);

    // Add listeners
    socket.on('reciveMessage', messageHandler);
    socket.on('userOnline', onlineHandler);
    socket.on('userOffline', offlineHandler);
    socket.on('onlineUsers', usersHandler);

    // Request current online users
    socket.emit('getOnlineUsers', chatId);

    return () => {
      // Clean up on unmount or when chatId changes
      if (listenersRef.current[chatId]) {
        socket.emit('leaveRoom', chatId);
        socket.off(
          'reciveMessage',
          listenersRef.current[chatId].messageHandler
        );
        socket.off('userOnline', listenersRef.current[chatId].onlineHandler);
        socket.off('userOffline', listenersRef.current[chatId].offlineHandler);
        socket.off('onlineUsers', listenersRef.current[chatId].usersHandler);
        delete listenersRef.current[chatId];
      }
    };
  }, [chatId, queryClient]);

  // Check if a specific user is online
  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  // Handle sending a message with validation
  const handleSendMessage = (content) => {
    if (!content || content.trim() === '') return;
    if (!chatId) return;
    sendMessage(content);
  };

  return {
    // Data
    messages,
    onlineUsers: Array.from(onlineUsers),

    // Status
    isLoading,
    isError,
    error,
    isSending,
    isSendError: isSendError,
    sendError,

    // Actions
    sendMessage: handleSendMessage,
    refreshMessages: refetch,

    // Utilities
    isUserOnline,
  };
}
