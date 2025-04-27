import React, { useState } from 'react';
import { useMessages } from '../../Hook/useMessages.js';
import ChatSidebar from '../../Components/ChatSidebar.jsx';
import ChatBox from '../../Components/ChatBox';
import { useChat } from '../../Hook/useChat.js';

const DEMO_CHATS = [
  {
    _id: '1',
    username: 'johndoe',
    lastMessage: 'Hey, how are you?',
    avatar: '/api/placeholder/32/32',
    isOnline: true,
    updatedAt: new Date(),
  },
  {
    _id: '2',
    username: 'janedoe',
    lastMessage: 'Did you see that post?',
    avatar: '/api/placeholder/32/32',
    isOnline: false,
    updatedAt: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    _id: '3',
    username: 'mike_smith',
    lastMessage: "Let's meet tomorrow",
    avatar: '/api/placeholder/32/32',
    isOnline: true,
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    _id: '4',
    username: 'sarah_parker',
    lastMessage: 'Thanks for the help!',
    avatar: '/api/placeholder/32/32',
    isOnline: false,
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    _id: '5',
    username: 'chris_johnson',
    lastMessage: 'Check out this photo',
    avatar: '/api/placeholder/32/32',
    isOnline: true,
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchText, setSearchText] = useState('');
  const { chats, isError } = useChat();

  const filteredChats =
    searchText.trim() === ''
      ? DEMO_CHATS
      : DEMO_CHATS.filter((chat) =>
          chat.username.toLowerCase().includes(searchText.toLowerCase())
        );

  const { messages, isLoading, sendMessage } = useMessages(
    selectedChat?._id || ''
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim() && selectedChat) {
      sendMessage(messageText);
      setMessageText('');
    }
  };

  return (
    <div className="flex h-screen bg-white border border-gray-200">
      <ChatSidebar
        chats={filteredChats}
        searchText={searchText}
        onSearchChange={setSearchText}
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
      />
      <ChatBox
        selectedChat={selectedChat}
        messages={messages}
        isLoading={isLoading}
        messageText={messageText}
        onMessageChange={setMessageText}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatPage;
