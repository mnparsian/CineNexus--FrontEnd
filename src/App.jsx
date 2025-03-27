import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import MovieDetails from "./pages/MovieDetails";
import Dashboard from "./pages/Dashboard";
import SubscriptionSection from "./components/SubscriptionSection";
import SuccessPayment from "./pages/SuccessPayment ";
import FailedPayment from "./pages/FailedPayment ";
import PublicProfile from "./pages/PublicProfile";
import { Toaster } from "sonner";
import AuthSide from "./components/AuthSide";
import { useSelector, useDispatch } from "react-redux";
import { closeAuthSidebar } from "@/features/uiSlice";

export default function App() {
  const open = useSelector((state) => state.ui.showAuthSidebar);
  const dispatch = useDispatch();
  return (
    <>
      <Router>
        {open && <AuthSide open={open} setOpen={(value) => dispatch(closeAuthSidebar())} />}
        <Routes>
          <Route path="/" element={<Home />} />
          {/*    <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> */}
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/subscription"
            element={
              <ProtectedRoute>
                <SubscriptionSection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/success"
            element={
              <ProtectedRoute>
                <SuccessPayment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/failed"
            element={
              <ProtectedRoute>
                <FailedPayment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <PublicProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      <Toaster position="top-left" richColors />
    </>
  );
}
