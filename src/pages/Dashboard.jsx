import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../components/Sidebar";
import ProfileSection from "../components/ProfileSection";
import WatchlistSection from "../components/WatchlistSection";
import FavoritesSection from "../components/FavoritesSection";
import ReviewsAndCommentSection from "../components/ReviewsAndCommentSection";
import FriendsSection from "../components/FriendsSection";
import MessageSection from "../components/MessageSection";
import SubscriptionSection from "../components/SubscriptionSection";
import RecommendationSection from "../components/RecommendationSection";
import { fetchFavorites } from "../features/favoriteSlice";
import Navbar from "../components/Navbar";
import AdminPanel from "../components/AdminPanel";
import AuthSide from "../components/AuthSide";
import { logout } from "@/features/authSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
  const dashboardTabs = [
    { key: "profile", label: "Profile" },
    { key: "watchlist", label: "Watchlist" },
    { key: "favorites", label: "Favorites" },
    { key: "reviews", label: "Reviews" },
    { key: "friends", label: "Friends" },
    { key: "messages", label: "Messages" },
    { key: "subscription", label: "Subscription" }
  ];

  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("profile");
  const userId = useSelector((state) => state.auth.user?.id);
  const favorites = useSelector((state) => state.favorites.items) || [];
  const likedMovieTitles = favorites.map((movie) => movie.title);

  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const isAdmin = authUser?.role === "ADMIN";

  const [authOpen, setAuthOpen] = useState(false);
  const [defaultToLogin, setDefaultToLogin] = useState(true);

  if (isAdmin) {
    dashboardTabs.push({ key: "admin", label: "Admin" });
  }
  const centerContent = (
    <div className="flex flex-wrap gap-1 justify-center min-[840px]:hidden">
      {dashboardTabs.map((tab) => (
        <button key={tab.key} onClick={() => setActiveSection(tab.key)} className={`tab-btn ${activeSection === tab.key ? "tab-btn-active" : ""}`}>
          {tab.label}
        </button>
      ))}
    </div>
  );

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/subscriptions/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("No subscription");

        const data = await res.json();
        const now = new Date();
        const end = new Date(data.endDate);

        if (data.subscriptionType === "PREMIUM" && data.status === "ACTIVE" && end > now) {
          setHasActiveSubscription(true);
        }
      } catch (err) {
        setHasActiveSubscription(false);
      }
    };

    if (userId) fetchSubscription();
  }, [userId, token]);
  useEffect(() => {
    if (authUser?.id) {
      dispatch(fetchFavorites(authUser.id));
    }
  }, [authUser, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    toast("You are logged out.");
    navigate("/");
  };

  const location = useLocation();

  useEffect(() => {
    if (location.state?.tab) {
      setActiveSection(location.state.tab);
    }
  }, [location.state]);

  return (
    <>
      <Navbar
        authUser={authUser}
        onLogout={handleLogout}
        onLoginClick={() => {
          setDefaultToLogin(true);
          setAuthOpen(true);
        }}
        onSignupClick={() => {
          setDefaultToLogin(false);
          setAuthOpen(true);
        }}
        centerContent={centerContent}
      />
      <div className="flex bg-background min-h-[calc(100vh-56px)] pt-14">
        {" "}
        {/* padding to not overlap with navbar */}
        {/* Sidebar only in desktop */}
        <div className="min-[840px]:block max-[840px]:hidden">
          <Sidebar setActiveSection={setActiveSection} />
        </div>
        <AuthSide open={authOpen} setOpen={setAuthOpen} defaultToLogin={defaultToLogin} />
        {/* Main Content */}
        <div className="flex-1 bg-muted text-foreground p-6 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
          {activeSection === "profile" && <ProfileSection />}
          {activeSection === "watchlist" && <WatchlistSection userId={userId} />}
          {activeSection === "favorites" && <FavoritesSection />}
          {activeSection === "reviews" && <ReviewsAndCommentSection />}
          {activeSection === "friends" && <FriendsSection />}
          {activeSection === "messages" && <MessageSection />}
          {activeSection === "subscription" && <SubscriptionSection />}
          {activeSection === "recommendations" &&
            (hasActiveSubscription ? (
              <RecommendationSection likedMovies={likedMovieTitles} />
            ) : (
              <div className="p-6 text-center text-gray-600 dark:text-gray-300">
                <div className="text-2xl font-semibold mb-4">🔒 Premium Feature</div>
                <p className="mb-4">To access AI-powered movie suggestions, please activate your subscription.</p>
                <button className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-400/90 transition" onClick={() => setActiveSection("subscription")}>
                  Purchase Subscription
                </button>
              </div>
            ))}
          {activeSection === "admin" && isAdmin && <AdminPanel />}
        </div>
      </div>
    </>
  );
}
