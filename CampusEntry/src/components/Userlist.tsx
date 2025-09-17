import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiX, FiPlus } from "react-icons/fi";
import Toast from "./ui/Toast";

interface Admin {
  _id: string;
  email: string;
  role: string;
}

const UserList: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Admin | null; direction: "asc" | "desc" }>({
    key: null,
    direction: "asc",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [editedAdmin, setEditedAdmin] = useState<Partial<Admin>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ email: "", role: "", password: "" });

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "email":
        if (value && !/\S+@\S+\.\S+/.test(value)) {
          error = "Please enter a valid email address.";
        }
        break;
      case "role":
        if (!value) {
          error = "Role is required.";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required.";
        }
        break;
    }
    return error;
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/admin/admins`);
      if (response.ok) {
        const data = await response.json();
        setAdmins(data);
      } else {
        setToast({ message: "Failed to fetch admins.", type: "error" });
      }
    } catch (err) {
      setToast({ message: "Network error.", type: "error" });
    }
    setLoading(false);
  };

  const handleSort = (key: keyof Admin) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const filteredAdmins = admins
    .filter((admin) =>
      Object.values(admin).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const direction = sortConfig.direction === "asc" ? 1 : -1;
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";
      return aValue.localeCompare(bValue) * direction;
    });

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this App user?")) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/admin/admins/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setAdmins(admins.filter(a => a._id !== id));
        setToast({ message: "App user deleted successfully.", type: "success" });
      } else {
        setToast({ message: "Failed to delete admin.", type: "error" });
      }
    } catch (err) {
      setToast({ message: "Network error.", type: "error" });
    }
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdminId(admin._id);
    setEditedAdmin({ ...admin });
  };

  const handleSave = async () => {
    if (!editingAdminId) return;

    const newErrors: { [key: string]: string } = {};
    const fieldsToValidate = ["email", "role"];
    let hasError = false;
    for (const field of fieldsToValidate) {
      const value = editedAdmin[field as keyof Admin] || "";
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
        hasError = true;
      }
    }
    if (hasError) {
      setErrors(newErrors);
      setToast({ message: Object.values(newErrors).join(" "), type: "error" });
      return;
    } else {
      setErrors({});
    }

    try {
      const updates = {
        email: editedAdmin.email,
        role: editedAdmin.role,
      };
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/admin/admins/${editingAdminId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        const updatedAdmin = { ...admins.find(a => a._id === editingAdminId)! };
        Object.assign(updatedAdmin, updates);
        setAdmins(admins.map(a => a._id === editingAdminId ? updatedAdmin : a));
        setToast({ message: "App user updated successfully.", type: "success" });
        setEditingAdminId(null);
        setEditedAdmin({});
      } else {
        setToast({ message: "Failed to update admin.", type: "error" });
      }
    } catch (err) {
      setToast({ message: "Network error.", type: "error" });
    }
  };

  const handleCancel = () => {
    setEditingAdminId(null);
    setEditedAdmin({});
  };

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleSaveAdd = async () => {
    const newErrors: { [key: string]: string } = {};
    const fieldsToValidate = ["email", "role", "password"];
    let hasError = false;
    for (const field of fieldsToValidate) {
      const value = newAdmin[field as keyof typeof newAdmin];
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
        hasError = true;
      }
    }
    if (hasError) {
      setErrors(newErrors);
      setToast({ message: Object.values(newErrors).join(" "), type: "error" });
      return;
    } else {
      setErrors({});
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/admin/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin),
      });
      if (response.ok) {
        setToast({ message: "App User added successfully.", type: "success" });
        setIsModalOpen(false);
        setNewAdmin({ email: "", role: "", password: "" });
        fetchAdmins();
      } else {
        setToast({ message: "Failed to add App user.", type: "error" });
      }
    } catch (err) {
      setToast({ message: "Network error.", type: "error" });
    }
  };

  const handleCancelAdd = () => {
    setIsModalOpen(false);
    setNewAdmin({ email: "", role: "", password: "" });
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white p-6">
      <h2 className="text-xl font-semibold mb-4">App Users List</h2>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="mb-4 flex justify-between">
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
        >
          <FiPlus size={18} className="inline mr-1 mb-1" />
          APP USER
        </button>
        <input
          type="text"
          placeholder="Search admins..."
          className="w-64 p-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-xs">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th className="px-6 py-2 cursor-pointer whitespace-nowrap" onClick={() => handleSort("email")}>Email</th>
                <th className="px-6 py-2 cursor-pointer whitespace-nowrap" onClick={() => handleSort("role")}>Role</th>
                <th className="px-6 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin) => (
                <tr key={admin._id} className="bg-white border-b hover:bg-gray-50 text-gray-900">
                  <td className="px-6 py-2 whitespace-nowrap">
                    {editingAdminId === admin._id ? (
                      <input
                        type="email"
                        value={editedAdmin.email || ''}
                        onChange={(e) => setEditedAdmin({ ...editedAdmin, email: e.target.value })}
                        className="w-full p-1 border rounded"
                      />
                    ) : (
                      admin.email
                    )}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    {editingAdminId === admin._id ? (
                      <select
                        value={editedAdmin.role || ''}
                        onChange={(e) => setEditedAdmin({ ...editedAdmin, role: e.target.value })}
                        className="w-full p-1 border rounded"
                      >
                        <option value="" hidden>Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                    ) : (
                      admin.role
                    )}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-right">
                    <div className="flex space-x-2 justify-end">
                      {editingAdminId === admin._id ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                            title="Save"
                          >
                            <FiCheck size={18} />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                            title="Cancel"
                          >
                            <FiX size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(admin)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                            title="Edit"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(admin._id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isModalOpen && (
 <div className="fixed inset-0 bg-white/10 backdrop-blur-xs flex items-center justify-center">

       <div className="bg-white p-6 rounded-lg shadow-lg w-96">
       
            <h3 className="text-lg font-semibold mb-4">Add New Admin</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                value={newAdmin.role}
                onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="" hidden>Select Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancelAdd}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAdd}
                className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
