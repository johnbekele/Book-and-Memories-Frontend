import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../Context/ThemeContext';
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';
import parseISO from 'date-fns/parseISO';

const NotificationModal = ({ onClose, notifications, isLoading, isError }) => {
  const { theme, colors, darkMode } = useTheme();

  const formatNotificationDate = (dateString) => {
    const date = parseISO(dateString);
    if (isToday(date)) return format(date, 'h:mm a');
    if (isYesterday(date)) return 'Yesterday';
    if (isThisWeek(date)) return format(date, 'EEEE');
    return format(date, 'MMM d');
  };

  const getNotificationIcon = (notification) => {
    const { type, category, title } = notification;

    if (type === 'moderator' && category === 'flag') {
      const isViolation = title.includes('violation has been found');
      const bgColor = darkMode
        ? isViolation
          ? 'bg-red-600'
          : 'bg-green-600'
        : isViolation
        ? 'bg-red-500'
        : 'bg-green-500';

      const iconPath = isViolation
        ? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
        : 'M5 13l4 4L19 7';

      return (
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center ${bgColor}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={iconPath}
            />
          </svg>
        </div>
      );
    }

    return (
      <div
        className={`h-10 w-10 rounded-full flex items-center justify-center ${
          darkMode ? 'bg-blue-600' : 'bg-blue-500'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    );
  };

  const groupNotificationsByDate = (notifications) => {
    const today = [];
    const yesterday = [];
    const thisWeek = [];
    const older = [];

    notifications.forEach((notification) => {
      const date = parseISO(notification.createdAt);

      if (isToday(date)) {
        today.push(notification);
      } else if (isYesterday(date)) {
        yesterday.push(notification);
      } else if (isThisWeek(date)) {
        thisWeek.push(notification);
      } else {
        older.push(notification);
      }
    });

    return { today, yesterday, thisWeek, older };
  };

  const { today, yesterday, thisWeek, older } =
    groupNotificationsByDate(notifications);

  const renderGroup = (label, group) => (
    <div className="notification-group">
      <h2
        className="px-4 py-2 text-sm font-semibold"
        style={{ color: colors.secondaryTextColor }}
      >
        {label}
      </h2>
      {group.map((notification) => (
        <NotificationItem
          key={notification._id}
          notification={notification}
          formatDate={formatNotificationDate}
          getIcon={getNotificationIcon}
          colors={colors}
          darkMode={darkMode}
        />
      ))}
    </div>
  );

  return (
    <div
      style={{
        backgroundColor: colors.backgroundColor,
        borderColor: colors.borderColor,
        color: colors.textColor,
      }}
      className="flex flex-col h-screen w-full sm:w-64 md:w-80 border-r transition-colors duration-200 shadow-lg"
    >
      {/* Header */}
      <div
        className="p-4 border-b flex items-center justify-between sticky top-0 z-10"
        style={{ borderColor: colors.borderColor }}
      >
        <h1 className="text-xl font-bold">Notifications</h1>
        <button
          onClick={onClose}
          aria-label="Close Notifications"
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Notification Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : isError ? (
          <div className="p-4 text-center text-red-500">
            Error loading notifications: {isError}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <>
            {today.length > 0 && renderGroup('Today', today)}
            {yesterday.length > 0 && renderGroup('Yesterday', yesterday)}
            {thisWeek.length > 0 && renderGroup('This Week', thisWeek)}
            {older.length > 0 && renderGroup('Older', older)}
          </>
        )}
      </div>
    </div>
  );
};

const NotificationItem = ({
  notification,
  formatDate,
  getIcon,
  colors,
  darkMode,
}) => {
  const { title, message, createdAt, read, relatedResource } = notification;

  return (
    <Link
      to={`/post/${relatedResource.id}`}
      className={`flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
        !read ? (darkMode ? 'bg-gray-800/40' : 'bg-blue-50/40') : ''
      }`}
    >
      {getIcon(notification)}
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p
          className="text-sm mt-0.5 line-clamp-2"
          style={{ color: colors.secondaryTextColor }}
        >
          {message}
        </p>
        <p className="text-xs mt-1" style={{ color: colors.tertiaryTextColor }}>
          {formatDate(createdAt)}
        </p>
      </div>
      {!read && (
        <div
          className={`w-2 h-2 rounded-full ${
            darkMode ? 'bg-blue-400' : 'bg-blue-500'
          }`}
        ></div>
      )}
    </Link>
  );
};

export default NotificationModal;
