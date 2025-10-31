import React from "react";
import { Task } from "../types";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export default function TaskDetailModal({ isOpen, onClose, task }: TaskDetailModalProps) {
  if (!isOpen || !task) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Task Details</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-form">
          <div className="form-group">
            <label className="form-label">Title</label>
            <div className="form-display">{task.title}</div>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <div className="form-display">
              <span className={`status-badge ${task.completed ? "completed" : "open"}`}>
                {task.completed ? "Completed" : "Open"}
              </span>
            </div>
          </div>

          {task.description && (
            <div className="form-group">
              <label className="form-label">Description</label>
              <div className="form-display">{task.description}</div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Due Date</label>
            <div className="form-display">{formatDate(task.dueDate)}</div>
          </div>

          <div className="form-group">
            <label className="form-label">Assigned To</label>
            <div className="form-display">
              {task.assignee ? `${task.assignee.name} (${task.assignee.email})` : "Unassigned"}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Created At</label>
            <div className="form-display">{formatDate(task.createdAt)}</div>
          </div>

          <div className="form-group">
            <label className="form-label">Last Updated</label>
            <div className="form-display">{formatDate(task.updatedAt)}</div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn outline" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

