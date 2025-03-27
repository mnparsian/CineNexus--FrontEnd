import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaPaypal } from "react-icons/fa";

const SubscriptionSection = () => {
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.auth.user?.id);
  console.log("User id:", userId);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    const paymentId = urlParams.get("paymentId");

    if (success === "true" && paymentId) {
      handleSuccessfulPayment(paymentId);
    } else if (success === "false") {
      console.warn("❌ Payment was cancelled.");
    }
  }, []);

  const handleSuccessfulPayment = async (paymentId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/payments/execute?paymentId=${paymentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) throw new Error("⚠ Failed to confirm payment");

      console.log("✅ Payment successfully confirmed!");
      fetchSubscriptionData();
    } catch (error) {
      console.error("🚨 Error confirming payment:", error);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
    fetchPaymentHistory();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      if (!userId) throw new Error("⚠ User ID not found");

      const response = await fetch(`http://localhost:8080/api/subscriptions/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      if (!response.ok) throw new Error("⚠ Failed to fetch subscription");

      const data = await response.json();
      setSubscription(data);
    } catch (error) {
      console.error("🚨 Error fetching subscription:", error);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/payments/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await response.json();
      setPayments(data);
      setLoading(false);
    } catch (error) {
      console.error("🚨 Error fetching payment history:", error);
      setLoading(false);
    }
  };

  const handleSubscription = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/paypal/create?amount=1.99`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) throw new Error("⚠️ Failed to initiate payment");

      const data = await response.json();

      if (data.paymentId && data.approvalLink) {
        localStorage.setItem("paymentId", data.paymentId);

        window.location.href = data.approvalLink;
      } else {
        console.error("❌ No valid payment data received.");
      }
    } catch (error) {
      console.error("❌ Error processing payment:", error);
    }
  };

  const formattedDate = new Date(subscription?.endDate).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short"
  });

  return (
    <div className="p-6 bg-background rounded-lg shadow-lg max-w-2xl mx-auto w-full text-foreground">
      <h2 className="text-2xl font-bold mb-6 text-center">🛡️ Your Subscription</h2>

      {subscription ? (
        <div className="mb-6 space-y-2">
          <p>
            <span className="font-semibold">Status:</span> {subscription.status ? "✅ Active" : "❌ Expired"}
          </p>
          <p>
            <span className="font-semibold">Type:</span> {subscription.subscriptionType}
          </p>
          <p>
            <span className="font-semibold">Expiration Date:</span> {formattedDate}
          </p>

          <button onClick={handleSubscription} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-3 w-full sm:w-auto">
            {subscription.active ? "Renew Subscription" : "Purchase Subscription"}
          </button>
        </div>
      ) : (
        <p className="text-red-300 mb-4">❌ You have no active subscriptions!</p>
      )}

      <h3 className="text-xl font-semibold mb-4">💳 Payment History</h3>

      {loading ? (
        <p className="text-gray-400">⏳ Loading...</p>
      ) : payments.length > 0 ? (
        <ul className="space-y-3">
          {payments.map((payment, index) => (
            <li key={index} className="border border-gray-700 rounded-md p-4">
              <p>
                <span className="font-semibold">Amount:</span> {payment.amount} €
              </p>
              <p>
                <span className="font-semibold">Date:</span> {payment.date}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {payment.status === "COMPLETED" ? "✅ Successful" : "❌ Failed"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">🚫 No payment history found.</p>
      )}

      <button
        onClick={handleSubscription}
        className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 mt-6 rounded w-full flex items-center justify-center"
      >
        <FaPaypal className="mr-2" /> {subscription?.active ? "Renew Subscription" : "Purchase Subscription"}
      </button>
    </div>
  );
};

export default SubscriptionSection;
