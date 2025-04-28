import React, { useRef, useEffect, useContext } from 'react';
import AuthContext from '../Context/AuthContext';

const ChatBox = ({
  selectedChat,
  messages,
  isLoading,
  isSending,
  messageText,
  onMessageChange,
  onSendMessage,
  isOnline,
}) => {
  const messagesEndRef = useRef(null);
  const { user } = useContext(AuthContext);
  const currentUserId = user.id;
  console.log('the current user', currentUserId);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Group messages by sender and time
  const groupMessages = (messages) => {
    const groups = [];
    let currentGroup = null;

    messages.forEach((message) => {
      const isCurrentUser = message.sender._id === currentUserId;

      // Start a new group if:
      // 1. No current group exists
      // 2. Sender changed (from me to them or vice versa)
      // 3. Time gap is more than 5 minutes from last message
      if (
        !currentGroup ||
        currentGroup.isCurrentUser !== isCurrentUser ||
        new Date(message.createdAt) -
          new Date(
            currentGroup.messages[currentGroup.messages.length - 1].createdAt
          ) >
          5 * 60 * 1000
      ) {
        if (currentGroup) {
          groups.push(currentGroup);
        }

        currentGroup = {
          isCurrentUser,
          senderId: message.sender._id,
          senderName: message.sender.username || 'User',
          senderAvatar: message.sender.avatar || '/default-avatar.png',
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
      <div className="flex flex-col items-center justify-center h-full text-center p-6 flex-1">
        <div className="w-24 h-24 rounded-full border-2 border-gray-200 flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400"
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
        <h2 className="text-xl font-semibold text-gray-800">Your Messages</h2>
        <p className="text-gray-500 mt-2 mb-6 max-w-sm">
          Send private photos and messages to a friend or group
        </p>
        <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition">
          Send Message
        </button>
      </div>
    );
  }

  const messageGroups = groupMessages(messages);

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full overflow-hidden">
            <img
              src={selectedChat.avatar}
              alt={selectedChat.username}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-sm">{selectedChat.username}</h3>
            <p className="text-xs text-gray-500">
              {isOnline ? 'Active now' : 'Active recently'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-white">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-6">
            {messageGroups.map((group, groupIndex) => (
              <div
                key={`group-${groupIndex}`}
                className={`flex ${
                  group.isCurrentUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* Avatar for other user's messages */}
                {!group.isCurrentUser && (
                  <div className="h-8 w-8 rounded-full overflow-hidden mr-2 self-end">
                    <img
                      src={group.senderAvatar}
                      alt={group.senderName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Message group */}
                <div className="max-w-[70%]">
                  {/* Display name for other users */}
                  {!group.isCurrentUser && (
                    <p className="text-xs text-gray-500 mb-1 ml-1">
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
                      let bubbleClasses = 'py-2 px-3 break-words';

                      if (group.isCurrentUser) {
                        // Current user's messages (right side)
                        bubbleClasses += ' bg-blue-500 text-white shadow-md';

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
                        bubbleClasses += ' bg-gray-100 text-gray-800 shadow';

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

                      return (
                        <div
                          key={
                            message._id ||
                            `temp-message-${groupIndex}-${messageIndex}`
                          }
                        >
                          <div className={bubbleClasses}>
                            <p className="text-sm">
                              {message.objectcontent || message.content}
                            </p>
                          </div>

                          {/* Show timestamp on last message of group */}
                          {isLast && (
                            <p
                              className={`text-xs text-gray-500 mt-1 ${
                                group.isCurrentUser ? 'text-right mr-1' : 'ml-1'
                              }`}
                            >
                              {new Date(message.createdAt).toLocaleTimeString(
                                [],
                                { hour: '2-digit', minute: '2-digit' }
                              )}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Only show avatar for current user if needed - removed as per request */}
                {/* {group.isCurrentUser && (
                  <div className="h-8 w-8 rounded-full overflow-hidden ml-2 self-end">
                    <img
                      src="/user-avatar.png"
                      alt="You"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )} */}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="text-center text-gray-500">No messages yet</div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={onSendMessage} className="flex items-center">
          <input
            type="text"
            placeholder="Message..."
            value={messageText}
            onChange={(e) => onMessageChange(e.target.value)}
            className="flex-1 py-2 px-3 rounded-full bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm"
            disabled={isSending}
          />
          <button
            type="submit"
            className={`ml-3 font-semibold text-sm ${
              isSending ? 'text-gray-400' : 'text-blue-500 hover:text-blue-700'
            }`}
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
