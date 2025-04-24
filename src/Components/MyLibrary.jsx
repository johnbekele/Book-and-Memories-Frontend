import React, { useState, useContext } from 'react';
import { ThemeContext } from '../Context/ThemeContext.jsx';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import BookFormOverlay from './BookFormOverlay.jsx';
import { useFavorite } from '../Hook/useFavoriests.js';

const MyLibrary = () => {
  const { favorites, enhancedFav, isError, isLoading } = useFavorite();

  // Mock data directly in the component
  const mockBooks = [
    {
      id: '1',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      description:
        'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
      coverImage:
        'https://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      sourceUrl: 'https://www.example.com/book/1',
    },
    {
      id: '2',
      title: 'Sapiens: A Brief History of Humankind',
      author: 'Yuval Noah Harari',
      description:
        "From a renowned historian comes a groundbreaking narrative of humanity's creation and evolution.",
      coverImage:
        'https://books.google.com/books/content?id=1EiJAwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      sourceUrl: 'https://www.example.com/book/2',
    },
    {
      id: '3',
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      description:
        'Bilbo Baggins is a hobbit who enjoys a comfortable life, rarely traveling any farther than his pantry or cellar.',
      coverImage:
        'https://books.google.com/books/content?id=pD6arNyKyi8C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      sourceUrl: 'https://www.example.com/book/3',
    },
    {
      id: '4',
      title: 'Educated',
      author: 'Tara Westover',
      description:
        'An unforgettable memoir about a young girl who leaves her survivalist family and goes on to earn a PhD from Cambridge University.',
      coverImage:
        'https://books.google.com/books/content?id=XU0oAQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      sourceUrl: 'https://www.example.com/book/4',
    },
    {
      id: '5',
      title: 'Atomic Habits',
      author: 'James Clear',
      description:
        'A revolutionary guide to building good habits and breaking bad ones.',
      coverImage:
        'https://books.google.com/books/content?id=fFCjDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      sourceUrl: 'https://www.example.com/book/5',
    },
    {
      id: '6',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      description:
        "Set in the Jazz Age on Long Island, the novel depicts first-person narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby.",
      coverImage:
        'https://books.google.com/books/content?id=iXn5U2IzVH0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      sourceUrl: 'https://www.example.com/book/6',
    },
  ];

  const { theme, colors } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  // Component state
  const [books] = useState(mockBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddBookOverlay, setShowAddBookOverlay] = useState(false);

  // Filter books based on search term
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle navigation to source
  const navigateToSource = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div
      className="min-h-screen  sm:px-6 lg:px-8 w-auto"
      style={{
        backgroundColor: isDark
          ? colors.backgroundColor || '#1f2937'
          : '#ffffff',
        color: isDark ? colors.textColor || '#f3f4f6' : '#1f2937',
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Library</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {filteredBooks.length} books in your collection
            </p>
          </div>

          <button
            onClick={() => setShowAddBookOverlay(true)}
            className={`mt-4 sm:mt-0 flex items-center px-4 py-2 rounded-md font-medium ${
              isDark
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Book
          </button>
        </div>

        {/* Search Section */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl">No books found.</p>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {searchTerm
                ? 'Try adjusting your search.'
                : 'Start adding books to your library!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className={`border rounded-lg overflow-hidden shadow-md ${
                  isDark
                    ? 'border-gray-700 bg-gray-800'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex h-full">
                  {/* Book Cover */}
                  <div
                    className={`w-1/3 p-4 flex items-center justify-center ${
                      isDark ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={`Cover of ${book.title}`}
                        className="max-h-48 max-w-full object-contain"
                      />
                    ) : (
                      <div
                        className={`h-40 w-28 flex items-center justify-center rounded border ${
                          isDark
                            ? 'border-gray-600 bg-gray-700'
                            : 'border-gray-300 bg-gray-200'
                        }`}
                      >
                        <span className="text-gray-500 text-xs text-center p-2">
                          No Cover
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Book Details */}
                  <div className="w-2/3 p-4 flex flex-col">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {book.author}
                      </p>

                      {book.description && (
                        <p className="text-sm mb-3 line-clamp-3">
                          {book.description}
                        </p>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => navigateToSource(book.sourceUrl)}
                        className={`text-sm px-3 py-1 rounded ${
                          isDark
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        View Source
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Book Overlay */}
      {showAddBookOverlay && (
        <BookFormOverlay onClose={() => setShowAddBookOverlay(false)} />
      )}
    </div>
  );
};

export default MyLibrary;
