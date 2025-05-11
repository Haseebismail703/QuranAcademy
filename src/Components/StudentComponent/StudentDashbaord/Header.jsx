import { Bell, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-between p-4 sticky top-0 z-10 h-14">
      <div className="flex items-center">
        <button className="mr-4 focus:outline-none" onClick={toggleSidebar}>
          <Menu className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      </div>

      <div className="flex items-center space-x-2">
      
        <NotificationButton />

        <div className="flex items-center space-x-2 ml-2">
          <img
            src="https://i.pravatar.cc/40?img=3" 
            alt="User Profile"
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-gray-800 hidden sm:inline">
            Ahsan Khan
          </span>
        </div>
      </div>
    </header>
  );
};

const NotificationButton = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full relative"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
          1
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
          <div className="p-4 text-sm text-gray-700 font-medium border-b">
            Notifications
          </div>
          <ul className="max-h-60 overflow-y-auto">
            <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
              📢 New message from admin
            </li>
            <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
              ✅ Your application was approved
            </li>
            <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
              🔔 Upcoming appointment tomorrow
            </li>
          </ul>
          <div className="p-2 text-center text-blue-600 text-sm hover:underline cursor-pointer">
            View all
          </div>
        </div>
      )}
    </div>
  );
};