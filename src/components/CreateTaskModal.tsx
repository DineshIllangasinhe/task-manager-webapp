import React from "react";
import { CreateTaskData } from "../api/tasksApi";
import { getUsers } from "../api/authApi";
import { User } from "../types";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskData) => Promise<void>;
}

interface CreateTaskFormData {
  title: string;
  description: string;
  dueDate: string;
  assignedToId: string;
}

export default function CreateTaskModal({ isOpen, onClose, onSubmit }: CreateTaskModalProps) {
  const [formData, setFormData] = React.useState<CreateTaskFormData>({
    title: "",
    description: "",
    dueDate: "",
    assignedToId: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [users, setUsers] = React.useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setFormData({ title: "", description: "", dueDate: "", assignedToId: "" });
      setErrors({});
      
      setLoadingUsers(true);
      getUsers()
        .then((userList) => {
          setUsers(userList || []);
        })
        .catch((err) => {
          console.error("Failed to load users:", err);
          setUsers([]);
        })
        .finally(() => {
          setLoadingUsers(false);
        });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.title.trim()) {
      setErrors({ title: "Title is required" });
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData: any = {
        title: formData.title.trim(),
      };

      if (formData.description.trim()) {
        submitData.description = formData.description.trim();
      }

      if (formData.dueDate) {
        submitData.dueDate = formData.dueDate;
      }

      if (formData.assignedToId) {
        submitData.assignedToId = parseInt(formData.assignedToId, 10);
      }

      await onSubmit(submitData as CreateTaskData);
      onClose();
    } catch (error: any) {
      if (error?.response?.data?.errors) {
        const backendErrors: Record<string, string> = {};
        error.response.data.errors.forEach((err: any) => {
          if (err.param) {
            backendErrors[err.param] = err.msg || err.message;
          }
        });
        setErrors(backendErrors);
      } else {
        setErrors({ submit: error?.response?.data?.message || error?.message || "Failed to create task" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Create New Task</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className={`form-input ${errors.title ? "error" : ""}`}
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-input form-textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description (optional)"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="dueDate">
              Due Date
            </label>
            <input
              type="datetime-local"
              id="dueDate"
              name="dueDate"
              className="form-input"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="assignedToId">
              Assign To
            </label>
            <select
              id="assignedToId"
              name="assignedToId"
              className="form-input"
              value={formData.assignedToId}
              onChange={handleChange}
            >
              <option value="">Select a user (optional)</option>
              {loadingUsers ? (
                <option disabled>Loading users...</option>
              ) : (
                users.map((user) => (
                  <option key={user.id} value={user.id.toString()}>
                    {user.name} ({user.email})
                  </option>
                ))
              )}
            </select>
            <small className="form-hint">Leave as "Select a user" if not assigning to anyone</small>
          </div>

          {errors.submit && <div className="form-error-message">{errors.submit}</div>}

          <div className="modal-actions">
            <button type="button" className="btn outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn primary" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

