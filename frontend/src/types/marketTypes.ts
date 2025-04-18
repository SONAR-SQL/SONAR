export interface Token {
  id: string;
  address: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  whaleInterest: number;
  historicalData?: HistoricalDataPoint[];
}

export interface HistoricalDataPoint {
  timestamp: string;
  price: number;
  volume: number;
}

export interface MarketOverview {
  topVolumeTokens: Token[];
  topGainers: Token[];
  topLosers: Token[];
  whaleInterestTokens: Token[];
}

export interface TokenSearchResult {
  tokens: Token[];
}

export interface TokenDetails {
  token: Token;
  priceHistory: HistoricalDataPoint[];
}

export interface WatchlistOperation {
  success: boolean;
  watchlist: string[];
  message?: string;
} 