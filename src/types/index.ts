export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
  assignedTo?: string;
  assignee?: User | null;
}

export {};
