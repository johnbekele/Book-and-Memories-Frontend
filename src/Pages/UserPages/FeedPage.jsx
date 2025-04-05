import React, { useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useBooks } from '../../Hook/useBooks';
import { usePost } from '../../Hook/usePost';
import axios from 'axios';
import { API_URL } from '../../Config/EnvConfig';
import BookPostCard from '../../Components/BookPostCard';
import AuthContext from '../../Context/AuthContext';
import logger from '../../utils/logger';

function FeedPage() {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);
  const { books, isLoading: booksLoading } = useBooks();
  const { posts, isLoading: postsLoading, isError, error } = usePost();

  console.log('Books:', books);
  console.log('Posts:', posts);

  // Get current user from your auth system
  const currentUser = { id: user?.id, username: user?.username };
  logger.log(currentUser.username);

  const isLoading = booksLoading || postsLoading;

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async ({ postId, isLiked }) => {
      const token = localStorage.getItem('token');
      const method = isLiked ? 'delete' : 'post';

      return axios({
        method,
        url: `${API_URL}/posts/${postId}/like`,
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: async ({ postId, commentText }) => {
      const token = localStorage.getItem('token');

      return axios.post(
        `${API_URL}/posts/${postId}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // Handle actions
  const handleLike = (postId, isLiked) => {
    likeMutation.mutate({ postId, isLiked });
  };

  const handleComment = (postId, commentText) => {
    commentMutation.mutate({ postId, commentText });
  };

  // Function to find the corresponding book for a post
  const findBookForPost = (postBookId) => {
    return books.find((book) => book._id === postBookId) || null;
  };

  return (
    <div className="max-w-screen-md mx-auto p-4">
      {isLoading && <p className="text-center">Loading...</p>}

      {isError && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
          role="alert"
        >
          <p>Error loading posts: {error?.message || 'Unknown error'}</p>
          <p className="text-sm mt-1">
            Please make sure your API server is running and accessible.
          </p>
        </div>
      )}

      {posts.length === 0 && !isLoading && !isError && (
        <p className="text-center text-gray-500">
          No posts found. Create your first post!
        </p>
      )}

      {/* Map through posts, not books */}
      {posts.map((post) => {
        const book = findBookForPost(post.book);

        return (
          <BookPostCard
            key={post._id}
            post={post}
            book={book}
            currentUser={currentUser}
            onLike={handleLike}
            onComment={handleComment}
          />
        );
      })}
    </div>
  );
}

export default FeedPage;
