import axiosInstance from "./axiosInstance";
import { Task } from "../types";

export async function listTasks(): Promise<Task[]> {
  const res = await axiosInstance.get("/tasks");
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


