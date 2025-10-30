import axiosInstance from "./axiosInstance";

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
