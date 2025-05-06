import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";


const socket = io("http://localhost:5000");

const StudentChat = () => {
    const userId = '6809e7a4ba4ffa4f777954b9' // Get the sender's user ID from localStorage
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        socket.emit("register", userId);
        fetchUsers();
    }, []);

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
        const newMessage = { senderId: userId, receiverId: selectedUser, content: message };
        socket.emit("sendMessage", newMessage);
        setMessages([...messages, newMessage]);
        setMessage("");
    };

    const handleLogout = () => {
        localStorage.removeItem("userId");
        window.location.reload(); // Refresh the page or navigate to login
    };

    useEffect(() => {
        socket.on("receiveMessage", (msg) => {
            if (msg.sender === selectedUser) {
                setMessages((prev) => [...prev, msg]);
            }
        });
    }, [selectedUser]);

    return (
        <div className="chat-container">
            <div className="sidebar">
                <h3>Users</h3>
                {/* <button className="logout-button" onClick={handleLogout}>Logout</button> */}
                <ul>
                    {users.map((user) => (
                        <li
                            key={user._id}
                            className={user._id === selectedUser ? "active" : ""}
                            onClick={() => fetchMessages(user._id)}
                        >
                            {user.firstName}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="chat-area">
                {selectedUser ? (
                    <>
                        <div className="messages">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={msg.sender === userId ? "message-container outgoing" : "message-container incoming"}
                                >
                                    <p className="message">{msg.content}</p>
                                </div>
                            ))}
                        </div>

                        <div className="message-input">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                            />
                            <button onClick={sendMessage}>Send</button>
                        </div>
                    </>
                ) : (
                    <p className="no-chat">Select a user to start chatting</p>
                )}
            </div>
        </div>
    );
};

export default StudentChat;