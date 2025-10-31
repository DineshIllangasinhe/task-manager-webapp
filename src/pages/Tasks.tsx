import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CreateTaskModal from "../components/CreateTaskModal";
import { listTasks, createTask, CreateTaskData, updateTask } from "../api/tasksApi";
import { getUsers } from "../api/authApi";
import { Task, User } from "../types";
import "../style.css";

export default function Tasks() {
  const [desktopOpen, setDesktopOpen] = React.useState<boolean>(true);
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [updatingTaskId, setUpdatingTaskId] = React.useState<number | null>(null);

  const loadTasks = React.useCallback(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    listTasks()
      .then((data) => {
        if (isMounted) setTasks(data || []);
      })
      .catch((e) => {
        if (isMounted) setError(e?.response?.data?.message || "Failed to load tasks");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    loadTasks();
    getUsers()
      .then((userList) => {
        setUsers(userList || []);
      })
      .catch((err) => {
        console.error("Failed to load users:", err);
      });
  }, [loadTasks]);

  const handleCreateTask = async (data: CreateTaskData) => {
    await createTask(data);
    loadTasks();
  };

  const handleAssigneeChange = async (taskId: number, assignedToId: number | null) => {
    setUpdatingTaskId(taskId);
    try {
      const updatedTask = await updateTask(taskId, { assignedToId });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? updatedTask : task
        )
      );
    } catch (err: any) {
      console.error("Failed to update assignee:", err);
      loadTasks();
    } finally {
      setUpdatingTaskId(null);
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
        <Topbar onMobileToggle={() => setMobileOpen(true)} title="Tasks" />

        <div className="main-content">
          <header className="main-header">
            <h1 className="page-title">Tasks</h1>
            <p className="page-subtitle">All tasks from the server</p>
          </header>

          <section className="panel">
            <div className="panel-header">
              <h2>Task List</h2>
              <div className="panel-actions">
                <button className="btn primary" onClick={() => setIsModalOpen(true)}>Add Task</button>
              </div>
            </div>
            <div className="panel-body">
              {loading && <p className="muted">Loading...</p>}
              {error && !loading && <p className="error-text">{error}</p>}
              {!loading && !error && tasks.length === 0 && (
                <p className="muted">No tasks found.</p>
              )}
              {!loading && !error && tasks.length > 0 && (
                <div className="table">
                  <div className="table-header">
                    <div>Title</div>
                    <div>Status</div>
                    <div>Assignee</div>
                  </div>
                  {tasks.map((t) => (
                    <div key={t.id} className="table-row">
                      <div>{t.title}</div>
                      <div>{t.completed ? "Completed" : "Open"}</div>
                      <div>
                        <select
                          className="table-select"
                          value={t.assignee?.id?.toString() || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            handleAssigneeChange(t.id, value === "" ? null : parseInt(value, 10));
                          }}
                          disabled={updatingTaskId === t.id}
                        >
                          <option value="">Unassigned</option>
                          {users.map((user) => (
                            <option key={user.id} value={user.id.toString()}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                        {updatingTaskId === t.id && (
                          <span className="table-loading">Updating...</span>
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}


