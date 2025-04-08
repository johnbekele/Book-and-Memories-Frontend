import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';

const token = () => localStorage.getItem('token');

// Fetch function get flaggs

const fetchFlaggedPosts = async () => {
  const response = await axios.get(`${API_URL}/posts/flagged`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  return response.data;
};

const fetchAllUsers = async () => {
  const response = await axios.get(`${API_URL}/auth/users`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  console.log('All users:', response.data);
  return response.data;
};

//use Query for fetching flagged posts

export function useFlagged() {
  const queryClient = useQueryClient();

  // Fetch flagged posts
  const FlaggedQuery = useQuery({
    queryKey: ['flaggedPosts'],
    queryFn: fetchFlaggedPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for fetching all users
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
    staleTime: 5 * 60 * 1000, // Cache user data for 5 minutes
  });

  const mappedUsers = {};

  usersQuery.data?.forEach((user) => {
    mappedUsers[user._id] = {
      id: user._id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      profilePicture: user.profilePicture,
    };
  });

  const flaggedWithUser = FlaggedQuery.data?.map((flaggedPost) => {
    const userData = mappedUsers[flaggedPost.userId];
    return {
      ...flaggedPost,
      userData,
    };
  });

  return {
    flagged: flaggedWithUser,
    isLoading: FlaggedQuery.isLoading,
    isError: FlaggedQuery.isError,
    error: FlaggedQuery.error,
  };
}
