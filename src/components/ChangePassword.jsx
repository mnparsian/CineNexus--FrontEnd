import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("New password and confirm password do not match!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/users/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          userId: user.id,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmNewPassword: formData.confirmNewPassword
        })
      });

      if (!response.ok) {
        throw new Error("Failed to change password");
      }

      const data = await response.json();

      if (data) {
        setMessage("Password changed successfully!");
        setError("");
        setFormData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      }
    } catch (err) {
      setError("Incorrect current password or server error.");
      setMessage("");
    }
  };

  return (
    <div className="p-6 bg-muted rounded-lg text-foreground max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Change Password</h2>
      {message && <p className="text-green-400">{message}</p>}
      {error && <p className="text-red-400">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label className="block mt-2">Current Password:</label>
        <input
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          className="block w-full p-2 rounded bg-background text-foreground"
          required
        />

        <label className="block mt-2">New Password:</label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          className="block w-full p-2 rounded bg-background text-foreground"
          required
        />

        <label className="block mt-2">Confirm New Password:</label>
        <input
          type="password"
          name="confirmNewPassword"
          value={formData.confirmNewPassword}
          onChange={handleChange}
          className="block w-full p-2 rounded bg-background text-foreground"
          required
        />

        <button type="submit" className="bg-green-500 px-4 py-2 mt-4 rounded w-full">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
