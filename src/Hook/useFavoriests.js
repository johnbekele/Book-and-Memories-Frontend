import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../Config/EnvConfig';
import { useId } from 'react';

// Get the auth token
const getToken = () => localStorage.getItem('token');

const fetchFavorites = async () => {
  const response = await axios.get(`${API_URL}/favorites`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return response.data;
};

const fetchBooks = async () => {
  const response = await axios.get(`${API_URL}/books`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return response.data;
};

const addFavorites = async (postId) => {
  const response = await axios.post(
    `${API_URL}/add/${postId}`,
    {},
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );
  return response.data;
};

export function useFavorite() {
  const queryClient = useQueryClient();

  const favoriteQuery = useQuery({
    queryKey: ['favorites'],
    queryFn: fetchFavorites,
  });

  const booksQuery = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
  });

  const addFavoritesMutation = useMutation({
    mutationFn: addFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries(['favorites']);
    },
  });

  if (booksQuery.isLoading) return { isLoading: true };
  if (booksQuery.isError) return { isError: true };

  const mappedbooks = {};

  if (booksQuery.data) {
    booksQuery.data.forEach((book) => {
      mappedbooks[book._id] = book;
    });
  }

  const favorite = favoriteQuery.data || [];

  const enhancedFav = favorite.map((favorite) => {
    const bookdata = mappedbooks[favorite.bookid];
    return bookdata;
  });

  return {
    favorites: favoriteQuery.data || [],
    addFavorite: addFavoritesMutation.mutate,
    enhancedFav: enhancedFav,
    isLoading: favoriteQuery.isLoading,
    isError: favoriteQuery.isError,
  };
}
