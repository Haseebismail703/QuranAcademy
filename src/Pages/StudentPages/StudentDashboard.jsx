import { useState } from "react";
import { StatsCards } from "../../Components/StudentComponent/StudentDashbaord/StatsCards";
import { Charts } from "../../Components/StudentComponent/StudentDashbaord/Charts";
import { AdditionalSections } from "../../Components/StudentComponent/StudentDashbaord/AdditionalSections";



export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const monthlyData = [
    { name: "Feb", value: 380 },
    { name: "Mar", value: 200 },
    { name: "Apr", value: 100 },
    { name: "May", value: 210 },
    { name: "Jun", value: 450 },
    { name: "Jul", value: 100 },
    { name: "Aug", value: 370 },
    { name: "Sep", value: 210 },
    { name: "Oct", value: 450 },
  ];

  const lineData = [
    { name: "Feb", traffic: 340, sales: 20 },
    { name: "Mar", traffic: 50, sales: 80 },
    { name: "Apr", traffic: 300, sales: 40 },
    { name: "May", traffic: 220, sales: 130 },
    { name: "Jun", traffic: 500, sales: 250 },
    { name: "Jul", traffic: 250, sales: 300 },
    { name: "Aug", traffic: 400, sales: 270 },
    { name: "Sep", traffic: 280, sales: 230 },
    { name: "Oct", traffic: 500, sales: 400 },
  ];

  return (
    
     <>
     <StatsCards />
      <Charts monthlyData={monthlyData} lineData={lineData} />
      <AdditionalSections />
     </>
  );
}