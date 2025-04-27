import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';
import { io } from 'socket.io-client';

const token = () => localStorage.getItem('token');
const SOCKET_URL = API_URL.split('/api')[0];

// Socket instance management
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

export function useMessages(chatId) {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set()); // Track online users by ID

  // Fetch messages query
  const messageQuery = useQuery({
    queryKey: ['messages', chatId],
    queryFn: async () => {
      if (!chatId) return [];
      const response = await axios.get(`${API_URL}/messages/${chatId}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      return response.data;
    },
    enabled: !!chatId,
    staleTime: 60000,
    onSuccess: (data) => setMessages(data),
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ chatId, content }) => {
      const response = await axios.post(
        `${API_URL}/messages/send`,
        { chatId, content },
        {
          headers: { Authorization: `Bearer ${token()}` },
        }
      );
      return response.data;
    },
    onSuccess: (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    },
  });

  // Socket connection and message handling
  useEffect(() => {
    if (!chatId) return;

    const socket = getSocket();

    // Join the chat room
    socket.emit('joinRoom', chatId);

    // Handle new messages
    const handleNewMessage = (message) => {
      const currentUserId = localStorage.getItem('userId');
      if (message.sender._id !== currentUserId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    // Handle user status updates
    const handleUserOnline = (userId) => {
      setOnlineUsers((prev) => new Set([...prev, userId]));
    };

    const handleUserOffline = (userId) => {
      setOnlineUsers((prev) => {
        const newSet = new Set([...prev]);
        newSet.delete(userId);
        return newSet;
      });
    };

    // Listen for presence events
    socket.on('userOnline', handleUserOnline);
    socket.on('userOffline', handleUserOffline);
    socket.on('reciveMessage', handleNewMessage);

    // Request current online users for this chat
    socket.emit('getOnlineUsers', chatId);

    // Handle response with currently online users
    const handleOnlineUsers = (users) => {
      setOnlineUsers(new Set(users));
    };

    socket.on('onlineUsers', handleOnlineUsers);

    return () => {
      socket.emit('leaveRoom', chatId);
      socket.off('reciveMessage', handleNewMessage);
      socket.off('userOnline', handleUserOnline);
      socket.off('userOffline', handleUserOffline);
      socket.off('onlineUsers', handleOnlineUsers);
    };
  }, [chatId]);

  // Check if a specific user is online
  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  return {
    messages,
    isLoading: messageQuery.isLoading,
    isError: messageQuery.isError,
    error: messageQuery.error,
    sendMessage: (content) => {
      if (!content || content.trim() === '') return;
      sendMessageMutation.mutate({ chatId, content });
    },
    isSending: sendMessageMutation.isPending,
    onlineUsers, // Return the set of online user IDs
    isUserOnline, // Helper method to check if a specific user is online
  };
}
