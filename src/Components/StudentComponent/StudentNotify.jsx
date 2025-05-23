import { useState, useRef, useEffect, useContext } from "react";
import { Bell, ChevronDown, Check, Link as LinkIcon } from "lucide-react";
import axiosInstance from "../../Axios/axiosInstance.js";
import socket from "../../utils/socket.js";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import useSound from 'use-sound';
import notifyTone from '../../assets/notify.wav'
import moment from "moment";
import { UserContext } from "../../Context/UserContext.jsx";
const StudentNotify = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const {userData} = useContext(UserContext)
  const [playNotifyTone] = useSound(notifyTone)
  const ref = useRef();

  const userId = userData.id;
  let navigate = useNavigate()
  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get(`/api/getNotify/${userId}`);
      setNotifications(res.data);
      const unread = res.data.filter((n) => !n.readBy).length;
      setUnreadCount(unread);

    } catch (err) {
      console.error(err);
      message.error("Failed to load notifications");
    }
  };


  // Mark all notifications as read (PUT API call)
  const markAllAsRead = async () => {
    try {
      let res = await axiosInstance.put(`/api/read-all/${userId}`);
      // console.log(res)
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readBy: true }))
      );
      setUnreadCount(0); // ✅ reset unread
      message.success("All notifications marked as read");
    } catch (err) {
      console.error(err);
      message.error("Failed to mark notifications as read");
    }
  };


  // On mount
  useEffect(() => {
    fetchNotifications();
  }, []);
  useEffect(() => {
    const handleReceiveNotification = (notify) => {
      // console.log(notify);

      const isForThisStudent = notify.receiverId?.includes(userId); // direct to student
      const isForStudents = Array.isArray(notify.receiverType) && notify.receiverType.includes("students");
      const isForStudentAndTeacher = Array.isArray(notify.receiverType) && notify.receiverType.length === 1 && notify.receiverType[0] === "teachers";

      if (isForThisStudent || (isForStudents && !isForStudentAndTeacher)) {
        playNotifyTone();
        message.success("New notification received");
        setNotifications(prev => [notify, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    };

    socket.on("receiveNotification", handleReceiveNotification);
    return () => socket.off("receiveNotification", handleReceiveNotification);
  }, []);



  // Outside click close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full relative transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className=" ml-2 absolute -top-1 -right-1 h-5 w-6 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 shadow-xl rounded-lg z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-500">
                {notifications.length} total, {unreadCount} unread
              </p>
            </div>
            {unreadCount > 0 &&
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
            >
              <Check className="h-3 w-3 mr-1" /> Mark all read
            </button> }
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-2">
                  <Bell className="w-full h-full" />
                </div>
                <p className="text-sm text-gray-500">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${!n.readBy ? "bg-blue-50" : ""}`
                  }
                  onClick={() => {
                    if (n.path === '/notification') {
                      navigate('/student/notification')
                    } else {
                      navigate(n.path)
                    }
                  }
                  }
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      {n.senderId?.profileUrl ? (
                        <img
                          src={n.senderId.profileUrl}
                          alt="Profile"
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="font-medium">
                          {n.senderId?.role === "teacher"
                            ? "T"
                            : n.senderId?.role === "admin"
                              ? "A"
                              : "S"}

                        </span>
                      )}
                    </div>

                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          {n.senderId?.role === "teacher"
                            ? "Teacher"
                            : n.senderId?.role === "admin"
                              ? "Admin"
                              : "Student"}

                        </h4>
                        <span className="text-xs text-gray-500">
                          {formatTime(n.created_at)} • {formatDate(n.created_at)} <br />
                           {moment(n.created_at).fromNow()}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mt-1">
                        {n.message.includes("link") ? (
                          <span className="flex items-center text-blue-600">
                            <LinkIcon className="h-4 w-4 mr-1" /> {n.message}
                          </span>
                        ) : (
                          n.message
                        )}
                      </p>

                      {!n.readBy && (
                        <div className="mt-1 flex items-center">
                          <span className="h-2 w-2 rounded-full bg-blue-500 mr-1"></span>
                          <span className="text-xs text-blue-500">New</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 text-center bg-gray-50 border-t border-gray-200">
            <button className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center justify-center w-full">
              View all notifications <ChevronDown className="h-3 w-3 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentNotify;
