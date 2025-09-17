import React, { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = "error",
  onClose,
  duration = 3000,
}) => {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!message) return;

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose(), 300);
    }, duration);

    return () => {
      clearTimeout(timer);
      setVisible(false);
    };
  }, [message, onClose, duration]);

  if (!message) return null;

  const colors = {
    success: {
      bg: "bg-white bg-opacity-30 border-white text-green-700",
      iconColor: "text-green-700",
    },
    error: {
      bg: "bg-white bg-opacity-30 border-white text-red-700",
      iconColor: "text-red-700",
    },
  };

  const currentColors = colors[type] || colors.error;

  const icons: Record<"success" | "error", React.ReactNode> = {
    success: (
      <span
        role="img"
        aria-label="success"
        className={`w-6 h-6 mr-4 flex-shrink-0 animate-pulse ${currentColors.iconColor}`}
        style={{ fontSize: "1rem" }}
      >
        ✅
      </span>
    ),
    error: (
      <svg
        viewBox="0 0 24 24"
        className={`w-6 h-6 mr-4 flex-shrink-0 animate-pulse ${currentColors.iconColor}`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z" />
      </svg>
    ),
  };

  return (
    <div
      className={`
        fixed 
        top-20 
        right-5
        transform transition-transform duration-300 ease-in-out
        max-w-lg mx-auto
        flex items-center
        rounded-sm
        px-4 py-2
        shadow-lg
        text-lg
        z-60
        backdrop-blur-md
        border
        ${currentColors.bg}
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"}
      `}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {icons[type]}
      <span className="flex-grow">{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        aria-label="Close notification"
        className={`ml-4 focus:outline-none hover:${
          type === "success"
            ? "text-green-900"
            : "text-red-900"
        } ${currentColors.iconColor}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
