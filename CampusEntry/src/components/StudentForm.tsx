import React, { useState } from "react";
import { encrypt } from "../utils/crypto";
import Toast from "./ui/Toast";

interface Student {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  course: string;
  password: string;
}

interface Errors {
  fullName?: string;
  email?: string;
  phone?: string;
  dob?: string;
}

const StudentForm: React.FC = () => {
  const [student, setStudent] = useState<Student>({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    course: "",
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

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
      case "phone":
        if (!/^\d{10}$/.test(value) && value) {
          error = "Phone number must be exactly 10 digits.";
        }
        break;
      case "dob":
        if (value) {
          const selectedDate = new Date(value);
          const today = new Date();
          if (selectedDate >= today) {
            error = "Date of birth must be in the past.";
          }
        }
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Add Student</h2>
      <form className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="fullName"
            value={student.fullName}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (!/[a-zA-Z\s.]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
          <input
            type="email"
            name="email"
            value={student.email}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (!/[a-zA-Z0-9@._-]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
          <input
            type="tel"
            name="phone"
            value={student.phone}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth <span className="text-red-500">*</span></label>
          <input
            type="date"
            name="dob"
            value={student.dob}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
          <select
            name="gender"
            value={student.gender}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="" hidden>Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="address"
            value={student.address}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Course Enrolled <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="course"
            value={student.course}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
          <input
            type="password"
            name="password"
            value={student.password}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="col-span-2 flex justify-end space-x-4 mt-4">
          <button
            type="button"
            onClick={() => setStudent({
              fullName: "",
              email: "",
              phone: "",
              dob: "",
              gender: "",
              address: "",
              course: "",
              password: "",
            })}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Reset
          </button>
          <button
            type="submit"
            onClick={async (e) => {
              e.preventDefault();
              // Check for empty required fields
              const emptyFields = Object.entries(student).filter(([key, value]) => !value.trim());
              if (emptyFields.length > 0) {
                setToast({message: "All fields are required.", type: 'error'});
                return;
              }
              if (Object.values(errors).some(err => err)) {
                const errorMessages = Object.values(errors).filter(err => err).join('\n');
                setToast({message: errorMessages, type: 'error'});
                return;
              }
              setLoading(true);
              try {
                const encryptedData = {
                  fullName: encrypt(student.fullName),
                  email: encrypt(student.email),
                  phoneNumber: encrypt(student.phone),
                  dateOfBirth: encrypt(student.dob),
                  gender: encrypt(student.gender),
                  address: encrypt(student.address),
                  courseEnrolled: encrypt(student.course),
                  password: encrypt(student.password),
                };
                const response = await fetch(`${import.meta.env.VITE_API_BASE}/register`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(encryptedData),
                });
                if (response.ok) {
                  setToast({message: "Student registered successfully!", type: 'success'});
                  setStudent({
                    fullName: "",
                    email: "",
                    phone: "",
                    dob: "",
                    gender: "",
                    address: "",
                    course: "",
                    password: "",
                  });
                } else {
                  const error = await response.json();
                  setToast({message: error.error || "Registration failed.", type: 'error'});
                }
              } catch (err) {
                setToast({message: "Network error. Please try again.", type: 'error'});
              }
              setLoading(false);
            }}
            disabled={loading || Object.values(student).some(value => !value.trim())}
            className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default StudentForm;
