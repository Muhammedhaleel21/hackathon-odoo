export type UserRole = "admin" | "fleet_manager" | "driver";

export interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  userId: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  role?: UserRole;
}

export type SortField = "id" | "name" | "createdAt";
export type SortDir = "asc" | "desc";
