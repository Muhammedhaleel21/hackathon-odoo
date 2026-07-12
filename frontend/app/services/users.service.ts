import { api } from "@/app/api/axios";
import type {
  User,
  CreateUserPayload,
  UpdateUserPayload,
} from "../types/user.types";

export const usersService = {
  /** GET /users — returns all users (JWT protected) */
  async getAll(): Promise<User[]> {
    const { data } = await api.get<User[]>("/users");
    return data;
  },

  /** GET /users/:id */
  async getOne(id: string): Promise<User> {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  /** POST /auth/register — creates a user and returns JWT + user */
  async create(payload: CreateUserPayload): Promise<{ user: User; token: string }> {
    const { data } = await api.post<{ user: User; token: string }>(
      "/auth/register",
      payload
    );
    return data;
  },

  /** PATCH /users/:id */
  async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const { data } = await api.patch<User>(`/users/${id}`, payload);
    return data;
  },

  /** DELETE /users/:id */
  async remove(id: string): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/users/${id}`);
    return data;
  },
};
