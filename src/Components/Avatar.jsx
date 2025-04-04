import React from 'react';
import PropTypes from 'prop-types';

const Avatar = ({
  src,
  alt,
  size = 'md',
  className = '',
  showStatus = false,
  status = 'offline',
  fallbackInitials = true,
}) => {
  // Define size classes
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-20 w-20 text-2xl',
  };

  // Status indicator classes
  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500',
  };

  // Get initials from alt text for fallback
  const getInitials = () => {
    if (!alt) return '?';
    return alt
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Handle image load error
  const [imageError, setImageError] = React.useState(false);
  const handleError = () => setImageError(true);

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Avatar image or fallback */}
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          onError={handleError}
          className={`rounded-full object-cover ${sizeClasses[size]}`}
        />
      ) : fallbackInitials ? (
        <div
          className={`rounded-full flex items-center justify-center bg-gray-200 text-gray-600 font-medium ${sizeClasses[size]}`}
          title={alt}
        >
          {getInitials()}
        </div>
      ) : (
        <div
          className={`rounded-full flex items-center justify-center bg-gray-200 ${sizeClasses[size]}`}
          title={alt}
        >
          <svg
            className="w-1/2 h-1/2 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Status indicator */}
      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${statusClasses[status]}`}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  className: PropTypes.string,
  showStatus: PropTypes.bool,
  status: PropTypes.oneOf(['online', 'offline', 'busy', 'away']),
  fallbackInitials: PropTypes.bool,
};

export default Avatar;
