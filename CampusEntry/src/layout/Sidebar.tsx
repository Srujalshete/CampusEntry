import React from "react";
import { BsSpeedometer2 } from "react-icons/bs";
import { FiUsers, FiUserPlus, FiMenu } from "react-icons/fi";

interface SidebarProps {
  activeTab: "overview" | "users" | "activity";
  setActiveTab: (tab: "overview" | "users" | "activity") => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isSidebarOpen, setSidebarOpen }) => {
  return (
    <div
      className={`${isSidebarOpen ? "w-64" : "w-20"} bg-white shadow-lg transition-all duration-300 ease-in-out`}
    >
     <div className="p-4 flex items-center justify-between">
  <span className="font-bold text-xl">
    {isSidebarOpen ? 'CampusEntry' : 'CE'}
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
          className={`w-full p-4 flex items-center ${activeTab === "overview" ? "bg-blue-50 text-blue-600" : ""}`}
        >
          <BsSpeedometer2 size={20} />
          {isSidebarOpen && <span className="ml-4">Dashboard</span>}
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`w-full p-4 flex items-center ${activeTab === "activity" ? "bg-blue-50 text-blue-600" : ""}`}
        >
          <FiUserPlus size={20} />
          {isSidebarOpen && <span className="ml-4">Add Student</span>}
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`w-full p-4 flex items-center ${activeTab === "users" ? "bg-blue-50 text-blue-600" : ""}`}
        >
          <FiUsers size={20} />
         
          {isSidebarOpen && <span className="ml-4">Student List</span>}
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
