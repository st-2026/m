// "use client";

// import { useAuth as useAuthLogic } from "@/hooks/use-auth";
// import { User } from "@/lib/types";
// import { createContext, useContext, useEffect, useMemo } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { Spinner } from "@/components/ui/spinner";
// import Logo from "@/components/logo";
// import { toast } from "sonner";
// import { useTranslations } from "next-intl";

// interface AuthContextType {
//   user: User | null | undefined;
//   loading: boolean;
//   isAuthenticated: boolean;
//   error: string | null | undefined;
//   botStartRequired: boolean;
//   startBotUrl: string | null;
//   onboardingLoading: boolean;
//   onboardingError: string | null;
//   refreshBotStart: () => void;
// }

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   isAuthenticated: false,
//   error: null,
//   botStartRequired: false,
//   startBotUrl: null,
//   onboardingLoading: false,
//   onboardingError: null,
//   refreshBotStart: () => {},
// });

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const t = useTranslations("auth");

//   // Use the new custom hook
//   const {
//     user,
//     loading,
//     error,
//     botStartRequired,
//     startBotUrl,
//     onboardingLoading,
//     onboardingError,
//     refreshBotStart,
//   } = useAuthLogic();

//   const isAuthenticated = useMemo(() => !!user, [user]);

//   // Handle redirects based on authentication state
//   useEffect(() => {
//     // If still loading, don't redirect yet
//     if (loading) return;

//     // If user is not authenticated and trying to access protected route
//     if (!isAuthenticated && process.env.NODE_ENV === "development") {
//       console.log("Not authenticated - redirecting to login");
//       router.push("/login");
//       return;
//     }

//     // If user is authenticated and trying to access auth routes (login/signup)
//     if (isAuthenticated) {
//       console.log("Already authenticated - redirecting to rooms");
//       router.push(pathname?.toString() || "/rooms");
//       return;
//     }
//   }, [isAuthenticated, pathname, router, loading]);

//   // Show loading spinner while authenticating
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background w-screen flex items-center flex-col justify-center">
//         <Logo />
//         <Spinner className="animate-spin rounded-full h-8 w-8 border-primary" />
//         <span className="text-sm">{t("loading")}</span>
//       </div>
//     );
//   }

//   if (
//     botStartRequired ||
//     (process.env.NODE_ENV === "production" && !isAuthenticated)
//   ) {
//     const handleStartBot = () => {
//       toast.info(t("openingTelegram"));
//       const url = startBotUrl || "'https://t.me/mella_bingo_bot?start=welcome'";
//       if (typeof window === "undefined") {
//         return;
//       }
//       const webApp = (window as any)?.Telegram?.WebApp;
//       if (!webApp?.openTelegramLink) {
//         return;
//       }
//     if (webApp?.openTelegramLink && url) {
//         webApp.openTelegramLink(url);
//       } else if (url) {
//         window.open(url, "_blank", "noopener,noreferrer");
//       }
//     };

//     return (
//       <div className="min-h-screen fixed inset-0 bg-background w-screen z-1000 flex items-center flex-col justify-center gap-4 px-6 text-center">
//         <Logo />
//         <h2 className="text-lg font-bold">{t("startBotTitle")}</h2>
//         <p className="text-sm text-muted-foreground">{t("startBotDesc")}</p>
//         {onboardingError && (
//           <p className="text-xs text-red-400">{onboardingError}</p>
//         )}
//         <div className="flex w-full justify-center items-center gap-3">
//           <button
//             onClick={refreshBotStart}
//             disabled={onboardingLoading}
//             className="px-4 py-2 rounded-lg bg-primary w-2/3 text-primary-foreground text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Join Now
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         isAuthenticated,
//         error,
//         botStartRequired,
//         startBotUrl,
//         onboardingLoading,
//         onboardingError,
//         refreshBotStart,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);
