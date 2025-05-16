import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import socket from "../../utils/socket.js";

const StudentNotify = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const ref = useRef();

  const userId = "681c8fdc6329587244535349"; // ideally get this from auth context

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Register user and receive notifications
  useEffect(() => {
    // socket.emit("register", userId);

    socket.on("receiveNotification", (notify) => {
      if(notify.receiverId === userId) {
         console.log(notify)
      }
     
      // setNotifications((prev) => [notify, ...prev]);
    });

    return () => {
      socket.off("receiveNotification");
    };
  }, [userId]);

  const unreadCount = notifications.length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
          <div className="p-4 text-sm text-gray-700 font-medium border-b">
            Notifications
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="px-4 py-2 text-gray-400">No new notifications</li>
            ) : (
              notifications.map((n) => (
                <li key={n._id} className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                  🔔 {n.message}
                </li>
              ))
            )}
          </ul>
          <div className="p-2 text-center text-blue-600 text-sm hover:underline cursor-pointer">
            View all
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentNotify;
