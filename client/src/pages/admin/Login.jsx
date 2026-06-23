import { useState } from "react";
import { useAuth } from "../../context/AdminAuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold">Admin Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input type="email" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded-lg px-4 py-2" />
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPass(e.target.value)}
          className="w-full border rounded-lg px-4 py-2" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">
          Login
        </button>
      </form>
    </div>
  );
}