import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation";
import axios from "axios";
import { AuthUser, useAuthStore } from "@/app/store/authStore";
import { api } from "@/app/api/axios";

const roleToRoute: Record<string, string> = {
    admin: "admin",
    boat_crew: "boat-crew",
    boat_crew_trainee: "boat-crew-trainee",
    terminal_controller: "terminal-controller",
    engineer: "terminal-controller",
    technician: "terminal-controller",
};
interface LoginResponse {
    token: string;
    user: AuthUser;
}


export const useLogin = () => {
    const router = useRouter();
    const { setAuth } = useAuthStore();

    return useMutation({
        mutationFn: async (data: { id: string; password: string }) => {
            try {
                const response = await api.post<LoginResponse>("/login", data);
                return response.data;
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const message: string =
                        err.response?.data?.message ??
                        'Login failed. Please check your credentials.';
                    throw new Error(message);
                }
                throw err;
            }
        },
        onSuccess: (data) => {
            setAuth(data.token, data.user);

            const { role, isProfileComplete } = data.user;

            if (role !== "admin" && !isProfileComplete) {
                router.push("/onboarding");
                return;
            }

            const route = roleToRoute[role] ?? role;
            router.push(`/${route}`);
        },
        onError: () => {}
    })
}
