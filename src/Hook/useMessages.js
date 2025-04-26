// src/Hook/useMessages.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';

const getToken = () => localStorage.getItem('token');

const fetchMessages = async () => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/messages/recent`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const useMessages = () => {
  const queryClient = useQueryClient();

  const useMessagesQuery = useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages,
    refetchOnWindowFocus: false,
    staleTime: 10000,
  });

  return {
    messages: useMessagesQuery.data || [],
    isLoading: useMessagesQuery.isLoading,
    isError: useMessagesQuery.isError,
    error: useMessagesQuery.error,
    refetch: useMessagesQuery.refetch,
  };
};
