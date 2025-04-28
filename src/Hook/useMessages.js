import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';
import { io } from 'socket.io-client';

// Constants
const SOCKET_URL = API_URL.split('/api')[0];
const getToken = () => localStorage.getItem('token');
const getCurrentUserId = () => localStorage.getItem('userId');

// Socket singleton
let socketInstance = null;

const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => console.log('Socket connected'));
    socketInstance.on('disconnect', () => console.log('Socket disconnected'));
    socketInstance.on('connect_error', (error) =>
      console.error('Socket connection error:', error)
    );
  }
  return socketInstance;
};

// API service
const messagesApi = {
  fetchMessages: async (chatId) => {
    if (!chatId) return [];

    try {
      const response = await axios.get(`${API_URL}/messages/${chatId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  sendMessage: async ({ chatId, content }) => {
    if (!chatId || !content || content.trim() === '') {
      throw new Error('Chat ID and content are required');
    }

    const response = await axios.post(
      `${API_URL}/messages/send`,
      { chatId, content: content.trim() },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return response.data;
  },

  fetchUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },
};

// Ensure messages have unique IDs and valid structure
const processMessages = (messages = [], users = []) => {
  if (!Array.isArray(messages)) return [];

  const seen = new Set();
  return messages
    .filter((message) => {
      // Validate message structure
      if (!message || typeof message !== 'object') return false;

      // Handle messages without IDs
      if (!message._id) return true;

      // Filter duplicates
      if (seen.has(message._id)) return false;
      seen.add(message._id);
      return true;
    })
    .map((message) => {
      // If we have a sender and users data, enhance the sender info
      if (message.sender && message.sender._id && users.length > 0) {
        const userData = users.find((user) => user._id === message.sender._id);
        if (userData) {
          return {
            ...message,
            sender: {
              ...message.sender,
              username: `${userData.firstname} ${userData.lastname}`,
              photo: userData.photo || 'default-avatar.png',
            },
          };
        }
      }
      return message;
    });
};

export function useMessages(chatId) {
  const queryClient = useQueryClient();
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const listenersRef = useRef({});
  const currentUserId = getCurrentUserId();

  // Fetch users for mapping
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: messagesApi.fetchUsers,
    staleTime: 300000, // 5 minutes cache
  });

  // Fetch messages
  const {
    data: rawMessages = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => messagesApi.fetchMessages(chatId),
    enabled: Boolean(chatId),
    staleTime: 60000,
  });

  // Process messages to ensure they're valid and unique, and map user data
  const messages = processMessages(rawMessages, users);

  // Send message mutation
  const {
    mutate: sendMessage,
    isPending: isSending,
    isError: isSendError,
    error: sendError,
  } = useMutation({
    mutationFn: (content) => messagesApi.sendMessage({ chatId, content }),
    onSuccess: (newMessage) => {
      if (!newMessage || typeof newMessage !== 'object') return;

      queryClient.setQueryData(['messages', chatId], (oldData = []) => {
        const processedData = processMessages(oldData, users);

        // Check if message already exists
        const exists = processedData.some((m) => m._id === newMessage._id);
        if (exists) return processedData;

        // Process the new message with user data
        const enhancedMessage = processMessages([newMessage], users)[0];
        return [...processedData, enhancedMessage];
      });
    },
  });

  // Handle sending a message with validation
  const handleSendMessage = useCallback(
    (content) => {
      if (!content || content.trim() === '' || !chatId) return;
      sendMessage(content);
    },
    [chatId, sendMessage]
  );

  // Check if a user is online
  const isUserOnline = useCallback(
    (userId) => {
      return onlineUsers.has(userId);
    },
    [onlineUsers]
  );

  // Socket connection and event handling
  useEffect(() => {
    if (!chatId) return;

    const socket = getSocket();

    // Clean up existing listeners
    const cleanup = () => {
      if (listenersRef.current[chatId]) {
        const handlers = listenersRef.current[chatId];
        socket.emit('leaveRoom', chatId);
        socket.off('reciveMessage', handlers.messageHandler);
        socket.off('userOnline', handlers.onlineHandler);
        socket.off('userOffline', handlers.offlineHandler);
        socket.off('onlineUsers', handlers.usersHandler);
        delete listenersRef.current[chatId];
      }
    };

    // Clean up previous listeners if they exist
    cleanup();

    // Message handler with validation
    const messageHandler = (message) => {
      if (!message || typeof message !== 'object' || !message.sender) {
        console.warn('Received invalid message format:', message);
        return;
      }

      console.log('Received message:', message);

      // Only update if the message is from someone else
      if (message.sender._id !== currentUserId) {
        queryClient.setQueryData(['messages', chatId], (oldData = []) => {
          const processedData = processMessages(oldData, users);

          // Check if message already exists
          const exists = processedData.some((m) => m._id === message._id);
          if (exists) return processedData;

          // Process the new message with user data
          const enhancedMessage = processMessages([message], users)[0];
          return [...processedData, enhancedMessage];
        });
      }
    };

    // User status handlers
    const onlineHandler = (userId) => {
      if (typeof userId !== 'string') return;
      setOnlineUsers((prev) => new Set([...prev, userId]));
    };

    const offlineHandler = (userId) => {
      if (typeof userId !== 'string') return;
      setOnlineUsers((prev) => {
        const newSet = new Set([...prev]);
        newSet.delete(userId);
        return newSet;
      });
    };

    const usersHandler = (users) => {
      if (!Array.isArray(users)) {
        console.warn('Received invalid users format:', users);
        return;
      }
      setOnlineUsers(new Set(users.filter((id) => typeof id === 'string')));
    };

    // Store handlers for cleanup
    listenersRef.current[chatId] = {
      messageHandler,
      onlineHandler,
      offlineHandler,
      usersHandler,
    };

    // Join room and set up listeners
    socket.emit('joinRoom', chatId);
    socket.on('reciveMessage', messageHandler);
    socket.on('userOnline', onlineHandler);
    socket.on('userOffline', offlineHandler);
    socket.on('onlineUsers', usersHandler);
    socket.emit('getOnlineUsers', chatId);

    return cleanup;
  }, [chatId, currentUserId, queryClient, users]);

  return {
    // Data (with safe defaults)
    messages: messages || [],
    onlineUsers: Array.from(onlineUsers),

    // Status
    isLoading,
    isError,
    error,
    isSending,
    isSendError,
    sendError,

    // Actions
    sendMessage: handleSendMessage,
    refreshMessages: refetch,

    // Utilities
    isUserOnline,
  };
}
