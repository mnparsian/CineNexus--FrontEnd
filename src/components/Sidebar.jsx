import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";
import { Link } from "react-router-dom";
import { FaCreditCard, FaUser, FaFilm, FaStar, FaComments, FaUsers, FaSignOutAlt, FaRobot, FaTools } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

export default function Sidebar({ setActiveSection }) {
  const dispatch = useDispatch();
  const [active, setActive] = useState("profile");
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);
  const isAdmin = authUser?.role === "ADMIN" || authUser?.isAdmin;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    window.location.reload();
  };

  const menuItems = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "watchlist", label: "Watch lists ", icon: <FaFilm /> },
    { id: "favorites", label: "Favorite Movies", icon: <FaStar /> },
    { id: "reviews", label: "Reviews and Comments ", icon: <FaComments /> },
    { id: "friends", label: "Friends", icon: <FaUsers /> },
    { id: "subscription", label: "Subscription&Payments", icon: <FaCreditCard /> },
    { id: "recommendations", label: "AIRecommendation", icon: <FaRobot /> }
    /* { id: "admin", label: "Admin Panel", icon: <FaCreditCard /> } */
  ];

  return (
    <div className="w-64 min-h-[calc(100vh-56px)] bg-background pt-14 text-white flex flex-col p-4 border-r border-border">
      <h2 className="text-xl font-bold mb-6 text-center text-foreground">🎬 CineNexus</h2>

      {menuItems.map((item) => (
        <button
          key={item.id}
          className={`flex items-center gap-3 p-3 my-2 rounded-lg transition text-foreground bg-background ${
            active === item.id ? "bg-accent text-accent-foreground" : "hover:bg-muted/70"
          }`}
          onClick={() => {
            setActive(item.id);
            setActiveSection(item.id);
          }}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
      {isAdmin && (
        <button
          key="admin"
          className={`flex items-center gap-3 p-3 my-2 rounded-lg transition text-foreground ${active === "admin" ? "bg-muted" : "hover:bg-muted/"}`}
          onClick={() => {
            setActive("admin");
            setActiveSection("admin");
          }}
        >
          <FaTools />
          <span>Admin Panel</span>
        </button>
      )}

      {/* <button onClick={handleLogout} className="mt-auto flex items-center gap-3 p-3 my-2 rounded-lg bg-red-600 hover:bg-red-700 transition">
        <FaSignOutAlt />
        <span>Exit</span>
      </button> */}
    </div>
  );
}
