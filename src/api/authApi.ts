import axiosInstance from "./axiosInstance";
import { User } from "../types";

type RegisterData = { name: string; email: string; password: string };

export async function registerUser(data: RegisterData) {
  const res = await axiosInstance.post("/auth/register", data);
  return res.data;
}

type LoginData = { email: string; password: string };

export async function loginUser(data: LoginData) {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
}

export async function getUsers(): Promise<User[]> {
  const res = await axiosInstance.get("/auth/users");
  return res.data.users || [];
}
