import React, { useState } from 'react';
import { useMessages } from '../../Hook/useMessages.js';
import ChatSidebar from '../../Components/ChatSidebar.jsx';
import ChatBox from '../../Components/ChatBox';
import { useChat } from '../../Hook/useChat.js';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchText, setSearchText] = useState('');
  const { chats, isError } = useChat();

  console.log('chat', chats);
  const { messages, isLoading, sendMessage, isSending, isOnline } = useMessages(
    selectedChat?._id || ''
  );

  const filteredChats =
    searchText.trim() === ''
      ? chats
      : chats.filter((chat) =>
          chat.username.toLowerCase().includes(searchText.toLowerCase())
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
