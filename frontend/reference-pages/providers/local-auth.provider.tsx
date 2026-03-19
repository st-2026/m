// "use client";

// import { useAuth as useAuthLogic } from "@/hooks/use-auth";
// import { User } from "@/lib/types";
// import { createContext, useContext, useEffect, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import Logo from "@/components/logo";
// import { toast } from "sonner";
// import { useTranslations } from "next-intl";
// import { Loader2 } from "lucide-react";
// import { useGetMeQuery } from "@/lib/api";

// interface AuthContextType {
//   user: User | null | undefined;
//   loading: boolean;
//   isAuthenticated: boolean;
// }

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   isAuthenticated: false,
// });

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const t = useTranslations("auth");

//   // Use the new custom hook
//   const { data: user, isLoading: loading } = useGetMeQuery(undefined);

//   const isAuthenticated = useMemo(() => !!user, [user]);

//   // Handle redirects based on authentication state
//   useEffect(() => {
//     // If still loading, don't redirect yet
//     if (loading) return;

//     // If user is not authenticated and trying to access protected route
//     if (!isAuthenticated && process.env.NODE_ENV === "development") {
//       router.push("/login");
//       return;
//     }
//   }, [isAuthenticated, router, loading]);

//   // Show loading spinner while authenticating
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background w-screen text-primary flex items-center flex-col justify-center">
//         <Logo />
//         <Loader2 className="animate-spin mt-4" size={24} />
//         <span className="text-sm">{t("loading")}</span>
//       </div>
//     );
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         isAuthenticated,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);
