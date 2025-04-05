import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';

// Get the auth token
const getToken = () => localStorage.getItem('token');

// API functions
const fetchPosts = async () => {
  const response = await axios.get(`${API_URL}/posts`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

const fetchAllUsers = async () => {
  const response = await axios.get(`${API_URL}/auth/users`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Custom hook for posts with user data
export function usePost() {
  const queryClient = useQueryClient();

  // Query for fetching all posts
  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  // Query for fetching all users
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
    staleTime: 5 * 60 * 1000, // Cache user data for 5 minutes
  });

  // Create a user lookup map for quick access
  const userMap = {};
  if (usersQuery.data) {
    usersQuery.data.forEach((user) => {
      userMap[user._id] = user;
    });
  }

  // Combine post data with user data
  const posts = postsQuery.data || [];
  const postsWithUsers = posts.map((post) => {
    // Get user data for the post creator
    const userData = userMap[post.user] || null;

    // Enhance comments with user data
    const enhancedComments =
      post.comment?.map((comment) => ({
        ...comment,
        userData: userMap[comment.user] || null,
      })) || [];

    return {
      ...post,
      userData,
      comment: enhancedComments,
    };
  });

  return {
    posts: postsWithUsers,
    rawPosts: posts,
    users: userMap,
    isLoading: postsQuery.isLoading || usersQuery.isLoading,
    isError: postsQuery.isError || usersQuery.isError,
    error: postsQuery.error || usersQuery.error,
  };
}
