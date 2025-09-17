import React, { useState, useRef, useEffect } from "react";
import { IoMdNotifications } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    // Add any sign out logic here (like clearing tokens)
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm p-4">
      <div className="flex justify-between items-center">
        <div></div> {/* Empty div to push the right content over */}

        <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <IoMdNotifications size={24} />
          </button>

          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="focus:outline-none"
          >
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              alt="Profile"
              className="w-8 h-8 rounded-full cursor-pointer"
            />
          </button>

{dropdownOpen && (
  <div className="absolute right-0 top-full w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50">
    <button
      onClick={handleSignOut}
      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
    >
      Sign Out
    </button>
  </div>
)}
        </div>
      </div>
    </header>
  );
};

export default Header;
