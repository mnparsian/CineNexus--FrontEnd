import { useState } from "react";
import { toast } from "sonner";

export default function AddUserForm() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    role: "USER"
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to create user");

      toast.success("User created successfully!");
      setFormData({
        name: "",
        surname: "",
        username: "",
        email: "",
        password: "",
        role: "USER"
      });
    } catch (err) {
      toast.error("Error creating user.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-muted p-6 rounded-lg max-w-md">
      <input
        type="text"
        name="name"
        placeholder="First Name"
        className="w-full px-4 py-2 rounded bg-background text-foreground focus:outline-none"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="surname"
        placeholder="Last Name"
        className="w-full px-4 py-2 rounded bg-background text-foreground focus:outline-none"
        value={formData.surname}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="username"
        placeholder="Username"
        className="w-full px-4 py-2 rounded bg-background text-foreground focus:outline-none"
        value={formData.username}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full px-4 py-2 rounded bg-background text-foreground focus:outline-none"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        className="w-full px-4 py-2 rounded bg-background text-foreground focus:outline-none"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 rounded bg-background text-foreground focus:outline-none">
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </select>

      <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition">
        {loading ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
