import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';
import { useId } from 'react';

// Get the auth token
const getToken = () => localStorage.getItem('token');

const fetchUserInfo = async () => {
  const response = await axios.get(`${API_URL}/auth/users`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

const escalateuser = async (userID, torole) => {
  const response = await axios.post(
    `${API_URL}/auth/escalate/${useId}`,
    { torole },
    {
      headers: { Authorization: `Bearer ${getToken}` },
    }
  );
  return response.data;
};

// Custom hook for books
export function useUser() {
  const queryClient = useQueryClient();

  const userInfoQuery = useQuery({
    queryKey: ['userInfo'],
    queryFn: fetchUserInfo,
  });

  const escalateMutation = useMutation({
    queryFn: escalateuser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInfo'] });
    },
  });

  userInfoQuery.data || [];
  return {
    user: userInfoQuery.data || [],
    escalate: escalateMutation.mutate,
    isLoading: userInfoQuery.isLoading,
    isError: userInfoQuery.isError,
    error: userInfoQuery.error,
  };
}
