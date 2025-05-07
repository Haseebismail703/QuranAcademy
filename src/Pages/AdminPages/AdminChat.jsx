import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { Avatar } from 'antd'
const socket = io("http://localhost:5000");

const AdminChat = () => {
    const userId = '6819f86a1593e08d2c1ee579';
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => {
        socket.emit("register", userId);
        fetchUsers();
    }, []);
    useEffect(() => {
        const timeout = setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100); // 100ms delay ensures DOM is ready

        return () => clearTimeout(timeout);
    }, [messages]);


    const fetchUsers = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/allUser");
            console.log(data)
            setUsers(data.filter((user) => user._id !== userId));
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchMessages = async (receiverId) => {
        try {
            setSelectedUser(receiverId);
            const { data } = await axios.get(`http://localhost:5000/api/messages/${userId}/${receiverId}`);
            setMessages(data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const sendMessage = () => {
        if (!message.trim()) return;


        const newMessage = {
            sender: userId,
            receiver: selectedUser,
            content: message
        };


        socket.emit("sendMessage", newMessage);
        setMessages([...messages, newMessage]);
        setMessage("");
    };

    useEffect(() => {
        socket.on("receiveMessage", (msg) => {
            if (msg.sender === selectedUser) {
                setMessages((prev) => [...prev, msg]);
            }
        });
    }, [selectedUser]);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Users</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <ul className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <li
                                key={user._id}
                                className={`p-4 hover:bg-blue-50 cursor-pointer transition-colors ${user._id === selectedUser ? "bg-blue-100" : ""}`}
                                onClick={() => fetchMessages(user._id)}
                            >
                                <div className="flex items-center">
                                    <div className="h-10 w-10">
                                        {user.profileUrl ? (
                                            <Avatar
                                                size="large"
                                                src={user.profileUrl}
                                            />
                                        ) : (
                                            <Avatar
                                                size="large"
                                                style={{
                                                    backgroundColor: "#87d068",
                                                    verticalAlign: "middle",
                                                    fontSize: "18px",
                                                }}
                                            >
                                                {user.gender === "male" ? "👨" : user.gender === "female" ? "👩" : "👤"}
                                            </Avatar>
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500">@{user.username}</p>
                                    </div>
                                </div>
                            </li>
                        ))}

                    </ul>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 bg-white">
                            <h3 className="text-lg font-medium text-gray-800">
                                {users.find(u => u._id === selectedUser)?.firstName || 'Chat'}
                            </h3>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                            <div className="space-y-4">
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${msg.sender === userId ? "justify-end" : "justify-start"
                                            }`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender === userId
                                                    ? "bg-blue-500 text-white rounded-br-none"
                                                    : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                                                }`}
                                        >
                                            <p>{msg.content}</p>
                                            <p className={`text-xs mt-1 ${msg.sender === userId ? "text-blue-100" : "text-gray-500"
                                                }`}>
                                                {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                ))}
                                <div ref={bottomRef} />
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-gray-200 bg-white">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                />
                                <button
                                    onClick={sendMessage}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center p-6 max-w-md">
                            <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No chat selected</h3>
                            <p className="text-gray-500">Select a user from the sidebar to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChat;