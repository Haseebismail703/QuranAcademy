import { Menu } from "lucide-react";
import StudentNotify from "../StudentNotify"; // Adjust path as needed

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
        <StudentNotify />
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
