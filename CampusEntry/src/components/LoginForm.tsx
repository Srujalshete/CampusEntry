import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import bg from "../assets/sky.png";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Toast from "../components/ui/Toast";
import { useAuth } from "../partials/AuthContext";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"error" | "success">("error");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % 4);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: { username?: string; password?: string } = {};
    if (!username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleLogin = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      setToastMessage("");

      try {
        const { encrypt } = await import("../utils/crypto");
        const encryptedData = {
          email: username,
          password: password,
        };
        const response = await fetch(`${import.meta.env.VITE_API_BASE}/admin/login`,{
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(encryptedData),
        });
        if (response.ok) {
          const data = await response.json();
          sessionStorage.setItem('userRole', data.role);
          sessionStorage.setItem('userEmail', data.email);
          login();
          setToastMessage("Login successful!");
          setToastType("success");
          navigate('/dashboard');
        } else {
          let errorMessage = "Login failed.";
          try {
            const error = await response.json();
            errorMessage = error.message || errorMessage;
          } catch {
            // response is not JSON, keep default message
          }
          setToastMessage(errorMessage);
          setToastType("error");
        }
      } catch (err) {
        setToastMessage("Network error. Please try again.");
        setToastType("error");
      }
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex">
      {/* Left side */}
      <div className="flex flex-col justify-center items-center md:items-start w-full md:w-1/2 px-4 md:px-16">
 <h1 className="font-serif text-5xl italic leading-relaxed mb-12 ml-12 relative inline-block">
  CampusEntry
  <span className="absolute top-5 -right-5 text-sm">🎓</span>
</h1>


        <form onSubmit={handleLogin} className="w-full max-w-md">
          <label className="block text-gray-400 dark:text-gray-700 mb-1" htmlFor="username">
            Email<span className="text-red-500">*</span>
          </label>
          <input
            id="username"
            type="text"
            placeholder="email@example.com"
            className={`w-full mb-6 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white  text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 ${
              errors.username ? "border-red-500 focus:ring-red-500" : ""
            }`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />

          <label className="block text-gray-700 dark:text-gray-700 mb-1" htmlFor="password">
            Password<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="************"
              className={`w-full mb-2 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                errors.password ? "border-red-500 focus:ring-red-500" : ""
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400  hover:text-gray-600  focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>

          {(errors.username || errors.password) && (
            <p className="text-red-500 text-sm flex justify-center mb-2">
              {errors.username && errors.password
                ? "Username and password are required."
                : errors.username
                ? "Username is required."
                : "Password is required."}
            </p>
          )}

          <div className="flex justify-end mb-2">
            <a href="#" className="text-sm text-purple-500 hover:underline"> 
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold py-3 rounded-md transition-colors mb-10 mt-2"
          >
            {loading ? "Logging In..." : "Sign In"}
          </button>
        </form>

        <div className="flex justify-center items-center ml-4 md:ml-10 lg:ml-36">
          <div className="flex items-center space-x-2 text-gray-500 text-xs">
            <span>Developed by ❤️Srujal</span>
             
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="relative w-1/2 hidden md:block">
        <div
          className="absolute inset-0 border rounded-tl-3xl rounded-bl-3xl filter contrast-155 brightness-120 saturation-120"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="flex justify-center items-center min-h-screen">
          <div className="relative z-10 w-full max-w-md flex">
            <div className="p-10 rounded-xl text-center bg-white/10 backdrop-blur-md shadow-xl border border-white/20">
              <div className="card">
                <div className="loader flex flex-col items-center">
                  <p className="text-white text-4xl font-extrabold mb-1">
                    Connecting Talent
                  </p>
                  <div className="flex justify-right mb-6">
                    <p className="text-white text-4xl font-extrabold ml-12">to</p>
                    <div className="words text-left text-4xl ml-2 font-extrabold">
                      <span className="word">Opportunities</span>
                      <span className="word">Opportunities</span>
                      <span className="word ml-3">Success</span>
                      <span className="word ml-3">Careers</span>
                      <span className="word">Possibilities</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-100 mt-12">
                Discover endless opportunities on CampusEntry where top talent
                meets the right careers.
                <br /> Jump right in!
              </p>

              <div className="flex space-x-2 justify-center mt-5">
                {[0, 1, 2, 3].map((index) => (
                  <span
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      activeIndex === index ? "bg-white" : "bg-gray-200"
                    }`}
                  ></span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage("")}
        />
      )}
    </div>
  );
};

export default Login;
