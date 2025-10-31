import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CreateTaskModal from "../components/CreateTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import TaskDetailModal from "../components/TaskDetailModal";
import { listTasks, createTask, CreateTaskData, updateTask, UpdateTaskData, deleteTask, TaskFilters } from "../api/tasksApi";
import { getUsers } from "../api/userApi";
import { Task, User } from "../types";
import "../style.css";

type FilterStatus = 'all' | 'open' | 'completed';

export default function Tasks() {
  const [desktopOpen, setDesktopOpen] = React.useState<boolean>(true);
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState<boolean>(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = React.useState<number | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<FilterStatus>('all');
  const [filterAssigneeId, setFilterAssigneeId] = React.useState<number | null | undefined>(undefined);
  const [filterDueDateFrom, setFilterDueDateFrom] = React.useState<string>('');
  const [filterDueDateTo, setFilterDueDateTo] = React.useState<string>('');

  const loadTasks = React.useCallback(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    
    const filters: TaskFilters = {};
    if (filterStatus !== 'all') {
      filters.completed = filterStatus === 'completed';
    }
    if (filterAssigneeId !== undefined) {
      filters.assignedToId = filterAssigneeId;
    }
    if (filterDueDateFrom) {
      filters.dueDateFrom = filterDueDateFrom;
    }
    if (filterDueDateTo) {
      filters.dueDateTo = filterDueDateTo;
    }
    
    listTasks(filters)
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
  }, [filterStatus, filterAssigneeId, filterDueDateFrom, filterDueDateTo]);

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

  const handleUpdateTask = async (data: UpdateTaskData) => {
    if (selectedTask) {
      await updateTask(selectedTask.id, data);
      loadTasks();
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
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

  const handleStatusToggle = async (task: Task) => {
    setUpdatingTaskId(task.id);
    try {
      const updatedTask = await updateTask(task.id, { completed: !task.completed });
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === task.id ? updatedTask : t
        )
      );
    } catch (err: any) {
      console.error("Failed to update status:", err);
      loadTasks();
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    
    setUpdatingTaskId(taskId);
    try {
      await deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
    } catch (err: any) {
      console.error("Failed to delete task:", err);
      alert(err?.response?.data?.error || "Failed to delete task");
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
                <button className="btn" onClick={() => setIsModalOpen(true)}>Add Task</button>
              </div>
            </div>
            <div style={{ padding: '16px', borderBottom: '1px solid rgba(15,23,42,0.06)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Status</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className={`btn outline ${filterStatus === 'all' ? 'active' : ''}`}
                      onClick={() => setFilterStatus('all')}
                      style={{ padding: '6px 12px', fontSize: '14px' }}
                    >
                      All
                    </button>
                    <button 
                      className={`btn outline ${filterStatus === 'open' ? 'active' : ''}`}
                      onClick={() => setFilterStatus('open')}
                      style={{ padding: '6px 12px', fontSize: '14px' }}
                    >
                      Open
                    </button>
                    <button 
                      className={`btn outline ${filterStatus === 'completed' ? 'active' : ''}`}
                      onClick={() => setFilterStatus('completed')}
                      style={{ padding: '6px 12px', fontSize: '14px' }}
                    >
                      Completed
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '200px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Assignee</label>
                  <select
                    className="table-select"
                    value={filterAssigneeId === null ? 'null' : (filterAssigneeId?.toString() || '')}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setFilterAssigneeId(undefined);
                      } else if (value === 'null') {
                        setFilterAssigneeId(null);
                      } else {
                        setFilterAssigneeId(parseInt(value, 10));
                      }
                    }}
                    style={{ padding: '6px 10px', fontSize: '14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.06)' }}
                  >
                    <option value="">All Assignees</option>
                    <option value="null">Unassigned</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id.toString()}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Due Date From</label>
                  <input
                    type="date"
                    value={filterDueDateFrom}
                    onChange={(e) => setFilterDueDateFrom(e.target.value)}
                    style={{ padding: '6px 10px', fontSize: '14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.06)' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Due Date To</label>
                  <input
                    type="date"
                    value={filterDueDateTo}
                    onChange={(e) => setFilterDueDateTo(e.target.value)}
                    style={{ padding: '6px 10px', fontSize: '14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.06)' }}
                  />
                </div>
                {(filterAssigneeId !== undefined || filterDueDateFrom || filterDueDateTo) && (
                  <button
                    className="btn outline"
                    onClick={() => {
                      setFilterAssigneeId(undefined);
                      setFilterDueDateFrom('');
                      setFilterDueDateTo('');
                    }}
                    style={{ padding: '6px 12px', fontSize: '14px' }}
                  >
                    Clear Filters
                  </button>
                )}
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
                    <div>Actions</div>
                  </div>
                  {tasks.map((t) => (
                    <div key={t.id} className={`table-row ${t.completed ? 'completed' : ''}`}>
                      <div data-label="Title">
                        <span 
                          onClick={() => handleViewTask(t)}
                          style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          {t.title}
                        </span>
                      </div>
                      <div data-label="Status">
                        <span 
                          className={`status-badge ${t.completed ? 'completed' : 'open'} ${updatingTaskId === t.id ? 'updating' : ''}`}
                          onClick={() => handleStatusToggle(t)}
                          style={{ cursor: 'pointer' }}
                        >
                          {t.completed ? "Completed" : "Open"}
                        </span>
                      </div>
                      <div data-label="Assignee">
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
                      <div data-label="Actions">
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn outline" 
                            onClick={() => handleEditTask(t)}
                            style={{ padding: '4px 8px', fontSize: '14px' }}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn outline" 
                            onClick={() => handleDeleteTask(t.id)}
                            disabled={updatingTaskId === t.id}
                            style={{ 
                              padding: '4px 8px', 
                              fontSize: '14px',
                              color: 'var(--danger)',
                              borderColor: 'var(--danger)'
                            }}
                          >
                            Delete
                          </button>
                        </div>
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
      
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleUpdateTask}
        task={selectedTask}
      />
      
      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />
    </div>
  );
}


