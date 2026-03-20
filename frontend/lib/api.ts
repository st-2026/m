import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { HomeSnapshot } from "@/types/home";
import type {
  Transaction,
  TransactionType,
  WalletData,
  Withdrawal,
  WithdrawalEligibility,
} from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

function getAuthToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("mella_token") || "";
}

export async function verifyTelegramAndGetToken(
  initData: string,
): Promise<string> {
  const res = await fetch(`${API_BASE}/auth/telegram/verify-init-data`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ initData }),
  });

  if (!res.ok) {
    throw new Error("telegram_auth_failed");
  }

  const json = (await res.json()) as { token: string };
  return json.token;
}

export async function signupLocalDev(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  referralCode?: string;
}): Promise<string> {
  const res = await fetch(`${API_BASE}/auth/local/signup`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error("local_signup_failed");
  }

  const json = (await res.json()) as { token: string };
  return json.token;
}

export async function loginLocalDev(input: {
  email: string;
  password: string;
}): Promise<string> {
  const res = await fetch(`${API_BASE}/auth/local/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error("local_login_failed");
  }

  const json = (await res.json()) as { token: string };
  return json.token;
}

export async function fetchHomeSnapshot(token: string): Promise<HomeSnapshot> {
  const res = await fetch(`${API_BASE}/mini/home`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("home_fetch_failed");
  }

  const json = (await res.json()) as HomeSnapshot & { ok: boolean };
  return {
    version: json.version,
    generatedAt: json.generatedAt,
    home: json.home,
  };
}

export function getApiBase() {
  return API_BASE;
}

export type RoomItem = {
  id: string;
  name: string;
  description: string | null;
  boardPriceCents: number;
  price: string;
  color: string;
  icon: string | null;
  minPlayers: number | null;
  maxPlayers: number | null;
  isLive: boolean;
};

export async function fetchRooms(
  token: string,
): Promise<RoomItem[]> {
  const res = await fetch(`${API_BASE}/rooms`, {
    method: "GET",
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("rooms_fetch_failed");
  }

  const json = (await res.json()) as { rooms: RoomItem[] };
  return json.rooms;
}

export type WalletSummary = {
  currency: string;
  balanceCents: number;
  bonusCents: number;
};

export async function fetchWallet(
  token: string,
): Promise<WalletSummary> {
  const res = await fetch(`${API_BASE}/me/wallet`, {
    method: "GET",
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("wallet_fetch_failed");
  }

  const json = (await res.json()) as { ok: boolean; wallet: WalletSummary };
  return json.wallet;
}

export type ViewerResult = {
  outcome: "won" | "lost" | "draw";
  targetPath: string;
  winnerUserId: string | null;
  winnerName: string;
  reason: "winner_declared" | "numbers_exhausted" | "stopped_by_operator";
};

export type BoardSelectionState = {
  sessionId: string;
  roomId: string;
  roomName: string;
  status: string;
  startsInSec: number;
  stakeCents: number;
  stakeLabel: string;
  viewerResult: ViewerResult | null;
};

export async function fetchBoardSelectionState(
  token: string,
  sessionId: string,
): Promise<BoardSelectionState> {
  const res = await fetch(`${API_BASE}/sessions/${sessionId}/board-selection`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("board_selection_fetch_failed");
  }

  const json = (await res.json()) as {
    ok: boolean;
    state: BoardSelectionState;
  };
  return json.state;
}

export async function resolveActiveSessionByRoomName(
  token: string,
  roomName: string,
): Promise<BoardSelectionState> {
  const res = await fetch(`${API_BASE}/sessions/resolve-active`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ roomName }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("resolve_active_session_failed");
  }

  const json = (await res.json()) as {
    ok: boolean;
    state: BoardSelectionState;
  };

  return json.state;
}

export async function resolveActiveSessionByRoomId(
  token: string,
  roomId: string,
): Promise<BoardSelectionState> {
  const res = await fetch(`${API_BASE}/rooms/${roomId}/active-session`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("resolve_active_session_failed");
  }

  const json = (await res.json()) as {
    ok: boolean;
    state: BoardSelectionState;
  };

  return json.state;
}

export async function buyBoard(
  token: string,
  input: { sessionId: string; quantity: number; idempotencyKey: string },
) {
  const res = await fetch(`${API_BASE}/sessions/boards/buy`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error("board_buy_failed");
  }

  return (await res.json()) as {
    ok: boolean;
    boards: Array<{
      id: string;
      boardNo: number;
      boardMatrix: number[][];
    }>;
  };
}

export async function leaveSessionBeforeStart(
  token: string,
  sessionId: string,
) {
  const res = await fetch(`${API_BASE}/sessions/${sessionId}/leave`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("session_leave_failed");
  }

  return (await res.json()) as {
    ok: boolean;
    removedBoards: number;
    status: string;
    stakeCents: number;
    stakeLabel: string;
    playersCount: number;
    boardsCount: number;
    potCents: number;
    potLabel: string;
  };
}

export type SessionState = {
  id: string;
  roomId: string;
  status: string;
  currentSeq: number;
  currentNumber: number | null;
  winnerUserId: string | null;
  recentCalls: Array<{ seq: number; number: number }>;
  playersCount?: number;
  boardsCount?: number;
  potCents?: number;
  stakeCents?: number;
  potLabel?: string;
  stakeLabel?: string;
  viewerResult: ViewerResult | null;
};

export async function fetchSessionState(
  token: string,
  sessionId: string,
): Promise<SessionState> {
  const res = await fetch(`${API_BASE}/sessions/${sessionId}/state`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("session_state_fetch_failed");
  }

  const json = (await res.json()) as {
    ok: boolean;
    state: SessionState;
  };

  return json.state;
}

export type WinningPatternInput = {
  type: "row" | "column" | "diagonal" | "full_house";
  index?: number;
  diagonal?: "main" | "anti";
};

export async function submitBingoClaim(
  token: string,
  input: {
    sessionId: string;
    boardId: string;
    markedCells: number[];
    winningPattern: WinningPatternInput;
    idempotencyKey: string;
    clientLastSeq: number;
  },
) {
  const res = await fetch(`${API_BASE}/sessions/bingo-claims`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error("bingo_claim_failed");
  }

  return (await res.json()) as {
    ok: boolean;
    replay: boolean;
    claim: {
      id: string;
      status: "accepted" | "rejected";
      rejectionReason: string | null;
    };
    winner: {
      sessionId: string;
      userId: string;
    } | null;
  };
}

export async function fetchTransactions(
  token: string,
  tab: string = "all",
): Promise<Transaction[]> {
  const res = await fetch(`${API_BASE}/me/wallet/transactions`, {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("transactions_fetch_failed");
  const json = await res.json();
  const txs = (json.transactions || []).map((ledger: any) => {
    let type: TransactionType = "bonus";
    switch (ledger.entryType) {
      case "deposit":
        type = "deposit";
        break;
      case "withdrawal":
        type = "withdrawal";
        break;
      case "session_win":
        type = "game_win";
        break;
      case "board_purchase":
        type = "game_lost";
        break;
      case "commission":
        type = "referral_commission";
        break;
      case "referral_reward":
        type = "referral_reward";
        break;
    }
    return {
      id: ledger.id,
      type,
      amount: (ledger.amountCents / 100).toFixed(2),
      status: ledger.status === "posted" ? "completed" : "failed",
      description: ledger.metadata?.phone || ledger.entryType,
      createdAt: ledger.createdAt,
    } as Transaction;
  });

  if (tab === "in") return txs.filter((t: any) => parseFloat(String(t.amount)) > 0);
  if (tab === "out") return txs.filter((t: any) => parseFloat(String(t.amount)) < 0);
  return txs;
}

export function useGetWalletQuery(_?: any, options?: { skip?: boolean }) {
  const token = getAuthToken();
  const query = useQuery({
    queryKey: ["wallet"],
    queryFn: () => fetchWallet(token),
    enabled: !options?.skip && !!token,
  });
  return {
    data: query.data
      ? {
          balance: query.data.balanceCents / 100,
          bonus: query.data.bonusCents / 100,
          currency: query.data.currency,
        }
      : undefined,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useGetRoomsQuery(options?: { skip?: boolean }) {
  const token = getAuthToken();
  const query = useQuery({
    queryKey: ["rooms"],
    queryFn: () => fetchRooms(token),
    enabled: !options?.skip && !!token,
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useGetTransactionsQuery(
  tab: string = "all",
  options?: { skip?: boolean },
) {
  const token = getAuthToken();
  const query = useQuery({
    queryKey: ["transactions", tab],
    queryFn: () => fetchTransactions(token, tab),
    enabled: !options?.skip && !!token,
  });
  return { data: query.data, isLoading: query.isLoading, refetch: query.refetch };
}

export function useDepositMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (input: { amount: number }) => {
      const res = await fetch(`${API_BASE}/wallet/deposit`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) throw { data };
      return { ...data, success: data.ok };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const mutate = (input: { amount: number }) => {
    const promise = mutation.mutateAsync(input);
    return Object.assign(promise, { unwrap: () => promise });
  };

  return [mutate, { isLoading: mutation.isPending }] as const;
}

export function useWithdrawMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (input: { amount: number; method: string }) => {
      const res = await fetch(`${API_BASE}/wallet/withdraw`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) throw { data };
      return { ...data, success: data.ok };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const mutate = (input: { amount: number; method: string }) => {
    const promise = mutation.mutateAsync(input);
    return Object.assign(promise, { unwrap: () => promise });
  };

  return [mutate, { isLoading: mutation.isPending }] as const;
}

export function useCreateWithdrawalMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (input: { amount: number; phone: string }) => {
      const res = await fetch(`${API_BASE}/wallet/withdraw`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) throw { data };
      return { ...data, success: data.ok };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
    },
  });

  const mutate = (input: { amount: number; phone: string }) => {
    const promise = mutation.mutateAsync(input);
    return Object.assign(promise, { unwrap: () => promise });
  };

  return [mutate, { isLoading: mutation.isPending }] as const;
}

export function useGetUserWithdrawalsQuery(
  _?: any,
  options?: { skip?: boolean },
) {
  const { data, isLoading } = useGetTransactionsQuery("all", options);
  return {
    data: {
      withdrawals:
        (data
          ?.filter((t) => t.type === "withdrawal")
          .map((t) => ({
            id: t.id,
            amount: t.amount,
            phone: t.description || "",
            status: (t.status === "completed"
              ? "approved"
              : t.status === "rejected"
                ? "rejected"
                : "pending") as Withdrawal["status"],
            rejectionReason: null,
            createdAt: t.createdAt,
          })) as Withdrawal[]) || [],
    },
    isLoading,
  };
}

export function useGetWithdrawalEligibilityQuery(
  _?: any,
  options?: { skip?: boolean },
) {
  const { data: wallet } = useGetWalletQuery(undefined, options);
  return {
    data: {
      eligible: (wallet?.balance || 0) >= 100,
      balance: wallet?.balance || 0,
      minWithdrawalAmount: 100,
      minAccountLeft: 50,
      minDepositRequired: 50,
      gamesRequired: 20,
      gamesPlayed: 10,
      totalDeposit: 50,
      hasPending: false,
    },
    isLoading: false,
  };
}

export function useLogoutMutation() {
  const mutation = useMutation({
    mutationFn: async () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("mella_token");
        localStorage.removeItem("auth_token");
      }
      return { success: true };
    },
  });

  const mutate = (input: any) => {
    const promise = mutation.mutateAsync(input);
    return Object.assign(promise, { unwrap: () => promise });
  };

  return [mutate, { isLoading: mutation.isPending }] as const;
}

export function useGetGameStatsQuery(_?: any, options?: { skip?: boolean }) {
  const token = getAuthToken();
  const query = useQuery({
    queryKey: ["game-stats"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/me/dashboard`, {
        headers: { authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("stats_fetch_failed");
      const json = await res.json();
      return {
        played: json.dashboard?.totalTransactions || 0,
        won: Math.floor((json.dashboard?.winsCents || 0) / 1000), // Mocking win count from cents
      };
    },
    enabled: !options?.skip && !!token,
  });
  return { data: query.data, isLoading: query.isLoading };
}

export function useApproveDepositMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (input: {
      amount: number;
      sms_content: string;
      user_id: string;
      promoCode?: string;
    }) => {
      const res = await fetch(`${API_BASE}/payments/submit`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) throw { data };
      return { ...data, success: data.ok || data.success };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const mutate = (input: any) => {
    const promise = mutation.mutateAsync(input);
    return Object.assign(promise, { unwrap: () => promise });
  };

  return [mutate, { isLoading: mutation.isPending }] as const;
}

export function useLoginLocalMutation() {
  const mutation = useMutation({
    mutationFn: (input: { email: string; password: string }) =>
      loginLocalDev(input),
  });
  return mutation;
}

export function useSignupLocalMutation() {
  const mutation = useMutation({
    mutationFn: (input: {
      email: string;
      password: string;
      firstName?: string;
      referralCode?: string;
    }) => signupLocalDev(input),
  });
  return mutation;
}

export function useVerifyTelegramMutation() {
  const mutation = useMutation({
    mutationFn: (initData: string) => verifyTelegramAndGetToken(initData),
  });
  return mutation;
}

