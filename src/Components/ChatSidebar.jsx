import React, { useMemo } from 'react';
import { useMessages } from '../Hook/useMessages';

const formatTime = (date) => {
  const now = new Date();
  const diff = now - date;
  const oneDay = 24 * 60 * 60 * 1000;

  if (diff < oneDay) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diff < 7 * oneDay) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  } else {
    return `${date.getMonth() + 1}/${date.getDate()}/${date
      .getFullYear()
      .toString()
      .substr(-2)}`;
  }
};

// Separated ChatListItem as its own component with memoization
const ChatListItem = React.memo(({ chat, selected, onSelect }) => {
  // Only use the isUserOnline function from useMessages
  const { isUserOnline } = useMessages(chat._id);

  // Check if this specific user is online
  const isOnline = isUserOnline(chat.userId);

  const handleClick = () => onSelect(chat);

  return (
    <div
      className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${
        selected ? 'bg-gray-100' : ''
      }`}
      onClick={handleClick}
    >
      {/* Avatar */}
      <div className="relative">
        <div className="h-12 w-12 rounded-full overflow-hidden">
          <img
            src={chat.avatar || '/api/placeholder/40/40'}
            alt={chat.username}
            className="h-full w-full object-cover"
          />
        </div>
        {isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
        )}
      </div>

      {/* Info */}
      <div className="ml-3 flex-1 overflow-hidden">
        <div className="flex justify-between items-baseline">
          <h3 className="font-semibold text-sm truncate">{chat.username}</h3>
          <span className="text-xs text-gray-500">
            {formatTime(new Date(chat.updatedAt))}
          </span>
        </div>
        <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
      </div>
    </div>
  );
});

const ChatSidebar = ({
  chats,
  searchText,
  onSearchChange,
  selectedChat,
  onSelectChat,
}) => {
  // Filter chats based on search text
  const filteredChats = useMemo(() => {
    if (!chats) return [];
    if (!searchText) return chats;

    return chats.filter(
      (chat) =>
        chat.username.toLowerCase().includes(searchText.toLowerCase()) ||
        (chat.lastMessage &&
          chat.lastMessage.toLowerCase().includes(searchText.toLowerCase()))
    );
  }, [chats, searchText]);

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h1 className="font-semibold text-lg">Messages</h1>
        <button className="text-blue-500 hover:text-blue-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="w-6 h-6"
            viewBox="0 0 24 24"
          >
            <path d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats ? (
          filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <ChatListItem
                key={chat._id}
                chat={chat}
                selected={selectedChat?._id === chat._id}
                onSelect={onSelectChat}
              />
            ))
          ) : (
            <div className="p-4 text-gray-500">No chats found</div>
          )
        ) : (
          <div className="p-4 text-gray-500">Loading chats...</div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
