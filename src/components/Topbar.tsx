import React from "react";

interface TopbarProps {
  onMobileToggle: () => void;
  title?: string;
}

export default function Topbar({ onMobileToggle, title = "Dashboard" }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-inner container">
        <button
          className="hamburger topbar-hamburger"
          aria-label="Open menu"
          onClick={onMobileToggle}
          type="button"
        >
          <svg
            className="hamburger-icon"
            width="24"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="topbar-title">
          <h2>{title}</h2>
        </div>

        <div className="topbar-right" />
      </div>
    </header>
  );
}
