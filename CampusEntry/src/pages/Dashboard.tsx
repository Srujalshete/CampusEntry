import React, { useState } from "react";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import Overview from "../components/Overview";
import Users from "../components/Studentlist";
import Activity from "../components/StudentForm";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "activity">("overview");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Header activeTab={activeTab} />

        <main className="p-6">
          {activeTab === "overview" && <Overview />}
          {activeTab === "users" && <Users />}
          {activeTab === "activity" && <Activity />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
