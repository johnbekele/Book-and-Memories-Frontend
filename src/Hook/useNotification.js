import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';

// Get the auth token
const getToken = () => localStorage.getItem('token');

const fetchNotifications = async () => {
  const response = await axios.get(`${API_URL}/notifications/user`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  console.log('Fetched notifications from useQuery:', response.data);
  return response.data;
};

export function useNotification() {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchOnWindowFocus: false,
    refetchInterval: 10000,
  });

  console.log('Notifications query:', notificationsQuery.data);

  return {
    notifications: notificationsQuery.data || [],
    isLoading: notificationsQuery.isLoading,
    isError: notificationsQuery.isError,
    error: notificationsQuery.error,
  };
}
