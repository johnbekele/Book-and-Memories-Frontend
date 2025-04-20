import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';

// Get the auth token
const getToken = () => localStorage.getItem('token');

const fetchUserInfo = async () => {
  const response = await axios.get(`${API_URL}/auth/users`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Custom hook for books
export function useUser() {
  const queryClient = useQueryClient();

  const userInfoQuery = useQuery({
    queryKey: ['userInfo'],
    queryFn: fetchUserInfo,
  });

  userInfoQuery.data || [];
  return {
    user: userInfoQuery.data || [],
    isLoading: userInfoQuery.isLoading,
    isError: userInfoQuery.isError,
    error: userInfoQuery.error,
  };
}
