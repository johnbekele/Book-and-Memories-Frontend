// ModerationWarning.jsx
import React from 'react';
import { useTheme } from '../Context/ThemeContext';

const ModerationWarning = ({ warning, onClose }) => {
  const { colors } = useTheme();

  if (!warning.isVisible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="rounded-lg p-6 max-w-md w-full mx-4"
        style={{ backgroundColor: colors.backgroundColor }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          className="text-xl font-bold mb-2"
          style={{ color: colors.textColor }}
        >
          Comment Not Posted
        </h3>

        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
          role="alert"
        >
          <p className="font-bold">Content Policy Violation</p>
          <p>{warning.reason}</p>
        </div>

        <p className="mb-4" style={{ color: colors.textColor }}>
          Your comment was flagged and not posted. Please review our community
          guidelines.
        </p>

        <div className="border border-gray-300 rounded p-3 mb-4 bg-gray-50">
          <p className="text-gray-700 italic">"{warning.comment}"</p>
        </div>

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={onClose}
        >
          I Understand
        </button>
      </div>
    </div>
  );
};

export default ModerationWarning;
