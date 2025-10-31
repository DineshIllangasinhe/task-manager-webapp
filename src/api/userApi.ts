import axiosInstance from "./axiosInstance";
import { User } from "../types";

export async function getUsers(): Promise<User[]> {
  const res = await axiosInstance.get("/users/users");
  return res.data.users || [];
}

export async function getCurrentUser(): Promise<User> {
  const res = await axiosInstance.get("/users/me");
  return res.data.user;
}

type UpdateUserData = {
  name?: string;
  email?: string;
  password?: string;
};

export async function updateCurrentUser(data: UpdateUserData): Promise<User> {
  const res = await axiosInstance.put("/users/me", data);
  return res.data.user;
}