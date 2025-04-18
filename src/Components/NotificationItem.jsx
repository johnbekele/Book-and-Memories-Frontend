import React from 'react';
import { Link } from 'react-router-dom';

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
      {/* Icon */}
      {getIcon(notification)}

      {/* Content */}
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

      {/* Unread indicator */}
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

export default NotificationItem;
