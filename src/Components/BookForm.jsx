import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../Hook/useBooks.js';
import { ThemeContext } from '../Context/ThemeContext.jsx';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookForm = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
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

  // Date state
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
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

      // Redirect to books page
      navigate('/books');
    } catch (error) {
      toast.error('Failed to add book. Please try again.');
      console.error('Error adding book:', error);
    }
  };

  return (
    <div
      className={`container mx-auto p-4 ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Add a New Book</h2>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block mb-1 font-medium">
                Book Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className={`w-full p-2 border rounded ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>

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
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block mb-1 font-medium">
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${
                  theme === 'dark'
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
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>

            {/* Google Book ID */}
            <div>
              <label htmlFor="googleId" className="block mb-1 font-medium">
                Google Book ID
              </label>
              <input
                type="text"
                id="googleId"
                name="googleId"
                value={formData.googleId}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>

            {/* Cover Image URL */}
            <div>
              <label htmlFor="coverImage" className="block mb-1 font-medium">
                Cover Image URL
              </label>
              <input
                type="text"
                id="coverImage"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Reading Dates */}
            <div>
              <label className="block mb-1 font-medium">Reading Period</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm mb-1">
                    Start Date
                  </label>
                  <DatePicker
                    id="startDate"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    className={`w-full p-2 border rounded ${
                      theme === 'dark'
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
                      theme === 'dark'
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

            {/* Description */}
            <div>
              <label htmlFor="description" className="block mb-1 font-medium">
                Book Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className={`w-full p-2 border rounded ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
              ></textarea>
            </div>

            {/* Memories */}
            <div>
              <label htmlFor="memories" className="block mb-1 font-medium">
                Your Memories
              </label>
              <textarea
                id="memories"
                name="memories"
                value={formData.memories}
                onChange={handleChange}
                rows="3"
                className={`w-full p-2 border rounded ${
                  theme === 'dark'
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
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={addBookLoading}
            className={`px-6 py-2 rounded-md font-medium ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } ${addBookLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {addBookLoading ? 'Adding Book...' : 'Add Book'}
          </button>
        </div>

        {/* Error Message */}
        {addBookError && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            Failed to add book: {addBookError.message || 'Unknown error'}
          </div>
        )}
      </form>
    </div>
  );
};

export default BookForm;
