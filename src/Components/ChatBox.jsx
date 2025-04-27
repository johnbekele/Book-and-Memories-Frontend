import React, { useRef, useEffect } from 'react';

const ChatBox = ({
  selectedChat,
  messages,
  isLoading,
  messageText,
  onMessageChange,
  onSendMessage,
}) => {
  const messagesEndRef = useRef(null);
  const currentUserId = localStorage.getItem('userId') || 'current_user';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
              {selectedChat.isOnline ? 'Active now' : 'Active recently'}
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
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${
                  message.sender._id === currentUserId
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`py-2 px-3 rounded-2xl max-w-xs break-words ${
                    message.sender._id === currentUserId
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
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
          />
          <button
            type="submit"
            className="ml-3 text-blue-500 font-semibold text-sm hover:text-blue-700"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
