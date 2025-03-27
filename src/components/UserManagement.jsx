import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function UserManagement({ user, onUpdate }) {
  const [newRole, setNewRole] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    setNewRole(user.role);
    setNewStatus(user.status);
  }, [user]);

  const handleFullUpdate = async () => {
    const body = {};

    if (newPassword.trim()) body.password = newPassword;
    if (newRole !== user.role) body.role = newRole;
    if (newStatus !== user.status) body.status = newStatus;

    if (Object.keys(body).length === 0) {
      toast.info("No changes to update");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/users/update/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("User updated successfully");
      setNewPassword("");
      const updatedUser = {
        ...user,
        ...body
      };
      onUpdate?.(updatedUser);
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/users/${user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Failed to delete user");

      toast.success("User deleted successfully");
      onUpdate?.();
    } catch (err) {
      toast.error("Error deleting user");
      console.error(err);
    }
  };

  return (
    <div className="bg-muted rounded-lg p-6 mt-4 space-y-5 max-w-md shadow-lg">
      <div>
        <p className="text-foreground font-semibold text-lg">{user.username}</p>
        <p className="text-foreground text-sm">{user.email}</p>
        <p className="text-foreground text-sm">Role: {user.role}</p>
        <p className="text-foreground text-sm">Status: {user.status}</p>
      </div>

      {/* Role */}
      <div className="space-y-1">
        <label className="text-sm text-foreground">Role:</label>
        <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="w-full bg-background text-foreground px-3 py-2 rounded">
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      {/* Status */}
      <div className="space-y-1">
        <label className="text-sm text-foreground">Status:</label>
        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full bg-background text-foreground px-3 py-2 rounded">
          <option value="ACTIVE">ACTIVE</option>
          <option value="BANNED">BANNED</option>
          <option value="DEACTIVATED">DEACTIVATED</option>
        </select>
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-sm text-foreground">Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          className="w-full bg-background px-3 py-2 text-foreground rounded"
        />
      </div>

      {/* Update */}
      <button onClick={handleFullUpdate} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition">
        Update User
      </button>

      {/* Delete */}
      <button onClick={handleDeleteUser} className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition">
        Delete User
      </button>
    </div>
  );
}
