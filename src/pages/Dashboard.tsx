import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../style.css";

export default function Dashboard() {
  const [desktopOpen, setDesktopOpen] = React.useState<boolean>(true);
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);

  const stats = { total: 24, open: 9, completed: 15, assignedToMe: 5 };

  return (
    <div className="app-layout">
      <Sidebar
        desktopOpen={desktopOpen}
        onDesktopToggle={() => setDesktopOpen((s) => !s)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <main className="main-column">
        <Topbar onMobileToggle={() => setMobileOpen(true)} title="Dashboard" />

        <div className="main-content">
          <header className="main-header">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Overview of tasks and quick actions</p>
          </header>

          <section className="stats-grid">
            <div className="stat-card"><p className="stat-label">Total Tasks</p><p className="stat-value">{stats.total}</p></div>
            <div className="stat-card"><p className="stat-label">Open</p><p className="stat-value">{stats.open}</p></div>
            <div className="stat-card"><p className="stat-label">Completed</p><p className="stat-value">{stats.completed}</p></div>
            <div className="stat-card"><p className="stat-label">Assigned to you</p><p className="stat-value">{stats.assignedToMe}</p></div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2>Recent Tasks</h2>
              <div className="panel-actions">
                <button className="btn">Add Task</button>
                <button className="btn outline">View all</button>
              </div>
            </div>
            <div className="panel-body">
              <p className="muted">No tasks yet — replace these placeholders with fetched tasks.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
