import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { decrypt, encrypt } from "../utils/crypto";
import Toast from "./ui/Toast";

interface Student {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  courseEnrolled: string;
  password: string;
}

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Student | null; direction: "asc" | "desc" }>({
    key: null,
    direction: "asc",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editedStudent, setEditedStudent] = useState<Partial<Student>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "fullName":
        if (!/^[a-zA-Z\s]+$/.test(value) && value) {
          error = "Full name can only contain letters and spaces.";
        }
        break;
      case "email":
        if (value && !/\S+@\S+\.\S+/.test(value)) {
          error = "Please enter a valid email address.";
        }
        break;
      case "phoneNumber":
        if (!/^\d{10}$/.test(value) && value) {
          error = "Phone number must be exactly 10 digits.";
        }
        break;
      case "dateOfBirth":
        if (value) {
          const selectedDate = new Date(value);
          const today = new Date();
          if (selectedDate >= today) {
            error = "Date of birth must be in the past.";
          }
        }
        break;
    }
    return error;
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/students');
      if (response.ok) {
        const data = await response.json();
        const decryptedStudents = data.map((student: any) => ({
          _id: student._id,
          fullName: decrypt(student.fullName),
          email: decrypt(student.email),
          phoneNumber: decrypt(student.phoneNumber),
          dateOfBirth: decrypt(student.dateOfBirth),
          gender: decrypt(student.gender),
          address: decrypt(student.address),
          courseEnrolled: decrypt(student.courseEnrolled),
          password: decrypt(student.password),
        }));
        setStudents(decryptedStudents);
      } else {
        setMessage("Failed to fetch students.");
      }
    } catch (err) {
      setMessage("Network error.");
    }
    setLoading(false);
  };

  const handleSort = (key: keyof Student) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const filteredStudents = students
    .filter((student) =>
      Object.values(student).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const direction = sortConfig.direction === "asc" ? 1 : -1;
      // Defensive check for undefined or null values
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";
      return aValue.localeCompare(bValue) * direction;
    });

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/student/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setStudents(students.filter(s => s._id !== id));
        setMessage("Student deleted successfully.");
      } else {
        setMessage("Failed to delete student.");
      }
    } catch (err) {
      setMessage("Network error.");
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudentId(student._id);
    setEditedStudent({ ...student });
  };

  const handleSave = async () => {
    if (!editingStudentId) return;

    // Validate all fields before saving
    const newErrors: { [key: string]: string } = {};
    const fieldsToValidate = [
      "fullName",
      "email",
      "phoneNumber",
      "dateOfBirth",
      "gender",
      "courseEnrolled",
      "password",
    ];
    let hasError = false;
    for (const field of fieldsToValidate) {
      const value = editedStudent[field as keyof Student] || "";
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
        hasError = true;
      }
    }
    // Additional check for required fields empty
    for (const field of fieldsToValidate) {
      const value = editedStudent[field as keyof Student];
      if (!value || value.toString().trim() === "") {
        newErrors[field] = `${field} is required.`;
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
        fullName: editedStudent.fullName,
        email: editedStudent.email,
        phoneNumber: editedStudent.phoneNumber,
        dateOfBirth: editedStudent.dateOfBirth,
        gender: editedStudent.gender,
        courseEnrolled: editedStudent.courseEnrolled,
        password: editedStudent.password,
      };
      const encryptedUpdates: any = {};
      for (const key in updates) {
        if (updates[key as keyof typeof updates]) {
          encryptedUpdates[key] = encrypt(updates[key as keyof typeof updates] as string);
        }
      }
      const response = await fetch(`http://localhost:5000/api/student/${editingStudentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(encryptedUpdates),
      });
      if (response.ok) {
        const updatedStudent = { ...students.find(s => s._id === editingStudentId)! };
        Object.assign(updatedStudent, updates);
        setStudents(students.map(s => s._id === editingStudentId ? updatedStudent : s));
        setToast({ message: "Student updated successfully.", type: "success" });
        setEditingStudentId(null);
        setEditedStudent({});
      } else {
        setToast({ message: "Failed to update student.", type: "error" });
      }
    } catch (err) {
      setToast({ message: "Network error.", type: "error" });
    }
  };

  const handleCancel = () => {
    setEditingStudentId(null);
    setEditedStudent({});
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Students List</h2>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {message && (
        <p className={`mb-4 text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search students..."
          className="w-64 p-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
          <tr className="border-b">
            <th className="p-4 text-left cursor-pointer whitespace-nowrap" onClick={() => handleSort("fullName")}>Full Name</th>
            <th className="p-4 text-left cursor-pointer whitespace-nowrap" onClick={() => handleSort("email")}>Email</th>
            <th className="p-4 text-left cursor-pointer whitespace-nowrap" onClick={() => handleSort("phoneNumber")}>Phone</th>
            <th className="p-4 text-left cursor-pointer whitespace-nowrap" onClick={() => handleSort("dateOfBirth")}>DOB</th>
            <th className="p-4 text-left cursor-pointer whitespace-nowrap" onClick={() => handleSort("gender")}>Gender</th>
            <th className="p-4 text-left cursor-pointer whitespace-nowrap" onClick={() => handleSort("courseEnrolled")}>Course</th>
            <th className="p-4 text-left cursor-pointer whitespace-nowrap" onClick={() => handleSort("password")}>Password</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 whitespace-nowrap">
                    {editingStudentId === student._id ? (
                      <input
                        type="text"
                        value={editedStudent.fullName || ''}
                        onChange={(e) => setEditedStudent({ ...editedStudent, fullName: e.target.value })}
                        className="w-full p-1 border rounded whitespace-nowrap"
                      />
                    ) : (
                      student.fullName
                    )}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {editingStudentId === student._id ? (
                      <input
                        type="email"
                        value={editedStudent.email || ''}
                        onChange={(e) => setEditedStudent({ ...editedStudent, email: e.target.value })}
                        className="w-full p-1 border rounded whitespace-nowrap"
                      />
                    ) : (
                      student.email
                    )}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {editingStudentId === student._id ? (
                      <input
                        type="tel"
                        value={editedStudent.phoneNumber || ''}
                        onChange={(e) => setEditedStudent({ ...editedStudent, phoneNumber: e.target.value })}
                        className="w-full p-1 border rounded whitespace-nowrap"
                      />
                    ) : (
                      student.phoneNumber
                    )}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {editingStudentId === student._id ? (
                      <input
                        type="date"
                        value={editedStudent.dateOfBirth || ''}
                        onChange={(e) => setEditedStudent({ ...editedStudent, dateOfBirth: e.target.value })}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full p-1 border rounded whitespace-nowrap"
                      />
                    ) : (
                      student.dateOfBirth
                    )}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {editingStudentId === student._id ? (
                      <select
                        value={editedStudent.gender || ''}
                        onChange={(e) => setEditedStudent({ ...editedStudent, gender: e.target.value })}
                        className="w-full p-1 border rounded whitespace-nowrap"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      student.gender
                    )}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {editingStudentId === student._id ? (
                      <input
                        type="text"
                        value={editedStudent.courseEnrolled || ''}
                        onChange={(e) => setEditedStudent({ ...editedStudent, courseEnrolled: e.target.value })}
                        className="w-full p-1 border rounded whitespace-nowrap"
                      />
                    ) : (
                      student.courseEnrolled
                    )}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {editingStudentId === student._id ? (
                      <input
                        type="password"
                        value={editedStudent.password || ''}
                        onChange={(e) => setEditedStudent({ ...editedStudent, password: e.target.value })}
                        className="w-full p-1 border rounded whitespace-nowrap"
                      />
                    ) : (
                      '••••••••' // Masked password display
                    )}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {editingStudentId === student._id ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
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
                            onClick={() => handleEdit(student)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Edit"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(student._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
    </div>
  );
};

export default StudentList;
