import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "admin" | "dispatcher" | "fleet_manager" | "financial_analyst" | "safety_officer" ;

export interface AuthUser {
    id: string;
    employeeId: string;
    name: string;
    role: Role;
    isProfileComplete: boolean;
    isFirstLogin: boolean;
}

interface AuthStore {
    token: string | null;
    user: AuthUser | null;
    // The role dashboard the super_admin is currently viewing. Null for all other roles. 
    viewingAs: Role | null;
    setAuth: (token: string, user: AuthUser) => void;
    clearAuth: () => void;
    setViewingAs: (role: Role) => void;
    clearViewingAs: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            viewingAs: null,
            setAuth: (token, user) => set({ token, user, viewingAs: null }),
            clearAuth: () => set({ token: null, user: null, viewingAs: null }),
            setViewingAs: (role) => set({ viewingAs: role }),
            clearViewingAs: () => set({ viewingAs: null }),
        }),
        {
            name: "auth-storage",
        }
    )
);
