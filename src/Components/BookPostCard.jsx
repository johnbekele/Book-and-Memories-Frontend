import { useState, useRef, useEffect } from 'react';
import {
  HeartIcon as HeartOutline,
  ChatBubbleOvalLeftIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import Avatar from './Avatar';
import { useTheme } from '../Context/ThemeContext';
import logger from '../utils/logger';

const BookPostCard = ({ post, book, currentUser, onLike, onComment }) => {
  // Use the post data directly from React Query
  const isLiked = post.likes?.includes(currentUser?.id) || false;
  const likesCount = post.likes?.length || 0;

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const commentInputRef = useRef(null);

  //debugug
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState(null);

  // Use the theme context
  const { theme, colors } = useTheme();
  const isDark = theme === 'dark';

  // Get post user data
  const postUser = post.userData;

  // logger.log('Post in card:', postUser);

  // Generate fallback images
  const userProfileImage =
    postUser?.photo ||
    `https://ui-avatars.com/api/?name=${
      postUser?.username?.charAt(0) || 'U'
    }&background=random`;

  // Add fallback for book cover
  const bookCover =
    book?.cover_image ||
    'https://dummyimage.com/200x300/e0e0e0/ffffff&text=No+Cover';

  // hadle like funtionality
  const handleLike = () => {
    onLike(post._id, isLiked);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      try {
        setIsSubmittingComment(true);
        setCommentError(null);

        // onComment now returns a boolean indicating success
        const success = await onComment(post._id, commentText);

        // Only clear the input if the comment was posted successfully
        if (success) {
          setCommentText('');
        }
      } catch (error) {
        console.error('Error submitting comment:', error);
        setCommentError('Failed to post comment. Please try again.');
      } finally {
        setIsSubmittingComment(false);
      }
    }
  };

  useEffect(() => {
    if (showComments && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [showComments]);

  return (
    <div
      style={{
        backgroundColor: colors.backgroundColor,
        color: colors.textColor,
      }}
      className={`rounded-lg shadow-md overflow-hidden max-w-2xl mx-auto my-4 transition-colors duration-200`}
    >
      {/* Post Header */}
      <div className="flex items-center p-3">
        <Avatar
          src={userProfileImage}
          alt={postUser?.firstname || 'User'}
          className="h-10 w-10 rounded-full"
        />
        <div className="ml-2">
          <p className="font-semibold text-sm">
            {postUser?.firstname || 'Anonymous'}
          </p>
          <p
            style={{ color: isDark ? '#a0aec0' : '#718096' }}
            className="text-xs"
          >
            {new Date(post.start_date || Date.now()).toLocaleDateString()} -
            {post.end_date
              ? new Date(post.end_date).toLocaleDateString()
              : 'Present'}
          </p>
        </div>
      </div>

      {/* Main Content - Side by Side */}
      <div className="flex flex-col md:flex-row">
        {/* Book Cover Image - Smaller */}
        <div className="md:w-1/2 relative">
          <div className="pb-[100%] md:pb-0 md:h-full">
            <img
              src={bookCover}
              alt={book?.book_title || 'Book cover'}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://dummyimage.com/200x300/e0e0e0/ffffff&text=No+Cover';
              }}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="md:w-1/2 flex flex-col">
          {/* Action Buttons */}
          <div className="p-3">
            <div className="flex items-center">
              <button
                onClick={handleLike}
                className="mr-3 focus:outline-none"
                aria-label={isLiked ? 'Unlike' : 'Like'}
              >
                {isLiked ? (
                  <HeartSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartOutline
                    style={{ color: colors.textColor }}
                    className="h-6 w-6"
                  />
                )}
              </button>
              <button
                onClick={() => setShowComments(!showComments)}
                className="mr-3 focus:outline-none"
                aria-label="Comment"
              >
                <ChatBubbleOvalLeftIcon
                  style={{ color: colors.textColor }}
                  className="h-6 w-6"
                />
              </button>
              <button className="ml-auto focus:outline-none" aria-label="Save">
                <BookmarkIcon
                  style={{ color: colors.textColor }}
                  className="h-6 w-6"
                />
              </button>
            </div>

            {/* Likes Count */}
            <div className="mt-1">
              <p className="font-semibold text-sm">{likesCount} likes</p>
            </div>

            {/* Book Details */}
            <div className="mt-1">
              <p className="text-sm">
                <span className="font-semibold">
                  {postUser?.firstname || 'User'}
                </span>{' '}
                {post.end_date ? 'read' : 'is reading'}{' '}
                <span className="font-semibold">
                  {book?.book_title || 'a book'}
                </span>{' '}
                by {book?.book_author || 'unknown author'}
              </p>
              {post.rating && (
                <p className="text-sm mt-1">Rating: {post.rating} / 5</p>
              )}
              {book?.description && (
                <p className="text-sm mt-1 line-clamp-3 hover:line-clamp-none">
                  {book.description}
                </p>
              )}
              {post.memories && (
                <p className="text-sm mt-2 italic">
                  "
                  {typeof post.memories === 'string'
                    ? post.memories
                    : post.memories.text}
                  "
                </p>
              )}
            </div>
          </div>

          {/* Comments Section - Always visible on desktop */}
          <div
            style={{
              borderColor: isDark ? colors.borderColor : '#e2e8f0',
            }}
            className="flex-grow overflow-hidden border-t p-3"
          >
            <div className="h-full flex flex-col">
              {/* Comments List */}
              <div className="flex-grow overflow-y-auto max-h-32">
                {post.comment && post.comment.length > 0 ? (
                  post.comment.map((comment) => (
                    <div
                      key={comment._id || `comment-${Math.random()}`}
                      className="mb-2"
                    >
                      <p className="text-sm">
                        <span className="font-semibold">
                          {comment.userData?.firstname || 'User'}
                        </span>{' '}
                        <span className="font-semibold">
                          {comment.userData?.lastname || ''}
                        </span>{' '}
                        {comment.text}
                      </p>
                      <p
                        style={{ color: isDark ? '#a0aec0' : '#718096' }}
                        className="text-xs"
                      >
                        {new Date(
                          comment.created_at || Date.now()
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p
                    style={{ color: isDark ? '#a0aec0' : '#718096' }}
                    className="text-sm"
                  >
                    No comments yet
                  </p>
                )}
              </div>

              {/* Comment Input Form */}
              <form onSubmit={handleCommentSubmit} className="mt-2 flex">
                <input
                  ref={commentInputRef}
                  type="text"
                  placeholder="Add a comment..."
                  style={{
                    backgroundColor: colors.backgroundColor,
                    color: colors.textColor,
                  }}
                  className="flex-grow text-sm border-none focus:ring-0 focus:outline-none"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={isSubmittingComment}
                />
                <button
                  type="submit"
                  disabled={!commentText.trim() || isSubmittingComment}
                  style={{ color: colors.buttonText }}
                  className={`font-semibold text-sm ${
                    !commentText.trim() || isSubmittingComment
                      ? 'opacity-50 cursor-default'
                      : ''
                  }`}
                >
                  {isSubmittingComment ? 'Posting...' : 'Post'}
                </button>
              </form>

              {commentError && (
                <p className="text-red-500 text-xs mt-1">{commentError}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPostCard;
