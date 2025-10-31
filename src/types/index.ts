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
  assignedTo?: string;
  assignee?: User | null;
}

export {};
