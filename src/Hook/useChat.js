import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';
import AuthContext from '../Context/AuthContext';

const token = () => localStorage.getItem('token');

const fetchChats = async () => {
  const response = await axios.get(`${API_URL}/chat`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  return response.data;
};

const fetchAllUsers = async () => {
  const response = await axios.get(`${API_URL}/auth/users`, {
    headers: { Authorization: `Bearer ${getToken()}` },
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
  const { user } = useContext(AuthContext);
  const chatQuery = useQuery({
    queryKey: ['chats'],
    queryFn: fetchChats,
    staleTime: 5 * 60 * 1000,
  });

  // Query for fetching all users
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
    staleTime: 5 * 60 * 1000, // Cache user data for 5 minutes
  });
  const users = usersQuery.data || [];
  const chats = chatQuery.data?.map((chat) => {
    const participants = chat.participants
      .filter((participant) => participant._id !== user.id)
      .map((participant) => {
        const userData = users.find((u) => u._id === participant._id);
        return {
          _id: participant._id,
          username: userData?.firstname + ' ' + userData?.lastname,
          email: userData?.email,
          photo: userData?.photo || 'no photo', // assuming photo exists in user
        };
      });

    return {
      _id: chat._id,
      username: participants[0]?.username,
      lastMessage: chat.lastMessage.content,
      avatar: participants[0]?.photo,
      updatedAt: new Date(),
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
