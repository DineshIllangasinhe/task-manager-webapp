import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import "../style.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginUser({ email: form.email, password: form.password });
      if (data?.token && data?.user?.name) {
        login(data.token, data.user.name);
        if (remember) {
        }
        navigate("/dashboard");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page login-page">
      <div className="card login-card">
        <div className="login-left">
          <h1 className="title">Welcome back</h1>
          <p className="muted">Sign in to manage your tasks — fast and easy.</p>

          <form onSubmit={handleSubmit} className="form login-form">
            <label className="label">
              Email
              <input
                className="input"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </label>

            <label className="label">
              Password
              <div className="password-row">
                <input
                  className="input"
                  name="password"
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => setShowPwd((s) => !s)}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <div className="form-row spaced">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <Link to="/forgot" className="link small">
                Forgot?
              </Link>
            </div>

            {error && <div className="error">{error}</div>}

            <button className="btn wide" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="muted text-center small">
            Don’t have an account?{" "}
            <Link to="/register" className="link">
              Create one
            </Link>
          </p>
        </div>

        <div className="login-right" aria-hidden="true">
          <div className="illustration">
            <svg viewBox="0 0 200 200" className="ill-svg">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="200" height="200" rx="20" fill="url(#g1)" />
              <g transform="translate(30,36)" fill="#fff" opacity="0.95">
                <rect x="0" y="0" width="140" height="18" rx="3" />
                <rect x="0" y="28" width="110" height="12" rx="3" />
                <rect x="0" y="50" width="130" height="12" rx="3" />
                <circle cx="110" cy="90" r="22" />
                <rect x="0" y="95" width="80" height="12" rx="3" />
              </g>
            </svg>
          </div>
          <p className="ill-text">
            Get things done. Assign tasks, track progress and finish faster.
          </p>
        </div>
      </div>
    </div>
  );
}
