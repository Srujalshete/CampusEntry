import React from "react";
import { BsSpeedometer2 } from "react-icons/bs";
import { FiUsers, FiUserPlus, FiMenu, FiUserCheck } from "react-icons/fi";

interface SidebarProps {
  activeTab: "overview" | "users" | "activity" | "adminlist";
  setActiveTab: (tab: "overview" | "users" | "activity" | "adminlist") => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isSidebarOpen, setSidebarOpen }) => {
  const userRole = sessionStorage.getItem('userRole');

  return (
    <div
      className={`${isSidebarOpen ? "w-64" : "w-20"} bg-white shadow-lg transition-all duration-300 ease-in-out`}
    >
     <div className="p-4 flex items-center justify-between">
<span className="font-serif italic text-xl font-bold relative inline-block">
  {isSidebarOpen ? 'CampusEntry' : 'CE'}
  {isSidebarOpen && (
    <span className="absolute top-0 -right-4 text-xs">🎓</span>
  )}
</span>

  <button
    onClick={() => setSidebarOpen(!isSidebarOpen)}
    className="p-2 rounded-lg hover:bg-gray-100"
  >
    <FiMenu size={20} />
  </button>
</div>


      <nav className="mt-8">
        <button
          onClick={() => setActiveTab("overview")}
          className={`w-full p-4 flex items-center ${activeTab === "overview" ? "bg-blue-50 text-violet-500" : ""}`}
        >
          <BsSpeedometer2 size={20} />
          {isSidebarOpen && <span className="ml-4">Dashboard</span>}
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`w-full p-4 flex items-center ${activeTab === "activity" ? "bg-blue-50 text-violet-500" : ""}`}
        >
          <FiUserPlus size={20} />
          {isSidebarOpen && <span className="ml-4">Add Student</span>}
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`w-full p-4 flex items-center ${activeTab === "users" ? "bg-blue-50 text-violet-500" : ""}`}
        >
          <FiUsers size={20} />

          {isSidebarOpen && <span className="ml-4">Student List</span>}
        </button>
        {userRole === 'admin' && (
          <button
            onClick={() => setActiveTab("adminlist")}
            className={`w-full p-4 flex items-center ${activeTab === "adminlist" ? "bg-blue-50 text-violet-500" : ""}`}
          >
            <FiUserCheck size={20} />
            {isSidebarOpen && <span className="ml-4">App Users</span>}
          </button>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
