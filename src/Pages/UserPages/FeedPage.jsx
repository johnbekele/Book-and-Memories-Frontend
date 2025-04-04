import BookPostCard from '../../Components/BookPostCard';

function FeedPage() {
  // Example post data
  const post = {
    id: '1',
    bookTitle: 'The Great Gatsby',
    bookAuthor: 'F. Scott Fitzgerald',
    bookCoverUrl:
      'https://www.pdf.co.tz/wp-content/uploads/2023/02/Rich-Dad-Poor-Dad_page_1-1-of-1-683x1024.jpg',
    caption: 'Enjoying this classic on a rainy day! #reading #classics',
    createdAt: '2023-06-15T14:30:00Z',
    likes: ['user123', 'user456'],
    comments: [
      {
        id: 'c1',
        user: {
          username: 'bookworm',
          profileImage: 'https://example.com/avatar1.jpg',
        },
        text: 'One of my favorites!',
        createdAt: '2023-06-15T15:00:00Z',
      },
      {
        id: 'c2',
        user: {
          username: 'literaryfan',
          profileImage: 'https://example.com/avatar2.jpg',
        },
        text: 'The symbolism in this book is amazing.',
        createdAt: '2023-06-15T16:20:00Z',
      },
    ],
    user: {
      username: 'readingenthusiast',
      profileImage: 'https://example.com/avatar3.jpg',
    },
  };

  const currentUser = { id: 'user123', username: 'currentuser' };

  const handleLike = (postId, isLiked) => {
    console.log(`Post ${postId} ${isLiked ? 'liked' : 'unliked'}`);
    // Here you would call your API to update likes
  };

  const handleComment = (postId, commentText) => {
    console.log(`New comment on post ${postId}: ${commentText}`);
    // Here you would call your API to add the comment
  };

  return (
    <div className="max-w-screen-md mx-auto p-4">
      <BookPostCard
        post={post}
        currentUser={currentUser}
        onLike={handleLike}
        onComment={handleComment}
      />
    </div>
  );
}

export default FeedPage;
