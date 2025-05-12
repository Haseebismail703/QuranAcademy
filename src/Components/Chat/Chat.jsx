import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Avatar, message as AntMessage, Badge, notification } from "antd";
import { MessageOutlined, CloseOutlined, ArrowLeftOutlined, SendOutlined, SmileOutlined } from "@ant-design/icons";
import io from "socket.io-client";
import useSound from 'use-sound';
import axiosInstance from '../../Axios/axiosInstance.js';
import sendMessageTone from '../../assets/sendMessage.wav';

const socket = io("http://localhost:5000");

const Chat = ({ id, path, sound }) => {
  const userId = id;
  const [playSendMessageTone] = useSound(sendMessageTone);
  const [showUsers, setShowUsers] = useState(false);
  const [showChats, setShowChats] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const messageHandledRef = useRef(false);
  const isPageActive = useRef(true); // Track if page is active

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(`${path}/${userId}`);
      console.log(data)
      const studentList = data.users?.filter((user) => user._id !== userId) || [];
      const totalUnread = studentList.reduce(
        (sum, user) => sum + (user.unreadMessages || 0),
        0
      );
      setUsers(studentList);
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [userId, path]);

  const markMessagesAsRead = useCallback((receiverId) => {
    // Update local state for immediate UI update (set all unread messages to 0)
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u._id === receiverId ? { ...u, unreadMessages: 0 } : u
      )
    );

    // Notify server to mark messages as read
    socket.emit("markAsRead", {
      sender: receiverId,
      receiver: userId
    });

    // Reset unread count for the selected user
    setUnreadCount(prevCount => users.reduce(
      (sum, user) => sum + (user.unreadMessages || 0),
      0
    ));
  }, [userId, users]);

  const fetchMessages = useCallback(async (receiverId) => {
    try {
      const { data } = await axiosInstance.get(`/messages/${userId}/${receiverId}`);
      setMessages(data.messages);

      // Mark all messages as read when opening chat
      markMessagesAsRead(receiverId);

      const targetUser = users.find(user => user._id === receiverId);
      if (targetUser) {
        setSelectedUser(receiverId);
        setShowChats(true);
        setShowUsers(false);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [userId, users, markMessagesAsRead]);

  const handleReceiveMessage = useCallback((newMessage) => {
    if (messageHandledRef.current) return;
    messageHandledRef.current = true;

    const senderUser = users.find(u => u._id === newMessage.sender);
    const senderName = senderUser ? `${senderUser.firstName}` : 'Unknown';

    const isSender = newMessage.sender === userId;

    // Always play sound when receiving messages (not sent by self)
    if (!isSender) {
      console.log('sound')
      sound(); // Play sound for all incoming messages
      
      // Show notification if the chat with this user is not currently open
      if (newMessage.sender !== selectedUser) {
        setUsers(prevUsers => {
          const updatedUsers = prevUsers.map(u =>
            u._id === newMessage.sender
              ? { ...u, unreadMessages: (u.unreadMessages || 0) + 1 }
              : u
          );

          const totalUnread = updatedUsers.reduce(
            (sum, user) => sum + (user.unreadMessages || 0), 0
          );

          setUnreadCount(totalUnread);
          return updatedUsers;
        });

        api.open({
          message: `New message from ${senderName}`,
          description: newMessage.content,
          icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        });
      }
    }

    // Add message to current chat if needed
    if (newMessage.sender === selectedUser || newMessage.receiver === selectedUser) {
      setMessages(prev => {
        const exists = prev.find(msg => msg._id === newMessage._id);
        if (exists) return prev;
        return [...prev, newMessage];
      });
      scrollToBottom();
    }

    setTimeout(() => {
      messageHandledRef.current = false;
    }, 100);
  }, [selectedUser, users, userId, sound, api, scrollToBottom]);

  const handleDelete = (data) => {
    socket.emit("unsendLastMessage", {
      _id: data._id, // this is the actual MongoDB document id
      sender: data.sender,
      receiver: data.receiver,
    });
  };

  // Page visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      isPageActive.current = document.visibilityState === 'visible';
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    socket.on("messageUnsent", ({ _id, content }) => {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg._id === _id ? { ...msg, content } : msg
        )
      );
    });

    return () => {
      socket.off("messageUnsent");
    };
  }, []);

  // Memoize user list to prevent unnecessary re-renders
  const userList = useMemo(() => (
    users.map((user) => (
      <div
        key={user._id}
        onClick={() => fetchMessages(user._id)}
        className="flex items-center gap-1 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200"
      >
        <Badge
          dot={user.unreadMessages > 0}
          offset={[-5, 30]}
          color="red"
        >
          <Avatar size="large" src={user.profileUrl || null}>
            {user.gender === "male" ? "👨" : user.gender === "female" ? "👩" : "👤"}
          </Avatar>
        </Badge>
        <div className="ml-2 flex-1">
          <div className="flex justify-between items-center">
            <p className="font-medium">{user.firstName} {user.lastName}</p>
            {user.unreadMessages > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {user.unreadMessages}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 capitalize">{user.role || "No Role"}</p>
        </div>
      </div>
    ))
  ), [users, fetchMessages]);

  // Memoize message list to prevent unnecessary re-renders
  const messageList = useMemo(() => (
    messages.map((msg, index) => {
      const isSender = msg.sender === userId;
      const messageTime = new Date(msg.timestamp);
      const currentTime = new Date();
      const timeDifference = (currentTime - messageTime) / 1000;
      const showDeleteIcon = isSender && timeDifference <= 10 && msg.content !== "Message Deleted";

      return (
        <div
          key={`${msg._id || index}-${msg.timestamp}`}
          className={`flex mb-3 group ${isSender ? "justify-end" : "justify-start"
            } animate-fade-in`}
        >
          <div
            className={`max-w-xs px-3 py-2 rounded-lg relative ${isSender
              ? "bg-blue-500 text-white rounded-br-none"
              : "bg-gray-200 text-black rounded-bl-none"
              }`}
          >
            {showDeleteIcon && (
              <button
                onClick={() => handleDelete(msg, index)}
                className="absolute -left-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-red-500 hover:text-red-700 cursor-pointer"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}

            <div className="text-sm">{msg.content}</div>
            <div
              className={`text-xs mt-1 text-right ${isSender ? "text-blue-100" : "text-gray-500"
                }`}
            >
              {messageTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      );
    })
  ), [messages, userId]);

  useEffect(() => {
    socket.emit("register", userId);
    
    // Set up socket events in the main useEffect
    socket.on("receiveMessage", handleReceiveMessage);
    
    return () => {
      socket.off("receiveMessage");
    };
  }, [userId, handleReceiveMessage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    socket.on("messageRead", ({ senderId }) => {
      setUsers(prevUsers =>
        prevUsers.map(u =>
          u._id === senderId ? { ...u, unreadMessages: 0 } : u
        )
      );

      setUnreadCount(prevCount => users.reduce(
        (sum, user) => sum + (user.unreadMessages || 0),
        0
      ));
    });

    return () => {
      socket.off("messageRead");
    };
  }, [users]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    const tempMessage = {
      sender: userId,
      receiver: selectedUser,
      content: message,
    };

    try {
      // Emit to server, no local state push here!
      socket.emit("sendMessage", tempMessage);
      setMessage("");
      playSendMessageTone();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {contextHolder}

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Badge count={unreadCount} offset={[-5, 5]} className="cursor-pointer">
          <button
            onClick={() => {
              setShowUsers((prev) => !prev);
              setShowChats(false);
            }}
            className={`cursor-pointer w-14 h-14 bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-600 transition-all duration-300 transform ${showUsers || showChats
              ? "rotate-0 scale-100"
              : "hover:rotate-12 hover:scale-110"
              }`}
          >
            <MessageOutlined className="text-xl" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-ping"></span>
            )}
          </button>
        </Badge>
      </div>

      {/* Users Panel */}
      <div
        className={`fixed bottom-24 right-6 w-80 bg-white rounded-t-lg shadow-xl z-40 border border-gray-200 transition-all duration-300 transform ${showUsers
          ? "translate-y-0 opacity-100"
          : "translate-y-10 opacity-0 pointer-events-none"
          }`}
      >
        <div className="bg-blue-500 text-white p-3 rounded-t-lg flex justify-between items-center">
          <h3 className="font-semibold">Chat with</h3>
          <CloseOutlined
            onClick={() => setShowUsers(false)}
            className="cursor-pointer hover:scale-125 transition-transform"
          />
        </div>
        <div className="h-96 overflow-y-auto p-2">
          {[...users]
            .sort((a, b) => (b.unreadMessages || 0) - (a.unreadMessages || 0))
            .map((user) => (
              <div
                key={user._id}
                onClick={() => fetchMessages(user._id)}
                className="flex items-center gap-1 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200"
              >
                <Badge
                  dot={user.unreadMessages > 0}
                  offset={[-5, 30]}
                  color="red"
                >
                  <Avatar size="large" src={user.profileUrl || null}>
                    {user.gender === "male" ? "👨" : user.gender === "female" ? "👩" : "👤"}
                  </Avatar>
                </Badge>
                <div className="ml-2 flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    {user.unreadMessages > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {user.unreadMessages}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 capitalize">{user.role || "No Role"}</p>
                </div>
              </div>
            ))}

        </div>
      </div>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-6 w-80 bg-white rounded-t-lg shadow-xl z-40 border border-gray-200 transition-all duration-300 transform ${showChats
          ? "translate-y-0 opacity-100"
          : "translate-y-10 opacity-0 pointer-events-none"
          }`}
      >
        <div className="bg-blue-500 text-white p-3 rounded-t-lg flex items-center">
          <button
            onClick={() => {
              setShowChats(false);
              setShowUsers(true);
              if (selectedUser) {
                markMessagesAsRead(selectedUser);
              }
            }}
            className="hover:bg-blue-600 p-1 rounded-full transition-colors"
          >
            <ArrowLeftOutlined className="mr-2" />
          </button>
          <span className="font-semibold flex-1">
            {users.find((u) => u._id === selectedUser)?.firstName || "User"}
          </span>
          <CloseOutlined
            onClick={() => {
              setShowChats(false); // Hide the chat UI
              setShowUsers(true);  // Show the users list

              if (selectedUser) {
                markMessagesAsRead(selectedUser);
              }
            }}
            className="cursor-pointer hover:scale-125 transition-transform"
          />

        </div>
        <div className="h-64 overflow-y-auto p-4 bg-gray-50">
          {messages.map((msg, index) => {
            const isSender = msg.sender === userId;
            const messageTime = new Date(msg.timestamp);
            const currentTime = new Date();
            const timeDifference = (currentTime - messageTime) / 1000;
            const isDeleted = msg.content === "This message was deleted";
            const showDeleteIcon = isSender && timeDifference <= 10 && !isDeleted;

            return (
              <div
                key={msg._id || msg.tempId}
                className={`flex mb-3 group ${isSender ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg relative 
          ${isDeleted
                      ? "bg-gray-300 text-gray-600 italic"
                      : isSender
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-black rounded-bl-none"
                    }`}
                >
                  {/* Delete Icon */}
                  {showDeleteIcon && (
                    <button
                      onClick={() => handleDelete(msg, index)}
                      className="absolute -left-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-red-500 hover:text-red-700 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Message Text */}
                  <div className="text-sm">
                    {msg.content}
                  </div>

                  {/* Timestamp */}
                  <div
                    className={`text-xs mt-1 text-right ${isSender ? "text-blue-100" : "text-gray-500"
                      }`}
                  >
                    {messageTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>
        <div className="flex items-center p-2 border-t border-gray-300">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-2 border rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            placeholder="Type a message..."
            disabled={isSending}
          />
          <button
            onClick={sendMessage}
            disabled={isSending || !message.trim()}
            className={`p-2 rounded-full ${isSending || !message.trim()
              ? "text-gray-400"
              : "text-blue-500 hover:text-blue-600 hover:bg-blue-100"
              } transition-colors`}
          >
            {isSending ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <SendOutlined />
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Chat;