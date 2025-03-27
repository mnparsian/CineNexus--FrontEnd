import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const FailedPayment = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/dashboard", { state: { tab: "subscription" } });
    }, 3000);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100">
      <FaTimesCircle className="text-red-600 text-6xl mb-4" />
      <h2 className="text-2xl font-bold">Your payment was unsuccessful. ❌</h2>
      <p className="text-gray-600">Returning to the subscription page...</p>
    </div>
  );
};

export default FailedPayment;
