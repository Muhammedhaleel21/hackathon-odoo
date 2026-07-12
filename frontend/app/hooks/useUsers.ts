"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersService } from "../services/users.service";
import type { CreateUserPayload, UpdateUserPayload } from "../types/user.types";

export const USER_QUERY_KEY = ["users"] as const;

/** Fetch all users */
export function useUsers() {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: () => usersService.getAll(),
    retry: 1,
  });
}

/** Fetch single user */
export function useUser(id: string) {
  return useQuery({
    queryKey: [...USER_QUERY_KEY, id],
    queryFn: () => usersService.getOne(id),
    enabled: !!id,
  });
}

/** Create user mutation */
export function useCreateUser(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      toast.success("Employee created successfully!", {
        description: "The new employee has been added to the system.",
      });
      options?.onSuccess?.();
    },
    onError: (error: { response?: { data?: { message?: string } }; message?: string }) => {
      const msg =
        error?.response?.data?.message ??
        error?.message ??
        "Failed to create employee";
      toast.error("Creation failed", { description: msg });
    },
  });
}

/** Update user mutation */
export function useUpdateUser(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      usersService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      toast.success("Employee updated successfully!");
      options?.onSuccess?.();
    },
    onError: (error: { response?: { data?: { message?: string } }; message?: string }) => {
      const msg =
        error?.response?.data?.message ??
        error?.message ??
        "Failed to update employee";
      toast.error("Update failed", { description: msg });
    },
  });
}

/** Delete user mutation */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      toast.success("Employee deleted successfully!");
    },
    onError: (error: { response?: { data?: { message?: string } }; message?: string }) => {
      const msg =
        error?.response?.data?.message ??
        error?.message ??
        "Failed to delete employee";
      toast.error("Deletion failed", { description: msg });
    },
  });
}
