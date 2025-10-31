import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, updateCurrentUser } from "../api/userApi";
import { User } from "../types";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../style.css";

export default function Profile() {
  const navigate = useNavigate();
  const [desktopOpen, setDesktopOpen] = React.useState<boolean>(true);
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUser();
      setUser(userData);
      setFormData({
        name: userData.name,
        email: userData.email,
        password: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      console.error(err);
      setError("Failed to load user data");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password) {
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    try {
      setUpdating(true);
      const updateData: { name?: string; email?: string; password?: string } = {};
      
      if (formData.name !== user?.name) {
        updateData.name = formData.name;
      }
      if (formData.email !== user?.email) {
        updateData.email = formData.email;
      }
      if (formData.password) {
        updateData.password = formData.password;
      }

      if (Object.keys(updateData).length === 0) {
        setError("No changes to save");
        setUpdating(false);
        return;
      }

      const updatedUser = await updateCurrentUser(updateData);
      setUser(updatedUser);
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      });
      setSuccess("Profile updated successfully!");
      
      if (updateData.name) {
        localStorage.setItem("user", updatedUser.name);
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        setError(errors.map((e: any) => e.msg).join(", "));
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar
          desktopOpen={desktopOpen}
          onDesktopToggle={() => setDesktopOpen((s) => !s)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <main className="main-column">
          <Topbar onMobileToggle={() => setMobileOpen(true)} title="Profile" />
          <div className="main-content">
            <div className="panel">
              <p className="muted">Loading...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar
        desktopOpen={desktopOpen}
        onDesktopToggle={() => setDesktopOpen((s) => !s)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <main className="main-column">
        <Topbar onMobileToggle={() => setMobileOpen(true)} title="Profile" />

        <div className="main-content">
          <header className="main-header">
            <h1 className="page-title">My Profile</h1>
            <p className="page-subtitle">Manage your account settings and information</p>
          </header>

          <section className="panel">
            <div className="panel-header">
              <h2>Account Information</h2>
            </div>
            <div className="panel-body">
              <form onSubmit={handleSubmit} className="form">
                <label className="label">
                  Full Name
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

                <div className="divider" style={{ margin: "1.5rem 0", borderTop: "1px solid var(--border-color, #e0e0e0)" }} />

                <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem", fontWeight: 600 }}>
                  Change Password (optional)
                </h3>
                <p className="muted" style={{ marginBottom: "1rem", fontSize: "0.9rem" }}>
                  Leave blank if you don't want to change your password
                </p>

                <label className="label">
                  New Password
                  <input
                    className="input"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                    type="password"
                    autoComplete="new-password"
                  />
                </label>

                <label className="label">
                  Confirm New Password
                  <input
                    className="input"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your new password"
                    type="password"
                    autoComplete="new-password"
                  />
                </label>

                {error && <div className="error">{error}</div>}
                {success && <div className="success" style={{ 
                  padding: "0.75rem", 
                  backgroundColor: "#d4edda", 
                  color: "#155724", 
                  borderRadius: "4px",
                  marginBottom: "1rem"
                }}>{success}</div>}

                <div className="form-actions" style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                  <button className="btn primary" type="submit" disabled={updating}>
                    {updating ? "Updating..." : "Save Changes"}
                  </button>
                  <button 
                    className="btn outline" 
                    type="button" 
                    onClick={() => {
                      setFormData({
                        name: user?.name || "",
                        email: user?.email || "",
                        password: "",
                        confirmPassword: "",
                      });
                      setError(null);
                      setSuccess(null);
                    }}
                    disabled={updating}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </section>

          <section className="panel" style={{ marginTop: "1.5rem" }}>
            <div className="panel-header">
              <h2>Account Details</h2>
            </div>
            <div className="panel-body">
              <div style={{ display: "grid", gap: "1rem" }}>
                <div>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-muted, #666)", marginBottom: "0.25rem" }}>
                    User ID
                  </p>
                  <p style={{ fontWeight: 500 }}>{user?.id}</p>
                </div>
                <div>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-muted, #666)", marginBottom: "0.25rem" }}>
                    Email
                  </p>
                  <p style={{ fontWeight: 500 }}>{user?.email}</p>
                </div>
                <div>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-muted, #666)", marginBottom: "0.25rem" }}>
                    Name
                  </p>
                  <p style={{ fontWeight: 500 }}>{user?.name}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

