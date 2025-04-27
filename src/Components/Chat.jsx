import React, { useState } from 'react';
import { useMessages } from '../Hook/useMessages.js'; // Assuming we created the custom hook
// import { useParams } from 'react-router-dom';

const ChatPage = () => {
  // const { chatId } = useParams(); // Get chatId from URL params
  const chatId = '680e1a07fb48cf4935c42079';
  const { messages, isLoading, sendMessage } = useMessages(chatId);

  const [messageText, setMessageText] = useState('');

  // In ChatPage.jsx
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessage(messageText); // Just pass the content directly
      setMessageText('');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header */}
      <div className="flex items-center justify-between bg-blue-500 p-4">
        <span className="text-white text-lg">Chat with User</span>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {isLoading ? (
          <div className="text-center">Loading messages...</div>
        ) : (
          <div className="space-y-4">
            {messages?.map((message) => (
              <div
                key={message._id}
                className={`flex ${
                  message.sender._id === 'yourUserId'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`p-3 max-w-xs rounded-lg ${
                    message.sender._id === 'yourUserId'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300 text-black'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Input Box */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="ml-4 p-2 bg-blue-500 text-white rounded-full"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
