import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../Context/AuthContext';
import { ThemeContext } from '../Context/ThemeContext';
import { useLogger } from '../Hook/useLogger';
import axios from 'axios';

function ProfilePage() {
  const { user, setUser } = useContext(AuthContext);
  const { theme, colors } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const logger = useLogger();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    bio: user?.bio || '',
    photo: user?.photo || '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.photo || '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData({
          ...formData,
          photo: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await axios.put(
        `/api/users/${user.id}/profile`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        logger.log('Profile updated successfully');
        setUser({
          ...user,
          ...response.data,
        });
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      logger.error('Profile update failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="container mx-auto px-4 py-8"
      style={{ color: isDark ? colors.textColor || '#f3f4f6' : '#1f2937' }}
    >
      <div
        className="max-w-3xl mx-auto rounded-lg shadow-lg p-6"
        style={{
          backgroundColor: isDark
            ? colors.backgroundColor || '#1f2937'
            : '#ffffff',
        }}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Your Profile</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Photo Section */}
          <div className="flex flex-col items-center">
            <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-blue-500">
              <img
                src={photoPreview || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {isEditing && (
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Change Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className={`block w-full text-sm ${
                    isDark
                      ? 'text-gray-300 file:bg-gray-700 file:text-gray-300'
                      : 'text-gray-700 file:bg-gray-100 file:text-gray-700'
                  } file:py-2 file:px-4 file:rounded file:border-0 file:mr-4`}
                />
              </div>
            )}
          </div>

          {/* Profile Info Section */}
          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    } ${!isEditing ? 'opacity-70' : ''}`}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    } ${!isEditing ? 'opacity-70' : ''}`}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } ${!isEditing ? 'opacity-70' : ''}`}
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows="4"
                  className={`w-full px-3 py-2 border rounded-md ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } ${!isEditing ? 'opacity-70' : ''}`}
                ></textarea>
              </div>

              {/* Role information (read-only) */}
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">Roles</label>
                <div className="flex flex-wrap gap-2">
                  {user?.role &&
                    Object.entries(user.role).map(([role, level]) => (
                      <span
                        key={role}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          role === 'Admin'
                            ? 'bg-red-100 text-red-800'
                            : role === 'Moderator'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {role}
                      </span>
                    ))}
                </div>
              </div>

              <div className="flex justify-between">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className={`px-4 py-2 rounded-md ${
                        isDark
                          ? 'bg-gray-600 hover:bg-gray-700'
                          : 'bg-gray-200 hover:bg-gray-300'
                      } transition-colors`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors ${
                        isLoading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
