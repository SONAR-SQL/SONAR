export interface WhaleWallet {
  id: string;
  address: string;
  tags?: string[];
  transactions: number;
  totalValue: number;
  lastActive: string;
  recentActivities?: WhaleActivity[];
}

export interface WhaleActivity {
  id: string;
  address: string;
  type: 'transfer' | 'swap';
  amount: number;
  token: string;
  tokenSymbol: string;
  transactionHash: string;
  timestamp: string;
  metadata?: {
    blockExplorer?: string;
    [key: string]: any;
  };
}

export interface TopWhalesResponse {
  success: boolean;
  wallets: WhaleWallet[];
}

export interface RecentActivitiesResponse {
  success: boolean;
  activities: WhaleActivity[];
}

export interface WalletDetailResponse {
  success: boolean;
  wallet: WhaleWallet;
}

export interface TrackedWalletsResponse {
  success: boolean;
  wallets: WhaleWallet[];
}

export interface TrackWalletRequest {
  address: string;
}

export interface TrackWalletResponse {
  success: boolean;
  wallet: WhaleWallet;
} 