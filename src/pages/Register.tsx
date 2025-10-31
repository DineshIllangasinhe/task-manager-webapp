import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import "../style.css";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h1 className="title">Create an account</h1>

        <form onSubmit={handleSubmit} className="form">
          <label className="label">
            Full name
            <input
              className="input"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              required
              autoComplete="name"
            />
          </label>

          <label className="label">
            Email
            <input
              className="input"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              type="email"
              required
              autoComplete="email"
            />
          </label>

          <label className="label">
            Password
            <input
              className="input"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              type="password"
              required
              autoComplete="new-password"
            />
          </label>

          {error && <div className="error">{error}</div>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Register"}
          </button>
        </form>

        <p className="muted">
          Already have an account?{" "}
          <Link to="/login" className="link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
