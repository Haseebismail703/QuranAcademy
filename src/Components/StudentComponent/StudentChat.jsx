import React, { useEffect, useState, useRef } from "react";
import {  Avatar, message as AntMessage, Badge } from "antd";
import {
    MessageOutlined,
    CloseOutlined,
    ArrowLeftOutlined,
    SendOutlined,
} from "@ant-design/icons";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const StudentChat = () => {
    const userId = "681c8fdc6329587244535349";
    const [showUsers, setShowUsers] = useState(false);
    const [showChats, setShowChats] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(10);
    const [message, setMessage] = useState("");
    const bottomRef = useRef(null);
    const panelRef = useRef(null);

    useEffect(() => {
        socket.emit("register", userId);
        fetchUsers();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return () => clearTimeout(timeout);
    }, [messages]);

    useEffect(() => {
        // Reset unread count when chat is opened
        if (showUsers || showChats) {
            setUnreadCount(0);
        }
    }, [showUsers, showChats]);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/allUser");
            setUsers(data.filter((user) => user._id !== userId));
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchMessages = async (receiverId) => {
        try {
            const { data } = await axios.get(
                `http://localhost:5000/api/messages/${userId}/${receiverId}`
            );
            setMessages(data.messages);
            setSelectedUser(receiverId);
            setShowUsers(false);
            setShowChats(true);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const sendMessage = () => {
        if (!message.trim()) return;
        const newMessage = { sender: userId, receiver: selectedUser, content: message };
        socket.emit("sendMessage", newMessage);
        setMessages([...messages, newMessage]);
        setMessage("");
    };

    useEffect(() => {
        socket.on("receiveMessage", (msg) => {
            if (msg.sender === selectedUser) {
                setMessages((prev) => [...prev, msg]);
            } else {
                // Increase unread count if chat is not open
                if (!showChats || msg.sender !== selectedUser) {
                    setUnreadCount(prev => prev + 1);
                }
            }
        });
    }, [selectedUser, showChats]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        AntMessage.success("Message copied!");
    };

    const handleDelete = (id) => {
        setMessages(messages.filter((_, index) => index !== id));
    };

    const handleBackToUsers = () => {
        setShowChats(false);
        setShowUsers(true);
    };

    const toggleChat = () => {
        setShowUsers(prev => !prev);
        if (showChats) {
            setShowChats(false);
        }
    };

    return (
        <>
            {/* Floating Chat Button with Badge */}
            <div className="fixed bottom-6 right-6 z-50  ">
                <Badge count={unreadCount} offset={[-5, 5]} className="cursor-pointer">
                    <button
                        onClick={toggleChat}
                        className={`w-14 h-14 cursor-pointer bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-600 transition-all duration-300 transform ${(showUsers || showChats) ? 'rotate-0' : 'hover:rotate-12'}`}
                    >
                        <MessageOutlined className="text-xl" />
                    </button>
                </Badge>
            </div>

            {/* Users Panel with Animation */}
            <div 
                ref={panelRef}
                className={`fixed bottom-24 right-6 w-80 bg-white rounded-t-lg shadow-xl z-40 border border-gray-200 transition-all duration-300 ease-in-out transform ${showUsers ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}
                style={{ maxHeight: showUsers ? '500px' : '0px' }}
            >
                <div className="bg-blue-500 text-white p-3 rounded-t-lg flex justify-between items-center">
                    <h3 className="font-semibold">Chat with</h3>
                    <CloseOutlined
                        onClick={() => setShowUsers(false)}
                        className="cursor-pointer hover:text-gray-200"
                    />
                </div>
                <div className="h-96 overflow-y-auto p-2">
                    {users.map((user) => (
                        <div
                            key={user._id}
                            onClick={() => fetchMessages(user._id)}
                            className="flex items-center gap-1 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                        >
                            <Avatar
                                size="large"
                                src={user.profileUrl || null}
                            >
                                {user.gender === "male" ? "👨" : user.gender === "female" ? "👩" : "👤"}
                            </Avatar>
                            <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.firstName || "No name"}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Panel with Animation */}
            <div 
                className={`fixed bottom-24 right-6 w-80 bg-white rounded-t-lg shadow-xl z-40 border border-gray-200 transition-all duration-300 ease-in-out transform ${showChats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}
                style={{ maxHeight: showChats ? '500px' : '0px' }}
            >
                <div className="bg-blue-500 text-white p-3 rounded-t-lg flex items-center">
                    <button onClick={handleBackToUsers} className="mr-2 hover:text-gray-200">
                        <ArrowLeftOutlined className="cursor-pointer hover:text-gray-200" />
                    </button>
                    <Avatar
                        size="small"
                        src={users.find((u) => u._id === selectedUser)?.profileUrl || null}
                        className="mr-"
                    >
                        {users.find((u) => u._id === selectedUser)?.gender === "male"
                            ? "👨"
                            : users.find((u) => u._id === selectedUser)?.gender === "female"
                                ? "👩"
                                : "👤"}
                    </Avatar>
                    <div className="flex-1 m-1">
                        <p className="font-semibold">
                            {users.find((u) => u._id === selectedUser)?.firstName || "User"}
                        </p>
                    </div>
                    <button onClick={() => setShowChats(false)} className="hover:text-gray-200">
                        <CloseOutlined />
                    </button>
                </div>

                <div className="h-64 overflow-y-auto p-4 bg-gray-50">
                    {messages.map((chat, index) => {
                        const isSender = chat.sender === userId;
                        const user = users.find((u) => u._id === (isSender ? userId : selectedUser));

                        return (
                            <div
                                key={index}
                                className={`flex mb-3 gap-1 ${isSender ? "justify-end" : "justify-start"}`}
                            >
                                {!isSender && (
                                    <Avatar
                                        size="small"
                                        src={user?.profileUrl || null}
                                        className="mr-2 mt-1"
                                    >
                                        {user?.gender === "male"
                                            ? "👨"
                                            : user?.gender === "female"
                                                ? "👩"
                                                : "👤"}
                                    </Avatar>
                                )}
                                <div className={`max-w-[70%] relative group`}>
                                    <div
                                        className={`px-3 py-2 rounded-lg ${isSender ? "bg-blue-500 text-white rounded-br-none" : "bg-white border border-gray-200 rounded-bl-none"}`}
                                    >
                                        {chat.content}
                                        {isSender && (
                                            <button
                                                onClick={() => handleDelete(index)}
                                                className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <CloseOutlined style={{ fontSize: '10px' }} />
                                            </button>
                                        )}
                                    </div>
                                    <div
                                        className={`text-xs text-gray-500 mt-1 ${isSender ? "text-right" : "text-left"}`}
                                    >
                                        {new Date().toLocaleTimeString([], {
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

                <div className="p-3 border-t border-gray-200 bg-white">
                    <div className="flex items-center">
                        {/* <button className="p-2 text-gray-500 hover:text-blue-500">
                            <PaperClipOutlined />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-blue-500">
                            <SmileOutlined />
                        </button> */}
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Type a message..."
                            className="flex-1 px-3 py-2 border-0 focus:outline-none"
                        />
                        <button
                            onClick={sendMessage}
                            className="p-2 text-blue-500 hover:text-blue-600"
                            disabled={!message.trim()}
                        >
                            <SendOutlined />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentChat;