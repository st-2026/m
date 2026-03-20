import { useAuth as useAuthHook } from "@/providers/auth.provider";

export const useAuth = (): ReturnType<typeof useAuthHook> => useAuthHook();
