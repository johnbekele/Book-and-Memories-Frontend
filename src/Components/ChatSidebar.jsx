import React, { useMemo, useState, useEffect } from 'react';
import { useMessages } from '../Hook/useMessages';
import { useTheme } from '../Context/ThemeContext';

const formatTime = (date) => {
  const now = new Date();
  const diff = now - date;
  const oneDay = 24 * 60 * 60 * 1000;

  if (diff < oneDay) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diff < 7 * oneDay) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  } else {
    return `${date.getMonth() + 1}/${date.getDate()}/${date
      .getFullYear()
      .toString()
      .substr(-2)}`;
  }
};

// Separated ChatListItem as its own component with memoization
// In ChatSidebar.jsx
// Remove the onBackClick prop from ChatListItem since it doesn't need it

const ChatListItem = React.memo(
  ({ chat, selected, onSelect, isDark, colors }) => {
    // Only use the isUserOnline function from useMessages
    const { isUserOnline } = useMessages(chat._id);

    // Check if this specific user is online
    const isOnline = isUserOnline(chat.userId);

    const handleClick = () => {
      onSelect(chat);
    };

    return (
      <div
        className={`flex items-center p-3 cursor-pointer transition-colors duration-200 ${
          selected
            ? isDark
              ? 'bg-gray-700'
              : 'bg-gray-100'
            : isDark
            ? 'hover:bg-gray-700'
            : 'hover:bg-gray-50'
        }`}
        onClick={handleClick}
        style={{
          backgroundColor: selected
            ? isDark
              ? colors.highlightBackground
              : ''
            : '',
          color: isDark ? colors.textColor : '',
        }}
      >
        {/* Avatar */}
        <div className="relative">
          <div className="h-12 w-12 rounded-full overflow-hidden">
            <img
              src={chat.avatar || '/api/placeholder/40/40'}
              alt={chat.username}
              className="h-full w-full object-cover"
            />
          </div>
          {isOnline && (
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
          )}
        </div>

        {/* Info */}
        <div className="ml-3 flex-1 overflow-hidden">
          <div className="flex justify-between items-baseline">
            <h3
              className={`font-semibold text-sm truncate ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              {chat.username}
            </h3>
            <span
              className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {formatTime(new Date(chat.updatedAt))}
            </span>
          </div>
          <p
            className={`text-sm truncate ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {chat.lastMessage || ''}
          </p>
        </div>
      </div>
    );
  }
);

const ChatSidebar = ({
  chats,
  searchText,
  onSearchChange,
  selectedChat,
  onSelectChat,
  isMobileView,
  onNewChatClick,
  onBackClick,
}) => {
  const { theme, colors } = useTheme();
  const isDark = theme === 'dark';
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Don't show sidebar in mobile view when a chat is selected
  if (isMobile && isMobileView && selectedChat) {
    return null;
  }

  // Filter chats based on search text
  const filteredChats = useMemo(() => {
    if (!chats) return [];
    if (!searchText) return chats;

    return chats.filter(
      (chat) =>
        chat.username.toLowerCase().includes(searchText.toLowerCase()) ||
        (chat.lastMessage &&
          chat.lastMessage.toLowerCase().includes(searchText.toLowerCase()))
    );
  }, [chats, searchText]);

  return (
    <div
      className={`${isMobile ? 'w-full' : 'w-80'} border-r flex flex-col`}
      style={{
        backgroundColor: isDark ? colors.backgroundColor : '#ffffff',
        borderColor: isDark ? colors.borderColor : '#e5e7eb',
      }}
    >
      {/* Header */}
      <div
        className="p-4 border-b flex justify-between items-center"
        style={{ borderColor: isDark ? colors.borderColor : '#e5e7eb' }}
      >
        <h1
          className={`font-semibold text-lg ${
            isDark ? 'text-gray-200' : 'text-gray-800'
          }`}
        >
          Messages
        </h1>
        <button
          onClick={onNewChatClick}
          className={`${
            isDark
              ? 'text-blue-400 hover:text-blue-300'
              : 'text-blue-500 hover:text-blue-700'
          } transition-colors`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="w-6 h-6"
            viewBox="0 0 24 24"
          >
            <path d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 ${
              isDark
                ? 'bg-gray-700 text-gray-200 focus:ring-gray-600'
                : 'bg-gray-100 text-gray-800 focus:ring-gray-300'
            }`}
            style={{
              backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : '#f3f4f6',
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 absolute left-3 top-2.5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats ? (
          filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <ChatListItem
                key={chat._id}
                chat={chat}
                selected={selectedChat?._id === chat._id}
                onSelect={onSelectChat}
                onBackClick={onBackClick}
                isDark={isDark}
                colors={colors}
              />
            ))
          ) : (
            <div
              className={`p-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              No chats found
            </div>
          )
        ) : (
          <div className={`p-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="flex justify-center items-center h-20">
              <div className="w-6 h-6 border-2 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Footer Navigation */}
      {isMobile && (
        <div
          className="border-t p-3 flex justify-around"
          style={{ borderColor: isDark ? colors.borderColor : '#e5e7eb' }}
        >
          <button
            className={`p-2 ${isDark ? 'text-blue-400' : 'text-blue-500'}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
          <button
            className={`p-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <button
            className={`p-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
