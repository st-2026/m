"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Crown,
  Flame,
  Gamepad2,
  Gem,
  LayoutGrid,
  Settings,
  Sparkles,
  User,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import type { Socket } from "socket.io-client";
import { MobileHeader } from "@/components/mobile-header";
import { BalanceCard } from "@/components/balance-card";
import { GameCard } from "@/components/game-card";

import {
  fetchRooms,
  fetchWallet,
  loginLocalDev,
  signupLocalDev,
  verifyTelegramAndGetToken,
  type RoomItem,
  type WalletSummary,
} from "@/lib/api";
import { closeSocket, connectSocket } from "@/lib/socket";
import { getTelegramInitData, initTelegramWebApp } from "@/lib/telegram";

type LoadingState = "boot" | "ready" | "error";
type DevAuthMode = "login" | "signup";

const FALLBACK_TOKEN_KEY = "mella_token";

function tabIcon(key: string) {
  if (key === "play") return <Gamepad2 size={18} />;
  if (key === "wallet") return <Wallet size={18} />;
  if (key === "profile") return <User size={18} />;
  return <Settings size={18} />;
}

function centsToLabel(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function HomeScreen() {
  const router = useRouter();
  const [state, setState] = useState<LoadingState>("boot");
  const [showDevAuth, setShowDevAuth] = useState(false);
  const [devAuthMode, setDevAuthMode] = useState<DevAuthMode>("login");
  const [devEmail, setDevEmail] = useState("");
  const [devPassword, setDevPassword] = useState("");
  const [devFirstName, setDevFirstName] = useState("");
  const [devReferralCode, setDevReferralCode] = useState("DEVAGENT");
  const [error, setError] = useState<string>("");

  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [wallet, setWallet] = useState<WalletSummary | null>(null);

  async function loadData(token: string) {
    const [roomsData, walletData] = await Promise.all([
      fetchRooms(token),
      fetchWallet(token),
    ]);
    return { roomsData, walletData };
  }

  useEffect(() => {
    let alive = true;
    let socket: Socket | null = null;

    async function boot() {
      try {
        initTelegramWebApp();

        const initData = getTelegramInitData();
        const stored =
          typeof window !== "undefined"
            ? localStorage.getItem(FALLBACK_TOKEN_KEY)
            : null;

        if (!initData && !stored) {
          setShowDevAuth(true);
          setState("error");
          setError("local_auth_required");
          return;
        }

        const token = initData
          ? await verifyTelegramAndGetToken(initData)
          : stored || "";

        if (!token) {
          throw new Error("missing_auth_token");
        }

        localStorage.setItem(FALLBACK_TOKEN_KEY, token);

        const { roomsData, walletData } = await loadData(token);
        if (!alive) return;

        setRooms(roomsData);
        setWallet(walletData);
        setState("ready");

        socket = connectSocket(token);
      } catch (err) {
        if (!alive) return;
        if (err instanceof Error && err.message === "missing_auth_token") {
          setShowDevAuth(true);
        }
        setState("error");
        setError(err instanceof Error ? err.message : "load_failed");
      }
    }

    void boot();

    return () => {
      alive = false;
      if (socket) {
        socket.removeAllListeners();
      }
      closeSocket();
    };
  }, []);

  function openRoom(room: RoomItem) {
    router.push(`/rooms/${room.id}`);
  }

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  if (state === "boot") {
    return (
      <main className="min-h-screen bg-background p-4 text-foreground">
        <div className="relative mx-auto mt-40 max-w-md text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
            Mella Bingo
          </p>
          <p className="mt-3 text-lg font-semibold">Loading your Mini App...</p>
        </div>
      </main>
    );
  }

  if (state === "error") {
    if (showDevAuth) {
      return (
        <main className="min-h-screen bg-background p-4 text-foreground">
          <div className="relative mx-auto mt-20 max-w-md rounded-2xl border border-cyan-400/30 bg-muted/90 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/90">
              Local Dev Mode
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              {devAuthMode === "login" ? "Login" : "Sign Up"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Use email/password to test end-to-end without Telegram bot setup.
            </p>

            <form
              className="mt-4 space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                setError("");

                try {
                  const token =
                    devAuthMode === "login"
                      ? await loginLocalDev({
                          email: devEmail,
                          password: devPassword,
                        })
                      : await signupLocalDev({
                          email: devEmail,
                          password: devPassword,
                          firstName: devFirstName || undefined,
                          referralCode: devReferralCode || undefined,
                        });

                  localStorage.setItem(FALLBACK_TOKEN_KEY, token);
                  const { roomsData, walletData } = await loadData(token);
                  setRooms(roomsData);
                  setWallet(walletData);
                  setState("ready");
                  setShowDevAuth(false);
                } catch {
                  setError(
                    devAuthMode === "login"
                      ? "Local login failed. Check credentials or enable LOCAL_DEV_AUTH_ENABLED."
                      : "Local signup failed. Email may already exist.",
                  );
                }
              }}
            >
              <input
                value={devEmail}
                onChange={(e) => setDevEmail(e.target.value)}
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
              />
              <input
                value={devPassword}
                onChange={(e) => setDevPassword(e.target.value)}
                type="password"
                required
                minLength={6}
                placeholder="password"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
              />
              {devAuthMode === "signup" ? (
                <>
                  <input
                    value={devFirstName}
                    onChange={(e) => setDevFirstName(e.target.value)}
                    type="text"
                    placeholder="first name (optional)"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
                  />
                  <input
                    value={devReferralCode}
                    onChange={(e) =>
                      setDevReferralCode(e.target.value.toUpperCase())
                    }
                    type="text"
                    placeholder="referral code (e.g. DEVAGENT)"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
                  />
                </>
              ) : null}

              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold tracking-[0.1em] text-primary-foreground"
              >
                {devAuthMode === "login" ? "LOGIN" : "SIGN UP"}
              </button>
            </form>

            <button
              className="mt-3 text-xs text-primary underline"
              onClick={() =>
                setDevAuthMode((prev) =>
                  prev === "login" ? "signup" : "login",
                )
              }
            >
              {devAuthMode === "login"
                ? "No account? Create one"
                : "Already have an account? Login"}
            </button>

            {error ? (
              <p className="mt-2 text-xs text-destructive">{error}</p>
            ) : null}
          </div>
        </main>
      );
    }

    return (
      <main className="min-h-screen bg-background p-4 text-foreground">
        <div className="relative mx-auto mt-28 max-w-md rounded-2xl border border-destructive/30 bg-destructive/10 p-6">
          <p className="text-base font-semibold">Could not load home screen</p>
          <p className="mt-2 text-sm text-destructive">
            {error || "Unknown error"}
          </p>
        </div>
      </main>
    );
  }

  const balanceLabel = wallet ? centsToLabel(wallet.balanceCents) : "0.00";
  const currency = wallet?.currency ?? "ETB";

  return (
    <div className="bg-background min-h-svh w-full h-screen max-h-screen overflow-y-auto custom-scrollbar transition-colors duration-500">
      {/* Dynamic Patterned Background */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none select-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, var(--foreground) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="text-foreground text-[10vw] font-black break-all whitespace-pre-wrap leading-tight p-4 mix-blend-overlay">
          {Array.from({ length: 120 }).map((_, idx) => (
            <span key={idx} className="opacity-10 mr-4">
              M-Bingo
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-[430px] mx-auto flex flex-col pb-24">
        <MobileHeader />

        <BalanceCard balance={balanceLabel} currency={currency} />

        <div className="px-4 hidden mt-4">
          <button className="w-full bg-primary/10 border-primary/20 hover:bg-primary/20 transition-all border py-2.5 rounded-2xl text-primary font-black tracking-widest  shadow-xl shadow-primary/5 active:scale-95 group">
            <span className="flex items-center justify-center gap-2">
              <span className="text-lg"></span> instructions
            </span>
          </button>
        </div>

        <button
          className="flex justify-center border border-blue-600 px-4 mx-4 py-2 rounded-[8px] items-center gap-3 mt-6 text-muted-foreground hover:text-primary transition-colors text-xs font-black uppercase tracking-widest active:scale-95"
          onClick={() => setIsInviteModalOpen(true)}
        >
          <Users size={16} className="text-primary" />
          <span>invite</span>
        </button>

        {/* Game Grid Container */}
        <div className="px-4 mt-8 flex items-center justify-between">
          <h2 className="text-sm font-black capitalize tracking-[0.2em] text-foreground/40 flex items-center gap-2">
            <Zap size={14} className="text-primary" /> available rooms
          </h2>
          <span className="h-px flex-1 bg-linear-to-r from-primary/20 to-transparent ml-4" />
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 mt-2">
          {rooms.length === 0 ? (
            <div className="col-span-2 py-20 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                <LayoutGrid className="text-primary/40" />
              </div>
              <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">
                No rooms
              </p>
            </div>
          ) : (
            rooms.map((room) => (
              <div key={room.id} onClick={() => openRoom(room)}>
                <GameCard
                  name={room.name}
                  price={room.price}
                  color={room.color}
                  id={room.id}
                  canAfford={
                    wallet ? wallet.balanceCents >= room.boardPriceCents : true
                  }
                  isLive={room.isLive}
                />
              </div>
            ))
          )}
        </div>

        {/* Extra Bottom Padding for Nav */}
        <div className="h-4" />
      </div>
    </div>
  );
}
