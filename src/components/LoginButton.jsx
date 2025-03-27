import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function LoginButton() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <button
      onClick={() => navigate(isAuthenticated ? "/login" : "/login")}
      className="absolute top-4 left-4 px-4 py-2 text-sm font-semibold rounded-lg transition-all
      bg-blue-600 hover:bg-blue-700 text-white dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:text-black"
    >
      {isAuthenticated ? "My Dashboard" : "Login"}
    </button>
  );
}
