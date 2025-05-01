import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMessages } from '../../Hook/useMessages.js';
import ChatSidebar from '../../Components/ChatSidebar.jsx';
import ChatBox from '../../Components/ChatBox';
import { useChat } from '../../Hook/useChat.js';
import { API_URL } from '../../Config/EnvConfig';
import { useQueryClient } from '@tanstack/react-query';

const ChatPage = () => {
  const queryClient = useQueryClient();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchText, setSearchText] = useState('');
  const { chats, isError, createNewChat } = useChat();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showChatList, setShowChatList] = useState(true);
  const [pendingChat, setPendingChat] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null); // Track active chat ID
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const newChatUserId = searchParams.get('newChat');

  // Use the active chat ID for fetching messages
  const {
    messages,
    isLoading,
    sendMessage: sendMessageToApi,
    isSending,
    isUserOnline,
    refreshMessages,
  } = useMessages(activeChatId);

  // Effect to update active chat ID when selected chat changes
  useEffect(() => {
    if (selectedChat && !selectedChat.isPending) {
      setActiveChatId(selectedChat._id);
    } else {
      setActiveChatId(null);
    }
  }, [selectedChat]);

  // Handle new chat request from URL parameter
  useEffect(() => {
    const handleNewChatRequest = async () => {
      if (newChatUserId && chats) {
        console.log('Processing new chat request for user:', newChatUserId);

        // Check if chat already exists
        const existingChat = chats.find(
          (chat) =>
            chat.userId === newChatUserId ||
            chat.participants?.some((p) => p._id === newChatUserId)
        );

        if (existingChat) {
          console.log('Found existing chat:', existingChat);
          setSelectedChat(existingChat);
          setActiveChatId(existingChat._id); // Set active chat ID
          if (isMobile) {
            setShowChatList(false);
          }
        } else {
          try {
            // Get user info from users list
            const response = await axios.get(`${API_URL}/auth/users`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });

            const users = response.data;
            const targetUser = users.find((user) => user._id === newChatUserId);

            if (targetUser) {
              console.log(
                'Creating pending chat for user:',
                targetUser.firstname
              );

              const tempChat = {
                _id: `pending_${newChatUserId}`,
                isPending: true,
                userId: newChatUserId,
                username: `${targetUser.firstname} ${targetUser.lastname}`,
                avatar: targetUser.photo || '/default-avatar.png',
                participants: [{ _id: newChatUserId }],
              };

              setPendingChat(tempChat);
              setSelectedChat(tempChat);
              // Don't set activeChatId for pending chats

              if (isMobile) {
                setShowChatList(false);
              }
            } else {
              console.error('Target user not found in users list');
            }
          } catch (error) {
            console.error('Error fetching users:', error);
          }
        }
      }
    };

    if (newChatUserId) {
      handleNewChatRequest();
    }
  }, [newChatUserId, chats, isMobile]);

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

  // Enhanced send message handler
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage || !selectedChat) return;

    try {
      if (selectedChat.isPending) {
        console.log('Starting new chat flow for pending chat');

        // Create new chat
        const response = await createNewChat(selectedChat.userId);
        console.log('Chat created successfully:', response);

        if (!response || !response.chatId) {
          console.error('Failed to get valid chat ID');
          return;
        }

        const newChatId = response.chatId;
        console.log('New chat created with ID:', newChatId);

        // Create updated chat object
        const updatedChat = {
          ...response,
          _id: newChatId,
          username: selectedChat.username,
          avatar: selectedChat.avatar,
          isPending: false,
        };

        // Update UI first
        console.log('Setting selected chat to:', updatedChat);
        setSelectedChat(updatedChat);
        setPendingChat(null);
        setActiveChatId(newChatId); // Set the active chat ID to the new chat

        // Send message to new chat
        console.log('Sending message to new chat:', trimmedMessage);
        await sendMessageToApi(trimmedMessage, newChatId);

        // Invalidate queries to refresh data
        queryClient.invalidateQueries(['chats']);
        queryClient.invalidateQueries(['messages', newChatId]);

        // Add a temporary message to the UI while waiting for refresh
        queryClient.setQueryData(['messages', newChatId], (oldData = []) => {
          const tempMessage = {
            _id: `temp-${Date.now()}`,
            content: trimmedMessage,
            sender: {
              _id: localStorage.getItem('userId'),
              username: 'You',
              photo: localStorage.getItem('userPhoto') || '/default-avatar.png',
            },
            createdAt: new Date().toISOString(),
          };
          return [...(Array.isArray(oldData) ? oldData : []), tempMessage];
        });

        // Reset message text
        setMessageText('');

        // Force refresh messages for the new chat
        setTimeout(() => {
          refreshMessages();
        }, 500);
      } else {
        // For existing chats, use the normal flow
        console.log('Sending message to existing chat:', selectedChat._id);
        await sendMessageToApi(trimmedMessage);
        setMessageText('');
      }
    } catch (error) {
      console.error(
        'Failed to send message:',
        error.response?.data || error.message
      );
      alert(
        `Failed to send message: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // When selecting a chat on mobile, hide the chat list and show the chat
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setActiveChatId(chat._id); // Set active chat ID
    if (isMobile) {
      setShowChatList(false);
    }
  };

  // Handle back button click on mobile - show the chat list
  const handleBackClick = () => {
    setShowChatList(true);
  };

  return (
    <div className="flex h-screen bg-white border border-gray-200">
      {/* Show chat sidebar if not on mobile or if we're in chat list view */}
      {(!isMobile || showChatList) && (
        <ChatSidebar
          chats={chats || []}
          searchText={searchText}
          onSearchChange={setSearchText}
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
          isMobileView={isMobile}
          onNewChatClick={() => {
            navigate('/user-dashboard/chat');
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
