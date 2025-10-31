import axiosInstance from "./axiosInstance";
import { Task } from "../types";

export interface TaskFilters {
  completed?: boolean;
  assignedToId?: number | null;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export async function listTasks(filters?: TaskFilters): Promise<Task[]> {
  const params: Record<string, string> = {};
  
  if (filters?.completed !== undefined) {
    params.completed = filters.completed.toString();
  }
  if (filters?.assignedToId !== undefined) {
    if (filters.assignedToId === null) {
      params.assignedToId = 'null';
    } else {
      params.assignedToId = filters.assignedToId.toString();
    }
  }
  if (filters?.dueDateFrom) {
    params.dueDateFrom = filters.dueDateFrom;
  }
  if (filters?.dueDateTo) {
    params.dueDateTo = filters.dueDateTo;
  }
  
  const res = await axiosInstance.get("/tasks", { params });
  return res.data.tasks || res.data || [];
}

export interface CreateTaskData {
  title: string;
  description?: string;
  dueDate?: string;
  assignedToId?: number;
}

export async function createTask(data: CreateTaskData): Promise<Task> {
  const res = await axiosInstance.post("/tasks", data);
  return res.data.task || res.data;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  dueDate?: string;
  assignedToId?: number | null;
  completed?: boolean;
}

export async function updateTask(id: number, data: UpdateTaskData): Promise<Task> {
  const res = await axiosInstance.put(`/tasks/${id}`, data);
  return res.data.task || res.data;
}

export async function getTask(id: number): Promise<Task> {
  const res = await axiosInstance.get(`/tasks/${id}`);
  return res.data.task || res.data;
}

export async function deleteTask(id: number): Promise<void> {
  await axiosInstance.delete(`/tasks/${id}`);
}

export interface DashboardStats {
  total: number;
  open: number;
  completed: number;
  assignedToMe: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await axiosInstance.get("/tasks/stats/dashboard");
  return res.data;
}


