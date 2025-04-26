import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../Hook/useBooks.js';
import logger from '../utils/logger.js';
import { ThemeContext } from '../Context/ThemeContext.jsx';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { XMarkIcon } from '@heroicons/react/24/outline';

const BookFormOverlay = ({ onClose }) => {
  const navigate = useNavigate();
  const { theme, colors } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const { addBook, addBookLoading, addBookError, addBookSuccess } = useBooks();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    pages: '',
    memories: '',
    comment: '',
    rating: 0,
    googleId: '',
    coverImage: '',
  });

  // Book search state
  const [searchQuery, setSearchQuery] = useState('');
  const [bookSuggestions, setBookSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Date state
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Refs
  const suggestionsRef = useRef(null);
  const searchInputRef = useRef(null);

  // Handle click outside suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [suggestionsRef, searchInputRef]);

  // Search for books using Google Books API
  const searchBooks = async (query) => {
    if (!query || query.length < 3) {
      setBookSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&maxResults=5`
      );

      const books =
        response.data.items?.map((item) => ({
          id: item.id,
          title: item.volumeInfo.title,
          authors: item.volumeInfo.authors?.join(', ') || 'Unknown',
          description: item.volumeInfo.description || '',
          categories: item.volumeInfo.categories || [],
          pageCount: item.volumeInfo.pageCount,
          coverImage: item.volumeInfo.imageLinks?.thumbnail || '',
        })) || [];

      setBookSuggestions(books);
      setShowSuggestions(true);
    } catch (error) {
      logger.error('Error searching books:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery) {
        searchBooks(searchQuery);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Handle book selection
  const handleSelectBook = (book) => {
    setFormData({
      ...formData,
      title: book.title,
      author: book.authors,
      description: book.description,
      category: book.categories?.[0] || '',
      pages: book.pageCount || '',
      googleId: book.id,
      coverImage: book.coverImage,
    });

    setSearchQuery(book.title);
    setShowSuggestions(false);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'title') {
      setSearchQuery(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle rating change
  const handleRatingChange = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare data for submission
      const bookData = {
        ...formData,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
      };

      // Submit data using the addBook mutation
      await addBook(bookData);

      // Show success message
      toast.success('Book added successfully!');

      // Close the overlay
      onClose();
    } catch (error) {
      toast.error('Failed to add book. Please try again.');
      logger.error('Error adding book:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        {/* Transparent backdrop */}
        <div
          className="fixed inset-0 bg-transparent bg-opacity-60  transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal content */}
        <div
          className="relative bg-transparent  rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          style={{
            backgroundColor: isDark
              ? colors.backgroundColor || '#1f2937'
              : '#ffffff',
            color: isDark ? colors.textColor || '#f3f4f6' : '#1f2937',
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold">Creat a new Post</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Book Search/Title */}
              <div className="relative">
                <label htmlFor="title" className="block mb-1 font-medium">
                  Search Book / Title*
                </label>
                <input
                  ref={searchInputRef}
                  type="text"
                  id="title"
                  name="title"
                  value={searchQuery}
                  onChange={handleChange}
                  required
                  placeholder="Start typing to search books..."
                  className={`w-full p-2 border rounded ${
                    isDark
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-300'
                  }`}
                  onFocus={() => searchQuery && setShowSuggestions(true)}
                />

                {/* Loading indicator */}
                {isSearching && (
                  <div className="absolute right-3 top-9">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                )}

                {/* Book suggestions */}
                {showSuggestions && bookSuggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className={`absolute z-10 w-full mt-1 rounded-md shadow-lg ${
                      isDark ? 'bg-gray-700' : 'bg-white'
                    } max-h-60 overflow-auto`}
                  >
                    <ul className="py-1">
                      {bookSuggestions.map((book) => (
                        <li
                          key={book.id}
                          onClick={() => handleSelectBook(book)}
                          className={`px-4 py-2 flex items-center cursor-pointer hover:${
                            isDark ? 'bg-gray-600' : 'bg-gray-100'
                          }`}
                        >
                          {book.coverImage && (
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-10 h-14 object-cover mr-3"
                            />
                          )}
                          <div>
                            <div className="font-medium">{book.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {book.authors}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Author */}
                  <div>
                    <label htmlFor="author" className="block mb-1 font-medium">
                      Author*
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      required
                      className={`w-full p-2 border rounded ${
                        isDark
                          ? 'bg-gray-700 border-gray-600'
                          : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor="category"
                      className="block mb-1 font-medium"
                    >
                      Category
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded ${
                        isDark
                          ? 'bg-gray-700 border-gray-600'
                          : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>

                  {/* Pages */}
                  <div>
                    <label htmlFor="pages" className="block mb-1 font-medium">
                      Number of Pages
                    </label>
                    <input
                      type="number"
                      id="pages"
                      name="pages"
                      value={formData.pages}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded ${
                        isDark
                          ? 'bg-gray-700 border-gray-600'
                          : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>

                  {/* Reading Dates */}
                  <div>
                    <label className="block mb-1 font-medium">
                      Reading Period
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="startDate"
                          className="block text-sm mb-1"
                        >
                          Start Date
                        </label>
                        <DatePicker
                          id="startDate"
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          className={`w-full p-2 border rounded ${
                            isDark
                              ? 'bg-gray-700 border-gray-600'
                              : 'bg-white border-gray-300'
                          }`}
                          placeholderText="Select date"
                        />
                      </div>
                      <div>
                        <label htmlFor="endDate" className="block text-sm mb-1">
                          End Date
                        </label>
                        <DatePicker
                          id="endDate"
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          className={`w-full p-2 border rounded ${
                            isDark
                              ? 'bg-gray-700 border-gray-600'
                              : 'bg-white border-gray-300'
                          }`}
                          placeholderText="Select date"
                          minDate={startDate}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block mb-1 font-medium">Rating</label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          className="focus:outline-none"
                        >
                          <svg
                            className={`w-8 h-8 ${
                              formData.rating >= star
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 15.585l-7.07 3.707 1.35-7.865L.64 6.931l7.89-1.146L10 0l2.47 5.785 7.89 1.146-5.64 5.496 1.35 7.865z"
                            />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Book Cover Preview */}
                  {formData.coverImage && (
                    <div className="mb-4">
                      <label className="block mb-1 font-medium">
                        Cover Preview
                      </label>
                      <div className="flex justify-center">
                        <img
                          src={formData.coverImage}
                          alt="Book cover"
                          className="h-40 object-contain border rounded"
                        />
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block mb-1 font-medium"
                    >
                      Book Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className={`w-full p-2 border rounded ${
                        isDark
                          ? 'bg-gray-700 border-gray-600'
                          : 'bg-white border-gray-300'
                      }`}
                    ></textarea>
                  </div>

                  {/* Memories */}
                  <div>
                    <label
                      htmlFor="memories"
                      className="block mb-1 font-medium"
                    >
                      Your Memories
                    </label>
                    <textarea
                      id="memories"
                      name="memories"
                      value={formData.memories}
                      onChange={handleChange}
                      rows="3"
                      className={`w-full p-2 border rounded ${
                        isDark
                          ? 'bg-gray-700 border-gray-600'
                          : 'bg-white border-gray-300'
                      }`}
                    ></textarea>
                  </div>

                  {/* Comment */}
                  <div>
                    <label htmlFor="comment" className="block mb-1 font-medium">
                      Initial Comment
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      value={formData.comment}
                      onChange={handleChange}
                      rows="2"
                      className={`w-full p-2 border rounded ${
                        isDark
                          ? 'bg-gray-700 border-gray-600'
                          : 'bg-white border-gray-300'
                      }`}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {addBookError && (
                <div className="p-3 bg-red-100 text-red-700 rounded">
                  Failed to add book: {addBookError.message || 'Unknown error'}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 rounded-md font-medium ${
                    isDark
                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addBookLoading}
                  className={`px-6 py-2 rounded-md font-medium ${
                    isDark
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } ${addBookLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {addBookLoading ? 'Adding Book...' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookFormOverlay;
