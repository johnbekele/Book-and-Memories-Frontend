import React, { useRef, useEffect, useContext, useState } from 'react';
import AuthContext from '../Context/AuthContext';
import { useTheme } from '../Context/ThemeContext';

const ChatBox = ({
  selectedChat,
  messages = [],
  isLoading,
  isSending,
  messageText,
  onMessageChange,
  onSendMessage,
  isOnline,
  onBackClick,
}) => {
  const messagesEndRef = useRef(null);
  const { user } = useContext(AuthContext);
  const { theme, colors } = useTheme();
  const isDark = theme === 'dark';
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const isPendingChat = selectedChat?.isPending;

  const currentUserId = user?.id;

  // Handle window resize to detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Group messages by sender and time
  const groupMessages = (messages) => {
    if (!Array.isArray(messages)) return [];

    const groups = [];
    let currentGroup = null;

    messages.forEach((message) => {
      // Skip invalid message objects
      if (!message || !message.sender) {
        console.warn('Invalid message object:', message);
        return;
      }

      // Debug message sender ID
      console.log(
        `Message from ${message.sender.username}, sender ID: ${message.sender._id}, current user ID: ${currentUserId}`
      );

      const isCurrentUser = message.sender._id === currentUserId;

      // Start a new group if:
      // 1. No current group exists
      // 2. Sender changed (from me to them or vice versa)
      // 3. Time gap is more than 5 minutes from last message
      if (
        !currentGroup ||
        currentGroup.isCurrentUser !== isCurrentUser ||
        !currentGroup.messages.length ||
        new Date(message.createdAt) -
          new Date(
            currentGroup.messages[currentGroup.messages.length - 1].createdAt
          ) >
          5 * 60 * 1000
      ) {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        console.log('message', message);
        currentGroup = {
          isCurrentUser,
          senderId: message.sender._id,
          senderName: message.sender.username || 'User',
          senderAvatar: message.sender.photo || '/default-avatar.png',
          messages: [message],
        };
      } else {
        // Add to existing group
        currentGroup.messages.push(message);
      }
    });

    // Add the last group if it exists
    if (currentGroup) {
      groups.push(currentGroup);
    }

    return groups;
  };

  if (!selectedChat) {
    return (
      <>
        {' '}
        {!isMobile && (
          <div className="flex flex-col items-center justify-center h-full text-center p-4 md:p-6 flex-1">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-gray-200 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 md:h-12 md:w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
              Your Messages
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 mb-4 md:mb-6 max-w-sm text-sm md:text-base">
              Send private photos and messages to a friend or group
            </p>
            <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition text-sm md:text-base">
              Send Message
            </button>
          </div>
        )}
      </>
    );
  }

  const messageGroups = groupMessages(messages || []);

  return (
    <div
      className={`flex-1 flex flex-col h-full ${
        isMobile ? 'fixed inset-0 z-50' : ''
      }`}
      style={{
        backgroundColor: isDark ? colors.backgroundColor : '#ffffff',
        color: isDark ? colors.textColor : '#1f2937',
      }}
    >
      {/* Chat Header */}
      <div
        className="p-3 md:p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
        style={{ backgroundColor: isDark ? colors.cardBackground : '#ffffff' }}
      >
        <div className="flex items-center">
          {isMobile && (
            <button
              onClick={onBackClick}
              className="mr-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          <div className="h-8 w-8 rounded-full overflow-hidden">
            <img
              src={selectedChat.avatar || '/default-avatar.png'}
              alt={selectedChat.username}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-sm">{selectedChat.username}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isOnline ? 'Active now' : 'Active recently'}
            </p>
          </div>
        </div>

        {/* Mobile-specific action buttons */}
        {isMobile && (
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      <div
        className="flex-1 p-3 md:p-4 overflow-y-auto"
        style={{ backgroundColor: isDark ? colors.backgroundColor : '#ffffff' }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : isPendingChat ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg max-w-xs">
              <p className="text-blue-600 dark:text-blue-400">
                Send your first message to start the conversation
              </p>
            </div>
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-4 md:space-y-6">
            {messageGroups.map((group, groupIndex) => (
              <div
                key={`group-${groupIndex}`}
                className={`flex ${
                  group.isCurrentUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* Avatar for other user's messages */}
                {!group.isCurrentUser && (
                  <div className="h-7 w-7 md:h-8 md:w-8 rounded-full overflow-hidden mr-2 self-end flex-shrink-0">
                    <img
                      src={group.senderAvatar}
                      alt={group.senderName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Message group */}
                <div
                  className={`${
                    isMobile ? 'max-w-[80%]' : 'max-w-[75%] md:max-w-[70%]'
                  }`}
                >
                  {/* Display name for other users */}
                  {!group.isCurrentUser && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1">
                      {group.senderName}
                    </p>
                  )}

                  {/* Messages */}
                  <div className="space-y-1">
                    {group.messages.map((message, messageIndex) => {
                      // Determine which message in the group gets special styling
                      const isFirst = messageIndex === 0;
                      const isLast = messageIndex === group.messages.length - 1;

                      // Tailwind classes for message bubbles
                      let bubbleClasses = 'py-2 px-3 break-words text-sm';

                      if (group.isCurrentUser) {
                        // Current user's messages (right side)
                        bubbleClasses += ' bg-blue-500 text-white';
                        // Add shadow for current user's messages (blue tint)
                        bubbleClasses += ' shadow-md';

                        if (group.messages.length === 1) {
                          bubbleClasses += ' rounded-2xl rounded-br-none';
                        } else if (isFirst) {
                          bubbleClasses +=
                            ' rounded-t-2xl rounded-bl-2xl rounded-br-none';
                        } else if (isLast) {
                          bubbleClasses +=
                            ' rounded-b-2xl rounded-bl-2xl rounded-br-none';
                        } else {
                          bubbleClasses += ' rounded-l-2xl';
                        }
                      } else {
                        // Other user's messages (left side)
                        bubbleClasses +=
                          ' bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
                        // Add shadow for other users' messages (light gray)
                        bubbleClasses += ' shadow';

                        if (group.messages.length === 1) {
                          bubbleClasses += ' rounded-2xl rounded-bl-none';
                        } else if (isFirst) {
                          bubbleClasses +=
                            ' rounded-t-2xl rounded-br-2xl rounded-bl-none';
                        } else if (isLast) {
                          bubbleClasses +=
                            ' rounded-b-2xl rounded-br-2xl rounded-bl-none';
                        } else {
                          bubbleClasses += ' rounded-r-2xl';
                        }
                      }

                      // Safely get message content
                      const messageContent = message
                        ? message.objectcontent || message.content || ''
                        : '';

                      return (
                        <div
                          key={
                            message._id ||
                            `temp-message-${groupIndex}-${messageIndex}`
                          }
                        >
                          <div className={bubbleClasses}>
                            <p>{messageContent}</p>
                          </div>

                          {/* Show timestamp on last message of group */}
                          {isLast && (
                            <p
                              className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
                                group.isCurrentUser ? 'text-right mr-1' : 'ml-1'
                              }`}
                            >
                              {new Date(
                                message.createdAt || Date.now()
                              ).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No messages yet. Send a message to start the conversation.
          </div>
        )}
      </div>

      {/* Input */}
      <div
        className="p-3 md:p-4 border-t border-gray-200 dark:border-gray-700"
        style={{ backgroundColor: isDark ? colors.cardBackground : '#ffffff' }}
      >
        <form onSubmit={onSendMessage} className="flex items-center">
          {/* Mobile emoji button */}
          {isMobile && (
            <button
              type="button"
              className="mr-2 text-gray-500 dark:text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          )}

          <input
            type="text"
            placeholder={
              isPendingChat ? 'Type your first message...' : 'Message...'
            }
            value={messageText}
            onChange={(e) => onMessageChange(e.target.value)}
            className="flex-1 py-2 px-3 rounded-full bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 text-sm"
            disabled={isSending}
            style={{
              backgroundColor: isDark ? colors.cardBackground : '#f3f4f6',
              color: isDark ? colors.textColor : '#374151',
              borderColor: isDark ? colors.borderColor : '#e5e7eb',
              '::placeholder': {
                color: isDark
                  ? 'rgba(156, 163, 175, 0.8)'
                  : 'rgba(107, 114, 128, 0.8)',
              },
            }}
          />

          {/* Mobile attachment button */}
          {isMobile && (
            <button
              type="button"
              className="ml-2 text-gray-500 dark:text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>
          )}

          <button
            type="submit"
            className={`ml-3 font-semibold text-sm ${
              isSending
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
            }`}
            disabled={isSending || !messageText.trim()}
          >
            {isSending ? 'Sending...' : isPendingChat ? 'Start Chat' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
