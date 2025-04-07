import React, { useContext, useState } from 'react';
import { useBooks } from '../../Hook/useBooks';
import { usePost } from '../../Hook/usePost';
import BookPostCard from '../../Components/BookPostCard';
import ModerationWarning from '../../Components/ModerationWarning';
import AuthContext from '../../Context/AuthContext';

function FeedPage() {
  const { user } = useContext(AuthContext);
  const { books, isLoading: booksLoading } = useBooks();
  const {
    posts,
    isLoading: postsLoading,
    isError,
    error,
    likePost,
    addComment,
  } = usePost();

  // Add state for moderation warnings
  const [moderationWarning, setModerationWarning] = useState({
    isVisible: false,
    reason: '',
    comment: '',
  });

  // Get current user from your auth system
  const currentUser = { id: user?.id, username: user?.username };

  const isLoading = booksLoading || postsLoading;

  // Handle actions
  const handleLike = (postId, isLiked) => {
    likePost({ postId, isLiked });
  };

  const handleComment = async (postId, commentText) => {
    try {
      const result = await addComment(postId, commentText);

      // Check if result exists before accessing its properties
      if (!result) {
        console.error('No result returned from addComment function');
        return false;
      }

      // Now check for flagged content
      if (result.flagged) {
        setModerationWarning({
          isVisible: true,
          reason: result.reason || 'Content flagged',
          comment: commentText,
        });
        return false;
      }

      console.log('Comment sent successfully');
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
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

      {/* Map through posts with proper keys */}
      {posts.map((post) => {
        const book = findBookForPost(post.book);

        return (
          <div key={post._id} className="mb-4">
            <BookPostCard
              post={post}
              book={book}
              currentUser={currentUser}
              onLike={handleLike}
              onComment={handleComment}
            />
          </div>
        );
      })}

      {/* Moderation warning outside the map */}
      <ModerationWarning
        warning={moderationWarning}
        onClose={() =>
          setModerationWarning({
            isVisible: false,
            reason: '',
            comment: '',
          })
        }
      />
    </div>
  );
}

export default FeedPage;
