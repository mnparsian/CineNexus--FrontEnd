import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SuccessPayment = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get("paymentId");
    const token = urlParams.get("token");
    const payerId = urlParams.get("PayerID");

    if (!paymentId || !token || !payerId) {
      setStatus("failed");
      setError("Missing payment details.");
      return;
    }

    const confirmPayment = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/paypal/success?paymentId=${paymentId}&token=${token}&PayerID=${payerId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (!response.ok) {
          throw new Error("Payment verification failed.");
        }

        setStatus("success");

        setTimeout(() => {
          navigate("/dashboard", { state: { tab: "subscription" } });
        }, 3000);
      } catch (err) {
        console.error("Error confirming payment:", err);
        setStatus("failed");
        setError(err.message);
      }
    };

    confirmPayment();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      {status === "processing" && (
        <div>
          <h2 className="text-2xl font-semibold">Processing payment...⏳</h2>
          <p>Please wait.</p>
        </div>
      )}
      {status === "success" && (
        <div>
          <h2 className="text-2xl font-semibold text-green-500">✅ Successful payment!</h2>
          <p>Redirecting to your subscriptions...</p>
        </div>
      )}
      {status === "failed" && (
        <div>
          <h2 className="text-2xl font-semibold text-red-500">❌ Payment failed!</h2>
          <p>{error || "There was a problem verifying the payment."}</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded" onClick={() => navigate("/dashboard/subscription")}>
            Return to dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default SuccessPayment;
