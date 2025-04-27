import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';

const token = () => localStorage.getItem('token');

const fetchChats = async () => {
  const response = await axios.get(`${API_URL}/chat`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  return response.data;
};

const startChat = async (receiverId) => {
  const response = await axios.post(
    `${API_URL}/chat/start`,
    { receiverId },
    {
      headers: { Authorization: `Bearer ${token()}` },
    }
  );
  return response.data;
};

export function useChat() {
  const queryClient = useQueryClient();
  const chatQuery = useQuery({
    queryKey: ['chats'],
    queryFn: fetchChats,
    staleTime: 5 * 60 * 1000,
  });

  const chats = chatQuery.data?.map((chat) => {
    return {
      id: chat._id,
      participant: chat.participant, // or the "other user" info
      lastMessage: chat.lastMessage,
    };
  });

  const startChatMutation = useMutation({
    mutationFn: startChat,
    onSuccess: () => {
      queryClient.invalidateQueries(['chats']);
    },
  });

  return {
    chats,
    isLoading: chatQuery.isLoading,
    startchat: startChatMutation.mutate,
    isError: chatQuery.isError,
    error: chatQuery.error,
  };
}
