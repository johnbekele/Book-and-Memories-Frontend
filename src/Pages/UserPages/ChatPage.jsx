import React, { useState, useEffect } from 'react';
import { useMessages } from '../../Hook/useMessages.js';
import ChatSidebar from '../../Components/ChatSidebar.jsx';
import ChatBox from '../../Components/ChatBox';
import { useChat } from '../../Hook/useChat.js';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchText, setSearchText] = useState('');
  const { chats, isError: chatError } = useChat();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showChatList, setShowChatList] = useState(true);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);

      // If switching from mobile to desktop, make sure both panels are visible
      if (!newIsMobile) {
        setShowChatList(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { messages, isLoading, sendMessage, isSending, isUserOnline } =
    useMessages(selectedChat?._id || '');

  const filteredChats =
    searchText.trim() === ''
      ? chats
      : chats?.filter((chat) =>
          chat.username.toLowerCase().includes(searchText.toLowerCase())
        ) || [];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim() && selectedChat) {
      sendMessage(messageText);
      setMessageText('');
    }
  };

  // When selecting a chat on mobile, hide the chat list and show the chat
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    if (isMobile) {
      setShowChatList(false); // Hide chat list and show the chat
    }
  };

  // Handle back button click on mobile - show the chat list
  const handleBackClick = () => {
    setShowChatList(true); // Show chat list when back button is clicked
  };

  return (
    <div className="flex h-screen bg-white border border-gray-200">
      {/* Show chat sidebar if not on mobile or if we're in chat list view */}
      {(!isMobile || showChatList) && (
        <ChatSidebar
          chats={filteredChats}
          searchText={searchText}
          onSearchChange={setSearchText}
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
          isMobileView={isMobile}
          onNewChatClick={() => {
            /* Handle new chat */
          }}
        />
      )}

      {/* Show chat box if not on mobile or if we're in chat view */}
      {(!isMobile || !showChatList) && selectedChat && (
        <ChatBox
          selectedChat={selectedChat}
          messages={messages}
          isLoading={isLoading}
          isSending={isSending}
          messageText={messageText}
          onMessageChange={setMessageText}
          onSendMessage={handleSendMessage}
          isOnline={selectedChat ? isUserOnline(selectedChat.userId) : false}
          onBackClick={handleBackClick}
        />
      )}
    </div>
  );
};

export default ChatPage;
