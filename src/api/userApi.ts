import axiosInstance from "./axiosInstance";
import { User } from "../types";

export async function getUsers(): Promise<User[]> {
  const res = await axiosInstance.get("/users/users");
  return res.data.users || [];
}
