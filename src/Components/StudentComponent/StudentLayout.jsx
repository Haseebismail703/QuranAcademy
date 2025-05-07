import { useState, useEffect } from "react";
import { Sidebar } from "./StudentDashbaord/Sidebar";
import { Header } from "./StudentDashbaord/Header";
import StudentChat from '../../Components/StudentComponent/StudentChat'

export default function DashboardLayout({children}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="flex h-screen  bg-gray-100 overflow-hidden">
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <Sidebar
        isCollapsed={isCollapsed}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isMobile ? "ml-0" : isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
          <StudentChat/>
        </main>
      </div>
    </div>
  );
}





