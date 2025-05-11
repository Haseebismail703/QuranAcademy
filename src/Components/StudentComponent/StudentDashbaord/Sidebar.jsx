import { LayoutDashboard, FileText, CreditCard, User, X, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Sidebar = ({
  isCollapsed,
  isMobile,
  sidebarOpen,
  toggleSidebar,
}) => {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-30 transition-transform duration-300 flex flex-col
        ${
          isMobile
            ? `${sidebarOpen ? "translate-x-0" : "-translate-x-full"} w-72`
            : isCollapsed
            ? "w-16"
            : "w-64"
        }`}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <LayoutDashboard className="h-6 w-6 text-gray-500" />
          {(!isCollapsed || isMobile) && (
            <span className="text-lg font-semibold">Student Dashboard</span>
          )}
        </div>
        {isMobile && (
          <button onClick={toggleSidebar}>
            <X className="h-5 w-5 text-gray-500 " />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto item-center">
        <div className="py-2 space-y-1 ">
          <Link to="/student/dashboard" onClick={isMobile ? toggleSidebar : undefined}>
            <NavItem
              icon={<LayoutDashboard className="h-5 w-5" />}
              text="Dashboard"
              active={isActive("/student/dashboard")}
              isCollapsed={isCollapsed}
              isMobile={isMobile}
            />
          </Link>

          <Link to="/student/class" onClick={isMobile ? toggleSidebar : undefined}>
            <NavItem
              icon={<FileText className="h-5 w-5" />}
              text="Class"
              active={isActive("/student/class")}
              isCollapsed={isCollapsed}
              isMobile={isMobile}
            />
          </Link>

          <Link to="/student/fee" onClick={isMobile ? toggleSidebar : undefined}>
            <NavItem
              icon={<CreditCard className="h-5 w-5" />}
              text="Fee"
              active={isActive("/student/fee")}
              isCollapsed={isCollapsed}
              isMobile={isMobile}
            />
          </Link>
          <Link to="/student/paymentHistory" onClick={isMobile ? toggleSidebar : undefined}>
            <NavItem
              icon={<CreditCard className="h-5 w-5" />}
              text="Payment History"
              active={isActive("/student/paymentHistory")}
              isCollapsed={isCollapsed}
              isMobile={isMobile}
            />
          </Link>
          <Link to="/student/profile" onClick={isMobile ? toggleSidebar : undefined}>
            <NavItem
              icon={<User className="h-5 w-5" />}
              text="Profile"
              active={isActive("/student/profile")}
              isCollapsed={isCollapsed}
              isMobile={isMobile}
            />
          </Link>
          <Link to="/student/notification" onClick={isMobile ? toggleSidebar : undefined}>
            <NavItem
              icon={<User className="h-5 w-5" />}
              text="All notification"
              active={isActive("/student/notification")}
              isCollapsed={isCollapsed}
              isMobile={isMobile}
            />
          </Link>
        </div>
      </div>

      <div className="py-3 border-t border-gray-200">
        <div
          onClick={() => console.log("Sign out")} 
          className="flex items-center px-4 py-2 transition-colors cursor-pointer text-gray-700 hover:bg-gray-100 rounded"
        >
          <div className="mr-3">
            <LogOut className="h-5 w-5" />
          </div>
          {(!isCollapsed || isMobile) && <span className="text-sm">Sign Out</span>}

          {isCollapsed && !isMobile && (
            <div className="relative group">
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50">
                Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, text, active, isCollapsed, isMobile }) => (
  <div
    className={`flex items-center px-4 py-2 transition-colors cursor-pointer ${
      active
        ? "bg-blue-100 text-blue-600 font-semibold"
        : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    <div className="mr-3">{icon}</div>
    {(!isCollapsed || isMobile) && <span className="text-sm">{text}</span>}

    {isCollapsed && !isMobile && (
      <div className="relative group">
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50">
          {text}
        </div>
      </div>
    )}
  </div>
);
