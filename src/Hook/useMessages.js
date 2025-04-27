import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';
import { io } from 'socket.io-client';

const token = () => localStorage.getItem('token');

const SOCKET_URL = API_URL.split('/api')[0];

console.log('Socket url', SOCKET_URL);
// Create socket outside to not re-create every render
const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket'], // you can add fallback if needed
});

// Fetch all messages for a chat
const fetchMessages = async (chatId) => {
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
  const [newMessage, setNewMessage] = useState(null);

  const messageQuery = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => fetchMessages(chatId),
    enabled: !!chatId, // Only fetch when chatId exists
    staleTime: 1 * 60 * 1000, // 1 min
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendMessageReq,
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', chatId]);
    },
  });

  useEffect(() => {
    if (!chatId) return;

    socket.emit('joinRoom', chatId);

    socket.on('receiveMessage', (message) => {
      setNewMessage(message);
    });

    return () => {
      socket.emit('leaveRoom', chatId);
      socket.off('receiveMessage');
    };
  }, [chatId]);

  // Add the new incoming message into existing list (optimistically)
  const messages =
    newMessage && messageQuery.data
      ? [...messageQuery.data, newMessage]
      : messageQuery.data;

  return {
    messages,
    isLoading: messageQuery.isLoading,
    isError: messageQuery.isError,
    error: messageQuery.error,
    sendMessage: sendMessageMutation.mutate,
  };
}
