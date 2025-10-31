import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CreateTaskModal from "../components/CreateTaskModal";
import { getDashboardStats, DashboardStats, createTask, CreateTaskData, listTasks } from "../api/tasksApi";
import { Task } from "../types";
import "../style.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [desktopOpen, setDesktopOpen] = useState<boolean>(true);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [stats, setStats] = useState<DashboardStats>({ total: 0, open: 0, completed: 0, assignedToMe: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState<boolean>(false);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const dashboardStats = await getDashboardStats();
        setStats(dashboardStats);
      } catch (err: any) {
        console.error("Error fetching dashboard stats:", err);
        setError(err?.response?.data?.error || err?.message || "Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentTasks = async () => {
      try {
        setLoadingTasks(true);
        const tasks = await listTasks();
        setRecentTasks(tasks.slice(0, 5));
      } catch (err: any) {
        console.error("Error fetching recent tasks:", err);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchStats();
    fetchRecentTasks();
  }, []);

  const handleCreateTask = async (data: CreateTaskData) => {
    try {
      await createTask(data);
      const [dashboardStats, tasks] = await Promise.all([
        getDashboardStats(),
        listTasks()
      ]);
      setStats(dashboardStats);
      setRecentTasks(tasks.slice(0, 5));
    } catch (err: any) {
      throw err;
    }
  };

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

          {error && (
            <div className="error" style={{ marginBottom: "1rem" }}>
              {error}
            </div>
          )}

          <section className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">Total Tasks</p>
              <p className="stat-value">{loading ? "..." : stats.total}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Open</p>
              <p className="stat-value">{loading ? "..." : stats.open}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Completed</p>
              <p className="stat-value">{loading ? "..." : stats.completed}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Assigned to you</p>
              <p className="stat-value">{loading ? "..." : stats.assignedToMe}</p>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2>Recent Tasks</h2>
              <div className="panel-actions">
                <button className="btn" onClick={() => setIsCreateTaskModalOpen(true)}>Add Task</button>
                <button className="btn outline" onClick={() => navigate("/tasks")}>View all</button>
              </div>
            </div>
            <div className="panel-body">
              {loadingTasks && <p className="muted">Loading recent tasks...</p>}
              {!loadingTasks && recentTasks.length === 0 && (
                <p className="muted">No tasks yet. Create your first task!</p>
              )}
              {!loadingTasks && recentTasks.length > 0 && (
                <div className="table">
                  <div className="table-header">
                    <div>Title</div>
                    <div>Status</div>
                    <div>Assignee</div>
                    <div>Due Date</div>
                  </div>
                  {recentTasks.map((task) => (
                    <div key={task.id} className={`table-row ${task.completed ? 'completed' : ''}`}>
                      <div data-label="Title">
                        <span style={{ fontWeight: '500' }}>{task.title}</span>
                      </div>
                      <div data-label="Status">
                        <span className={`status-badge ${task.completed ? 'completed' : 'open'}`}>
                          {task.completed ? "Completed" : "Open"}
                        </span>
                      </div>
                      <div data-label="Assignee">
                        {task.assignee ? `${task.assignee.name}` : <span className="muted">Unassigned</span>}
                      </div>
                      <div data-label="Due Date">
                        {task.dueDate ? (
                          new Date(task.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })
                        ) : (
                          <span className="muted">No due date</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}
