import React, { useEffect, useState } from "react";
import { FiUsers, FiUserCheck } from "react-icons/fi";

const Overview: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalStudents, setTotalStudents] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch total students count
        const studentResponse = await fetch("/api/count");
        if (!studentResponse.ok) {
          throw new Error("Failed to fetch student count");
        }
        const studentData = await studentResponse.json();

        // Fetch total users count (admins)
        const userResponse = await fetch("/api/admin/counts");
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user count");
        }
        const userData = await userResponse.json();

        setTotalStudents(studentData.totalStudents ?? null);
        setTotalUsers(userData.totalAdmins ?? null);
      } catch (err: any) {
        setError(err.message || "Error fetching counts");
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return <div>Loading overview...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const stats = [
    {
      id: 1,
      title: "Total Users",
      value: totalUsers !== null ? totalUsers.toString() : "N/A",
      icon: <FiUsers className="text-blue-500" size={24} />,
    },
    {
      id: 2,
      title: "Total Students",
      value: totalStudents !== null ? totalStudents.toString() : "N/A",
      icon: <FiUserCheck className="text-green-500" size={24} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
            </div>
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Overview;
