// Chat.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import { useMessages } from '../Hook/useMessages.js';
import { useQueryClient } from '@tanstack/react-query';
import { API_URL } from '../Config/EnvConfig';
import AuthContext from '../Context/AuthContext.jsx';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const { messages = [], isLoading, isError, error } = useMessages();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);

  const SOCKET_URL = API_URL.split('/api')[0];
  // Connect to socket when component mounts
  useEffect(() => {
    console.log('Attempting to connect to socket at:', SOCKET_URL);

    const newSocket = io(API_URL, {
      auth: {
        token: localStorage.getItem('token'),
      },
      transports: ['websocket', 'polling'], // Try polling first, then websocket
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected successfully with ID:', newSocket.id);
      setConnectionStatus('connected');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
      setConnectionStatus(`error: ${err.message}`);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setConnectionStatus(`disconnected: ${reason}`);
    });

    setSocket(newSocket);

    return () => {
      console.log('Cleaning up socket connection');
      newSocket.disconnect();
    };
  }, []);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Handle incoming messages
    socket.on('chat message', (newMessage) => {
      console.log('Received new message:', newMessage);
      queryClient.setQueryData(['messages'], (oldData) => {
        return oldData ? [...oldData, newMessage] : [newMessage];
      });
    });

    // Handle initial message history
    socket.on('message history', (messageHistory) => {
      console.log('Received message history:', messageHistory);
      queryClient.setQueryData(['messages'], messageHistory);
    });

    // Handle errors
    socket.on('error', (errorMsg) => {
      console.error('Socket error:', errorMsg);
    });

    return () => {
      socket.off('chat message');
      socket.off('message history');
      socket.off('error');
    };
  }, [socket, queryClient]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socket || !user) return;

    console.log('Sending message:', input);
    const msgData = {
      text: input.trim(),
      userId: user.id,
      username: user.username,
      // roomId: currentRoomId, // Uncomment if using rooms
    };

    socket.emit('chat message', msgData);
    setInput(''); // Clear the input field
  };

  // Display connection status for debugging
  if (connectionStatus !== 'connected') {
    return (
      <div className="flex-1 flex flex-col justify-center items-center ml-64 p-6">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-4 text-center">
            Chat Connection
          </h2>
          <div className="text-center mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 rounded">
            Socket.IO Status:{' '}
            <span className="font-semibold">{connectionStatus}</span>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Reconnect
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center ml-64 p-6">
        <div className="text-xl">Loading messages...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex justify-center items-center ml-64 p-6">
        <div className="text-xl text-red-500">
          Error loading messages: {error?.message || 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col ml-64 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col h-[calc(100vh-150px)]">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">Chat Room</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {!messages || messages.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <ul className="space-y-3">
              {messages.map((msg) => (
                <li
                  key={msg._id || `temp-${Date.now()}-${Math.random()}`}
                  className={`p-3 rounded-lg max-w-[80%] ${
                    msg.sender._id === user?.id
                      ? 'ml-auto bg-blue-100 dark:bg-blue-900'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{msg.sender.username}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(
                        msg.createdAt || Date.now()
                      ).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="break-words">{msg.content}</div>
                </li>
              ))}
              <div ref={messagesEndRef} />
            </ul>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              disabled={!user}
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || !user}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
