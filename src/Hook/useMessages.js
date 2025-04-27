import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';
import { io } from 'socket.io-client';

const token = () => localStorage.getItem('token');

const SOCKET_URL = API_URL.split('/api')[0];

// Create socket outside to not re-create every render
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

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }
  return socket;
};

// Fetch all messages for a chat
const fetchMessages = async (chatId) => {
  if (!chatId) return [];

  const response = await axios.get(`${API_URL}/messages/${chatId}`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  return response.data;
};

// Send a new message
const sendMessageReq = async ({ chatId, content }) => {
  const response = await axios.post(
    `${API_URL}/messages/send`,
    { chatId, content },
    {
      headers: { Authorization: `Bearer ${token()}` },
    }
  );
  return response.data;
};

export function useMessages(chatId) {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState([]);

  // Fetch messages query
  const messageQuery = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => fetchMessages(chatId),
    enabled: !!chatId, // Only fetch when chatId exists
    staleTime: 60000, // 1 minute
    onSuccess: (data) => {
      setMessages(data);
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: sendMessageReq,
    onSuccess: (newMessage) => {
      // Add message locally for immediate UI update
      setMessages((prev) => [...prev, newMessage]);
      // Refresh messages from server (optional)
      // queryClient.invalidateQueries(['messages', chatId]);
    },
  });

  // Socket connection and message handling
  useEffect(() => {
    if (!chatId) return;

    const socket = getSocket();

    // Join the chat room
    socket.emit('joinRoom', chatId);

    // Handle incoming messages (note the correct event name)
    const handleNewMessage = (message) => {
      // Avoid duplicating our own messages
      const currentUserId = localStorage.getItem('userId');
      if (message.sender._id !== currentUserId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    // Use the exact event name that your server is emitting
    socket.on('reciveMessage', handleNewMessage);

    return () => {
      socket.emit('leaveRoom', chatId);
      socket.off('reciveMessage', handleNewMessage);
    };
  }, [chatId]);

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
  };
}
