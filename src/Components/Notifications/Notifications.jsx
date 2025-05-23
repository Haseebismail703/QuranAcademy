import { useEffect, useState, useRef } from "react";
import { RefreshCw, Bell, CheckCircle, AlertCircle, Calendar, Clock } from "lucide-react";
import axiosInstance from "../../Axios/axiosInstance";


export default function Notification({userId,role}) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMsg, setSelectedMsg] = useState(null);
    const scrollContainerRef = useRef(null);

    const fetchMessages = async () => {
        try {
            setLoading(true);

            // Axios call to fetch notifications
            const res = await axiosInstance.get(`/api/noti/${userId}/${role}`);

            if (res.data.success) {
                setNotifications(res.data.notifications);
                setSelectedMsg(null); // Clear selected message when refreshing
            }
        } catch (err) {
            console.error("Error fetching messages:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleSelectMessage = (msg) => {
        setSelectedMsg(msg._id === selectedMsg ? null : msg._id);
    };

    return (
        <div className="flex flex-col md:flex-row items-start justify-center p-4 md:p-6 min-h-screen bg-gray-50">
            <div className="w-full md:w-2/3 lg:w-1/2 bg-white border border-gray-200 rounded-xl shadow-lg mb-4 md:mb-0 md:mr-4">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
                    <h2 className="text-xl font-bold flex items-center">
                        <Bell className="mr-2" size={20} />
                        Notifications
                    </h2>
                    <button
                        onClick={fetchMessages}
                        className="flex items-center px-3 py-1.5 bg-white text-blue-700 hover:bg-gray-100 font-medium text-sm rounded-lg transition-colors"
                    >
                        <RefreshCw className={`mr-1 ${loading ? 'animate-spin' : ''}`} size={16} />
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="overflow-y-auto max-h-[60vh] md:max-h-[70vh] px-4 py-2 divide-y divide-gray-100"
                >
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-2"></div>
                            <p>Loading notifications...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                            <Bell size={40} className="text-gray-300 mb-2" />
                            <p>No notifications found.</p>
                        </div>
                    ) : (
                        notifications.map((msg) => (
                            <div
                                key={msg._id}
                                onClick={() => handleSelectMessage(msg)}
                                className={`py-3 cursor-pointer transition-all duration-200 ${selectedMsg === msg._id ? 'bg-blue-50' : ''
                                    } ${!msg.isRead ? 'border-l-4 border-blue-500 pl-3' : 'pl-4'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-semibold ${!msg.isRead ? 'text-blue-700' : 'text-gray-700'}`}>
                                        {msg.title}
                                    </h3>
                                    <div className="flex items-center">
                                        {msg.isRead ? (
                                            <CheckCircle size={16} className="text-green-500 mr-1" />
                                        ) : (
                                            <AlertCircle size={16} className="text-blue-500 mr-1" />
                                        )}
                                        <span className={`text-xs ${msg.isRead ? 'text-green-500' : 'text-blue-500'}`}>
                                            {msg.isRead ? 'Read' : 'New'}
                                        </span>
                                    </div>
                                </div>

                                <p className={`text-sm break-words overflow-hidden ${selectedMsg === msg._id
                                        ? 'line-clamp-none'
                                        : 'line-clamp-1'
                                    } text-gray-600`}>
                                    {msg.message}
                                </p>


                                {selectedMsg === msg._id && (
                                    <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                                        <span className="flex items-center">
                                            <Clock size={12} className="mr-1" />
                                            {formatTime(msg.createdAt)}
                                        </span>
                                        <span className="flex items-center">
                                            <Calendar size={12} className="mr-1" />
                                            Expires: {formatDate(msg.expiryDate)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="w-full md:w-1/3 lg:w-1/2 bg-white border border-gray-200 rounded-xl shadow-lg hidden md:block">
                {selectedMsg ? (
                    notifications.filter(msg => msg._id === selectedMsg).map(msg => (
                        <div key={`detail-${msg._id}`} className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold text-gray-800">{msg.title}</h2>
                                <span className={` py-1 rounded-full text-xs font-medium ${msg.isRead ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {msg.isRead ? 'Read' : 'Unread'}
                                </span>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <p className="text-gray-700 whitespace-pre-line">{msg.message}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="text-gray-500 mb-1">Created</div>
                                    <div className="font-medium">{formatDate(msg.createdAt)}</div>
                                    <div className="text-gray-500 text-xs">{formatTime(msg.createdAt)}</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="text-gray-500 mb-1">Expires</div>
                                    <div className="font-medium">{formatDate(msg.expiryDate)}</div>
                                    <div className="text-gray-500 text-xs">{formatTime(msg.expiryDate)}</div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <Bell size={48} className="text-gray-300 mb-3" />
                        <p>Select a notification to view details</p>
                    </div>
                )}
            </div>
        </div>
    );
}
