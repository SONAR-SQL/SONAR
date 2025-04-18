import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { Token, MarketOverview, TokenSearchResult, WatchlistOperation } from '../../types/marketTypes'

export interface TokenData {
  symbol: string
  name: string
  address: string
  price: number
  priceChange24h: number
  volume24h: number
  marketCap: number
  whaleInterest: number
  riskScore: number
}

export interface MarketTrend {
  id: string
  type: 'bullish' | 'bearish' | 'neutral'
  confidence: number
  title: string
  description: string
  relatedTokens: string[]
  timestamp: string
}

interface MarketState {
  topVolumeTokens: Token[]
  topGainers: Token[]
  topLosers: Token[]
  whaleInterestTokens: Token[]
  watchlist: Token[]
  searchResults: Token[]
  selectedToken: Token | null
  loading: boolean
  error: string | null
}

const initialState: MarketState = {
  topVolumeTokens: [],
  topGainers: [],
  topLosers: [],
  whaleInterestTokens: [],
  watchlist: [],
  searchResults: [],
  selectedToken: null,
  loading: false,
  error: null,
}

export const fetchMarketOverview = createAsyncThunk(
  'market/fetchOverview',
  async (_: void, { rejectWithValue }: { rejectWithValue: any }) => {
    try {
      const response = await axios.get<MarketOverview>('/api/market/overview')
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch market overview')
    }
  }
)

export const searchTokens = createAsyncThunk(
  'market/searchTokens',
  async (query: string, { rejectWithValue }: { rejectWithValue: any }) => {
    try {
      const response = await axios.get<TokenSearchResult>(`/api/market/search?query=${encodeURIComponent(query)}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Search failed')
    }
  }
)

export const fetchWatchlist = createAsyncThunk(
  'market/fetchWatchlist',
  async (_: void, { rejectWithValue }: { rejectWithValue: any }) => {
    try {
      const response = await axios.get<{ tokens: Token[] }>('/api/market/watchlist')
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch watchlist')
    }
  }
)

export const addToWatchlist = createAsyncThunk(
  'market/addToWatchlist',
  async (tokenAddress: string, { rejectWithValue }: { rejectWithValue: any }) => {
    try {
      const response = await axios.post<WatchlistOperation>('/api/market/watchlist/add', {
        tokenAddress,
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to watchlist')
    }
  }
)

export const removeFromWatchlist = createAsyncThunk(
  'market/removeFromWatchlist',
  async (tokenAddress: string, { rejectWithValue }: { rejectWithValue: any }) => {
    try {
      const response = await axios.post<WatchlistOperation>('/api/market/watchlist/remove', {
        tokenAddress,
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from watchlist')
    }
  }
)

export const fetchTokenDetails = createAsyncThunk(
  'market/fetchTokenDetails',
  async (tokenAddress: string, { rejectWithValue }: { rejectWithValue: any }) => {
    try {
      const response = await axios.get<{ token: Token }>(`/api/market/token/${tokenAddress}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch token details')
    }
  }
)

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    clearSearchResults: (state: MarketState) => {
      state.searchResults = []
    },
    clearError: (state: MarketState) => {
      state.error = null
    },
    setSelectedToken: (state: MarketState, action: PayloadAction<Token | null>) => {
      state.selectedToken = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Market Overview
      .addCase(fetchMarketOverview.pending, (state: MarketState) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMarketOverview.fulfilled, (state: MarketState, action: PayloadAction<MarketOverview>) => {
        state.loading = false
        state.topVolumeTokens = action.payload.topVolumeTokens
        state.topGainers = action.payload.topGainers
        state.topLosers = action.payload.topLosers
        state.whaleInterestTokens = action.payload.whaleInterestTokens
      })
      .addCase(fetchMarketOverview.rejected, (state: MarketState, action: any) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Search Tokens
      .addCase(searchTokens.pending, (state: MarketState) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchTokens.fulfilled, (state: MarketState, action: PayloadAction<TokenSearchResult>) => {
        state.loading = false
        state.searchResults = action.payload.tokens
      })
      .addCase(searchTokens.rejected, (state: MarketState, action: any) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch Watchlist
      .addCase(fetchWatchlist.fulfilled, (state: MarketState, action: PayloadAction<{ tokens: Token[] }>) => {
        state.watchlist = action.payload.tokens
      })

      // Add to Watchlist
      .addCase(addToWatchlist.fulfilled, (state: MarketState, action: PayloadAction<WatchlistOperation>) => {
        if (action.payload.success) {
          // We don't have the full token object here, so trigger a refresh
          // In a real app, you might want to include the full token details in the response
          // For now, just show a success message
        }
      })

      // Remove from Watchlist
      .addCase(removeFromWatchlist.fulfilled, (state: MarketState, action: PayloadAction<WatchlistOperation>) => {
        if (action.payload.success) {
          // Filter out the removed token
          state.watchlist = state.watchlist.filter(
            (token: Token) => !action.payload.watchlist.includes(token.address)
          )
        }
      })

      // Fetch Token Details
      .addCase(fetchTokenDetails.fulfilled, (state: MarketState, action: PayloadAction<{ token: Token }>) => {
        state.selectedToken = action.payload.token
      })
  },
})

export const { clearSearchResults, clearError, setSelectedToken } = marketSlice.actions
export default marketSlice.reducer 