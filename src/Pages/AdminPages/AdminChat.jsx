import React, { useState, useEffect, useRef } from 'react';
import io from "socket.io-client";
import axios from "axios";
import { Avatar } from 'antd'
const socket = io("http://localhost:5000");
import { DeleteOutlined } from '@ant-design/icons'
const FunctionalChatLogic = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const [showUserList, setShowUserList] = useState(true);
    const [showChats, setShowChats] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const bottomRef = useRef(null);

    const userId = "681c8fc56329587244535343";

    const filteredUsers = users.filter(user =>
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSendMessage = () => {
        if (newMessage.trim() === '' || !selectedUser) return;

        const newMsg = {
            id: messages.length + 1,
            sender: userId,
            receiver: selectedUser._id,
            content: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        socket.emit("sendMessage", newMsg);
        setMessages([...messages, newMsg]);
        setNewMessage('');
    };

    const handleResize = () => {
        const isMobile = window.innerWidth < 768;
        setIsMobileView(isMobile);
        if (isMobile && !selectedUser) {
            setShowUserList(true);
            setShowChats(false);
        } else if (!isMobile) {
            setShowUserList(true);
            setShowChats(true);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/allUser");
            setUsers(data.filter((user) => user._id !== userId));

            if (selectedUser && !data.some(user => user._id === selectedUser._id)) {
                setSelectedUser(null);
            }

            if (selectedUser) {
                fetchMessages(selectedUser._id, false);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    // Inside your component
    useEffect(() => {
        socket.on('messageRead', ({ messageId }) => {
            setMessages(prev =>
                prev.map(m => (m._id === messageId ? { ...m, read: true } : m))
            );
        });

        return () => {
            socket.off('messageRead');
        };
    }, []);

    const fetchMessages = async (receiverId, switchView = true) => {
        try {
            const { data } = await axios.get(
                `http://localhost:5000/api/messages/${userId}/${receiverId}`
            );
            setMessages(data.messages);

            const targetUser = users.find(user => user._id === receiverId);
            if (targetUser) {
                setSelectedUser(targetUser);

                // Mark messages as read on server
                socket.emit("markAsRead", {
                    sender: receiverId,  // person you're chatting with
                    receiver: userId     // you (the reader)
                });

                if (isMobileView && switchView) {
                    setShowUserList(false);
                    setShowChats(true);
                }

                setUsers(users.map(u =>
                    u._id === receiverId ? { ...u, unread: 0 } : u
                ));
            }

        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };


    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [selectedUser]);

    useEffect(() => {
        socket.emit("register", userId);
        fetchUsers();

        socket.on("connect", () => {
            socket.emit("register", userId);
            fetchUsers();
        });

        return () => {
            socket.off("connect");
        };
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return () => clearTimeout(timeout);
    }, [messages]);

    useEffect(() => {
        if (showUserList || showChats) {
            setUnreadCount(0);
        }
    }, [showUserList, showChats]);

    useEffect(() => {
        socket.on("receiveMessage", (message) => {
            setMessages(prev => [...prev, message]);

            // ✅ Only mark as read if the user is chatting with this sender AND chat screen is visible
            if (
                selectedUser &&
                selectedUser._id === message.sender &&
                showChats === true // <- you must be in chat screen
            ) {
                socket.emit("markAsRead", {
                    sender: message.sender,
                    receiver: userId
                });
            } else {
                // 🔔 Increase unread count for user
                setUsers(prevUsers =>
                    prevUsers.map(u =>
                        u._id === message.sender ? { ...u, unread: (u.unread || 0) + 1 } : u
                    )
                );
            }
        });



        return () => {
            socket.off("receiveMessage");
        };
    }, [selectedUser, showChats]);

    useEffect(() => {
        if (!isMobileView && !selectedUser && users.length > 0) {
            fetchMessages(users[0]._id, false);
        }
    }, [isMobileView, users]);

    const userMessages = selectedUser
        ? messages.filter(
            msg =>
                (msg.sender === userId && msg.receiver === selectedUser._id) ||
                (msg.sender === selectedUser._id && msg.receiver === userId)
        )
        : [];

    // This hook returns logic state and functions if needed externally
    return (
        <div className="flex h-screen bg-gray-50">
            {/* User List Sidebar */}
            {showUserList && (
                <div className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 shadow-sm 
                ${isMobileView ? 'fixed inset-0 z-20 animate-slide-in' : 'relative'}`}>
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 bg-indigo-600 text-white">
                        <div className="flex justify-between items-center">
                            <h1 className="text-xl font-bold">Messages</h1>
                            {isMobileView && selectedUser && (
                                <button
                                    onClick={() => {
                                        setShowUserList(false);
                                        setShowChats(true);
                                    }}
                                    className="p-1 rounded-full hover:bg-indigo-500 transition-colors"
                                >
                                </button>
                            )}
                        </div>


                        {/* Search */}
                        <div className="mt-4 relative">
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                className="w-full p-2 pl-10 rounded-lg bg-indigo-500 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg className="absolute left-3 top-3 h-5 w-5 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* User List */}
                    <div className="overflow-y-auto h-[calc(100%-120px)]">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <div
                                    key={user._id}
                                    onClick={() => {
                                        fetchMessages(user._id, true);
                                    }}
                                    className={`flex items-center p-4 border-b border-gray-100 cursor-pointer transition-colors
                                    ${selectedUser?._id === user._id ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                                >
                                    <div className="relative">
                                        <Avatar
                                            size="large"
                                            src={user?.profileUrl || null}
                                            className="mr-2 mt-1"
                                        >
                                            {user?.gender === "male"
                                                ? "👨"
                                                : user?.gender === "female"
                                                    ? "👩"
                                                    : "👤"}
                                        </Avatar>
                                    </div>

                                    <div className="ml-2 flex-1">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-semibold text-gray-800">{user.firstName}</h4>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-sm text-gray-500 truncate max-w-[180px]">vefvdfvfd</p>
                                            {user.unread > 0 && (
                                                <span className="bg-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                    {user.unread}
                                                </span>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                                No contacts found
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${isMobileView && !showChats ? 'hidden' : ''}`}>
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="flex items-center p-4 border-b border-gray-200 bg-white shadow-sm">
                            {isMobileView && (
                                <button
                                    onClick={() => {
                                        setShowUserList(true);
                                        setShowChats(false);
                                    }}
                                    className="p-3 mr-3 rounded-full hover:bg-gray-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}

                            <div className="flex items-center">
                                <div className="relative">
                                    <Avatar
                                        size="large"
                                        src={selectedUser?.profileUrl || null}
                                        className="mr-3 mt-1"
                                    >
                                        {selectedUser?.gender === "male"
                                            ? "👨"
                                            : selectedUser?.gender === "female"
                                                ? "👩"
                                                : "👤"}
                                    </Avatar>
                                </div>
                                <div className="ml-2">
                                    <h2 className="font-semibold text-lg text-gray-800">{selectedUser.firstName}</h2>
                                    <p className="text-sm text-gray-500">{selectedUser.role}</p>
                                </div>
                            </div>
                        </div>
                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
                            {userMessages.length > 0 ? (
                                userMessages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${msg.sender === userId ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`relative group max-w-xs md:max-w-md px-4 py-2 rounded-lg text-sm shadow-sm
                                             ${msg.sender === userId
                                                    ? 'bg-indigo-500 text-white rounded-br-none'
                                                    : 'bg-white text-gray-800 rounded-bl-none'
                                                }`}
                                        >
                                            {msg.sender === userId && (
                                                <DeleteOutlined
                                                    onClick={() => handleDelete(msg._id)} // Replace with your delete function
                                                    className="absolute left-0 top-1/2 -translate-y-1/2 ml-[-24px] text-sm text-red-600 opacity-0 group-hover:opacity-100 cursor-pointer bg-red-400"
                                                />
                                            )}
                                            <p>{msg.content}</p>
                                            <div className="text-xs mt-1 text-right opacity-70">{msg.timestamp?.substring(0, 10)}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    No messages yet. Start the conversation!
                                </div>
                            )}
                            <div ref={bottomRef}></div>
                        </div>



                        {/* Chat Input */}
                        <div className="p-4 border-t border-gray-200 bg-white">
                            <div className="flex items-center space-x-4">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        {users.length > 0 ?
                            "Select a user to start chatting" :
                            "Loading contacts..."}
                    </div>
                )}
            </div>
        </div>
    )
};

export default FunctionalChatLogic;
