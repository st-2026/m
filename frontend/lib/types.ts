export type TransactionType =
  | "deposit"
  | "withdrawal"
  | "game_win"
  | "game_lost"
  | "game_fee"
  | "referral_reward"
  | "referral_commission"
  | "welcome_bonus"
  | "bonus";

export type TransactionStatus =
  | "pending"
  | "completed"
  | "approved"
  | "failed"
  | "rejected";

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: string | number;
  status: TransactionStatus;
  description: string | null;
  createdAt: string;
};

export type WithdrawalStatus = "pending" | "approved" | "rejected";

export type Withdrawal = {
  id: string;
  amount: string | number;
  phone: string;
  status: WithdrawalStatus;
  rejectionReason: string | null;
  createdAt: string;
};

export type WalletData = {
  balance: number;
  bonus: number;
  currency: string;
};

export type WithdrawalEligibility = {
  eligible: boolean;
  balance: number;
  minWithdrawalAmount: number;
  minAccountLeft: number;
  minDepositRequired: number;
  gamesRequired: number;
  gamesPlayed: number;
  totalDeposit: number;
  hasPending: boolean;
};
