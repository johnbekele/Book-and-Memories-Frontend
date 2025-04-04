import { useState, useRef, useEffect } from 'react';
import {
  HeartIcon as HeartOutline,
  ChatBubbleOvalLeftIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import Avatar from './Avatar';

const BookPostCard = ({ post, currentUser, onLike, onComment }) => {
  const [liked, setLiked] = useState(post.likes.includes(currentUser.id));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const commentInputRef = useRef(null);

  const handleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikesCount((prevCount) =>
      newLikedState ? prevCount + 1 : prevCount - 1
    );
    onLike(post.id, newLikedState);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  useEffect(() => {
    if (showComments && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [showComments]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-2xl mx-auto my-4">
      {/* Post Header */}
      <div className="flex items-center p-3">
        <Avatar
          src={post.user.profileImage}
          alt={post.user.username}
          className="h-8 w-8 rounded-full"
        />
        <div className="ml-2">
          <p className="font-semibold text-sm">{post.user.username}</p>
          <p className="text-gray-500 text-xs">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Main Content - Side by Side */}
      <div className="flex flex-col md:flex-row">
        {/* Book Cover Image - Smaller */}
        <div className="md:w-1/2 relative">
          <div className="pb-[100%] md:pb-0 md:h-full">
            <img
              src={post.bookCoverUrl}
              alt={post.bookTitle}
              className="absolute inset-0 w-full h-full object-cover"
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
                aria-label={liked ? 'Unlike' : 'Like'}
              >
                {liked ? (
                  <HeartSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartOutline className="h-6 w-6" />
                )}
              </button>
              <button
                onClick={() => setShowComments(!showComments)}
                className="mr-3 focus:outline-none"
                aria-label="Comment"
              >
                <ChatBubbleOvalLeftIcon className="h-6 w-6" />
              </button>
              <button className="ml-auto focus:outline-none" aria-label="Save">
                <BookmarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Likes Count */}
            <div className="mt-1">
              <p className="font-semibold text-sm">{likesCount} likes</p>
            </div>

            {/* Book Details */}
            <div className="mt-1">
              <p className="text-sm">
                <span className="font-semibold">{post.user.username}</span> is
                reading <span className="font-semibold">{post.bookTitle}</span>{' '}
                by {post.bookAuthor}
              </p>
              {post.caption && <p className="text-sm mt-1">{post.caption}</p>}
            </div>
          </div>

          {/* Comments Section - Always visible on desktop */}
          <div className="flex-grow overflow-hidden border-t p-3">
            <div className="h-full flex flex-col">
              {/* Comments List */}
              <div className="flex-grow overflow-y-auto max-h-32">
                {post.comments.length > 0 ? (
                  post.comments.map((comment) => (
                    <div key={comment.id} className="mb-2">
                      <p className="text-sm">
                        <span className="font-semibold">
                          {comment.user.username}
                        </span>{' '}
                        {comment.text}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No comments yet</p>
                )}
              </div>

              {/* Comment Input Form */}
              <form onSubmit={handleCommentSubmit} className="mt-2 flex">
                <input
                  ref={commentInputRef}
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-grow text-sm border-none focus:ring-0 focus:outline-none"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className={`text-blue-500 font-semibold text-sm ${
                    !commentText.trim() ? 'opacity-50 cursor-default' : ''
                  }`}
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPostCard;
