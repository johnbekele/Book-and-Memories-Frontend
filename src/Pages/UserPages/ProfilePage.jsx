import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../Context/ThemeContext';
import { useProfile } from '../../Hook/useProfile.js';
import UserNameModal from '../../Components/userNameModal.jsx';

function ProfilePage() {
  const { userId } = useParams();
  const { theme, colors } = useTheme();
  const isDark = theme === 'dark';
  const { profileData, isLoading } = useProfile(userId);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  console.log('hit my route');

  // Add resize event listener to update isMobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define theme-aware styles
  const styles = {
    buttonPrimary: {
      backgroundColor: isDark
        ? 'rgba(75, 85, 99, 0.8)'
        : 'rgba(229, 231, 235, 0.8)',
      color: isDark ? colors.textColor : '#1f2937',
      borderColor: isDark
        ? 'rgba(75, 85, 99, 0.5)'
        : 'rgba(209, 213, 219, 0.5)',
    },
    textMuted: {
      color: isDark ? 'rgba(156, 163, 175, 0.8)' : 'rgba(107, 114, 128, 0.8)',
    },
    threadsBadge: {
      backgroundColor: isDark
        ? 'rgba(75, 85, 99, 0.6)'
        : 'rgba(229, 231, 235, 0.6)',
      color: isDark ? colors.textColor : '#1f2937',
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const handlemessage = () => {
    // Make sure userId is a string, not an object
    console.log('User ID to chat with:', userId);
    navigate(`/user-dashboard/chat?newChat=${userId}`);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: isDark
          ? colors.backgroundColor || '#1f2937'
          : '#ffffff',
        color: isDark ? colors.textColor || '#f3f4f6' : '#1f2937',
      }}
    >
      {/* Mobile Header - Only shown on mobile */}
      {isMobile && (
        <div
          className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center px-4 py-2"
          style={{
            backgroundColor: isDark
              ? colors.backgroundColor || '#1f2937'
              : '#ffffff',
            borderBottom: `1px solid ${
              isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.8)'
            }`,
          }}
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="font-medium">{profileData.username}</div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </div>
        </div>
      )}

      <div
        className={`${isMobile ? 'pt-14 pb-16' : 'px-4 sm:px-6 lg:px-8 py-8'}`}
      >
        <div className="max-w-6xl mx-auto">
          {isMobile ? (
            // Mobile Layout
            <div className="px-4">
              {/* Profile Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500">
                  {profileData.photo ? (
                    <img
                      src={
                        profileData.photo || 'https://via.placeholder.com/150'
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: '400',
                        fontFamily: 'Tagesschrift',
                        color: colors.textColor,
                        backgroundColor: isDark
                          ? 'rgba(55, 65, 81, 0.8)'
                          : 'rgba(229, 231, 235, 0.8)',
                        borderRadius: '50%',
                      }}
                    >
                      {profileData.initials}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex justify-around flex-grow ml-4">
                  <div className="text-center">
                    <div className="font-bold">83</div>
                    <div style={styles.textMuted} className="text-xs">
                      Posts
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">2.2M</div>
                    <div style={styles.textMuted} className="text-xs">
                      Followers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">1,115</div>
                    <div style={styles.textMuted} className="text-xs">
                      Following
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-3">
                <div className="font-medium">
                  {profileData.firstname + ' ' + profileData.lastname}
                </div>
                <div className="flex items-center my-1">
                  <span
                    className="flex items-center px-2 py-0.5 rounded-full text-xs"
                    style={styles.threadsBadge}
                  >
                    <svg
                      aria-label="Threads"
                      className="mr-1"
                      fill="currentColor"
                      height="12"
                      role="img"
                      viewBox="0 0 192 192"
                      width="12"
                    >
                      <title>Threads</title>
                      <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"></path>
                    </svg>
                    {profileData.username}
                  </span>
                </div>
                {profileData.bio && (
                  <p className="text-sm">{profileData.bio}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mb-4">
                <button
                  style={styles.buttonPrimary}
                  className="flex-1 rounded-md py-1.5 text-sm font-medium transition-colors duration-200 hover:opacity-80"
                >
                  Following
                </button>
                <button
                  style={styles.buttonPrimary}
                  className="flex-1 rounded-md py-1.5 text-sm font-medium transition-colors duration-200 hover:opacity-80"
                  onClick={handlemessage}
                >
                  Message
                </button>
                <button
                  style={styles.buttonPrimary}
                  className="w-10 rounded-md py-1.5 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <polyline points="16 6 12 2 8 6"></polyline>
                    <line x1="12" y1="2" x2="12" y2="15"></line>
                  </svg>
                </button>
              </div>

              {/* Content Tabs */}
              <div
                className="border-t flex justify-around"
                style={{
                  borderColor: isDark
                    ? 'rgba(75, 85, 99, 0.5)'
                    : 'rgba(229, 231, 235, 0.8)',
                }}
              >
                <button className="py-2 px-4 border-t-2 border-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </button>
                <button className="py-2 px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            // Desktop Layout
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Photo Section */}
              <div className="md:w-1/3 flex justify-center">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500">
                  {profileData.photo ? (
                    <img
                      src={
                        profileData.photo || 'https://via.placeholder.com/150'
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        fontSize: '3rem',
                        fontWeight: '400',
                        fontFamily: 'Tagesschrift',
                        color: colors.textColor,
                        backgroundColor: isDark
                          ? 'rgba(55, 65, 81, 0.8)'
                          : 'rgba(229, 231, 235, 0.8)',
                        borderRadius: '50%',
                        boxShadow: isDark
                          ? '0 4px 8px rgba(0, 0, 0, 0.4)'
                          : '0 4px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      {profileData.initials}
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Information Section */}
              <div className="md:w-2/3">
                {/* Username and Actions */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <UserNameModal userdata={profileData} />

                  <button
                    style={styles.buttonPrimary}
                    className="rounded-full px-6 py-1.5 text-sm font-medium transition-colors duration-200 hover:opacity-80"
                  >
                    Following
                  </button>

                  <button
                    onClick={handlemessage}
                    style={styles.buttonPrimary}
                    className="rounded-full px-6 py-1.5 text-sm font-medium transition-colors duration-200 hover:opacity-80"
                  >
                    Message
                  </button>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 mb-6">
                  <span className="flex items-center">
                    <span className="font-medium">83</span>
                    <span style={styles.textMuted} className="ml-1">
                      Posts
                    </span>
                  </span>

                  <span className="flex items-center">
                    <span className="font-medium">2.2 M</span>
                    <span style={styles.textMuted} className="ml-1">
                      Followers
                    </span>
                  </span>

                  <span className="flex items-center">
                    <span className="font-medium">1,115</span>
                    <span style={styles.textMuted} className="ml-1">
                      Following
                    </span>
                  </span>
                </div>

                {/* Bio and Contact */}
                <div className="space-y-3">
                  <div className="font-medium">
                    {profileData.firstname + ' ' + profileData.lastname}
                  </div>

                  <div className="flex items-center">
                    <span
                      className="flex items-center px-3 py-1 rounded-full text-sm"
                      style={styles.threadsBadge}
                    >
                      <svg
                        aria-label="Threads"
                        className="mr-1"
                        fill="currentColor"
                        height="16"
                        role="img"
                        viewBox="0 0 192 192"
                        width="16"
                      >
                        <title>Threads</title>
                        <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"></path>
                      </svg>
                      {profileData.username}
                    </span>
                  </div>

                  {profileData.bio && <p className="mt-2">{profileData.bio}</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation - Only shown on mobile */}
      {isMobile && (
        <div
          className="fixed bottom-0 left-0 right-0 flex justify-around items-center py-2 z-10"
          style={{
            backgroundColor: isDark
              ? colors.backgroundColor || '#1f2937'
              : '#ffffff',
            borderTop: `1px solid ${
              isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.8)'
            }`,
          }}
        >
          <button className="p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </button>
          <button className="p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <button className="p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </button>
          <button className="p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <button className="p-2">
            <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden">
              {profileData.photo ? (
                <img
                  src={profileData.photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-400 text-xs">
                  {profileData.initials}
                </div>
              )}
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
