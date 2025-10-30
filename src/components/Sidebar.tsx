import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../style.css";

interface SidebarProps {
  desktopOpen?: boolean;
  onDesktopToggle?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  desktopOpen = true,
  onDesktopToggle,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const { user, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    if (onMobileClose) onMobileClose();
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${mobileOpen ? "visible" : ""}`}
        onClick={onMobileClose}
        aria-hidden={!mobileOpen}
      />

      <aside
        className={`sidebar ${desktopOpen ? "open" : "closed"} ${
          mobileOpen ? "mobile-open" : ""
        }`}
        aria-hidden={false}
      >
        <div className="sidebar-top">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              className="sidebar-toggle"
              aria-label={desktopOpen ? "Collapse sidebar" : "Expand sidebar"}
              onClick={onDesktopToggle}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d={desktopOpen ? "M15 18l-6-6 6-6" : "M9 6l6 6-6 6"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="brand">
              <NavLink to="/" className="brand-link" onClick={onMobileClose}>
                <span className="brand-mark" aria-hidden>
                  TM
                </span>
                {desktopOpen && <span className="brand-text">Task Manager</span>}
              </NavLink>
            </div>
          </div>
          <button
            className="sidebar-mobile-close"
            onClick={onMobileClose}
            aria-label="Close menu"
            title="Close"
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav" role="navigation" aria-label="Main">
          <NavLink to="/dashboard" className="nav-item" onClick={onMobileClose}>
            <span className="nav-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" fill="currentColor" />
              </svg>
            </span>
            {desktopOpen && <span className="nav-label">Dashboard</span>}
          </NavLink>

          <NavLink to="/tasks" className="nav-item" onClick={onMobileClose}>
            <span className="nav-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {desktopOpen && <span className="nav-label">Tasks</span>}
          </NavLink>

          <NavLink to="/users" className="nav-item" onClick={onMobileClose}>
            <span className="nav-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-3-3.87M4 21v-2a4 4 0 0 1 3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {desktopOpen && <span className="nav-label">Users</span>}
          </NavLink>

          <NavLink to="/settings" className="nav-item" onClick={onMobileClose}>
            <span className="nav-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {desktopOpen && <span className="nav-label">Settings</span>}
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          {desktopOpen && user && <div className="sidebar-user">Signed in as <strong>{user}</strong></div>}
          <button className="btn small sidebar-logout" onClick={handleLogout}>
            <span className="nav-icon" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {desktopOpen && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
