import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

export interface WhaleActivity {
  id: string
  address: string
  type: 'transfer' | 'swap' | 'liquidity' | 'mint' | 'other'
  amount: number
  token: string
  tokenSymbol: string
  timestamp: string
  transactionHash: string
}

export interface WhaleWallet {
  address: string
  label?: string
  tags: string[]
  lastActive: string
  totalValue: number
  recentActivities: WhaleActivity[]
}

interface WhaleState {
  wallets: WhaleWallet[]
  recentActivities: WhaleActivity[]
  loading: boolean
  error: string | null
}

const initialState: WhaleState = {
  wallets: [],
  recentActivities: [],
  loading: false,
  error: null,
}

export const fetchTopWhales = createAsyncThunk('whale/fetchTop', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/whales/top')
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch top whales')
  }
})

export const fetchRecentActivities = createAsyncThunk(
  'whale/fetchActivities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/whales/activities')
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch whale activities')
    }
  }
)

export const trackWallet = createAsyncThunk(
  'whale/trackWallet',
  async (address: string, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/whales/track', { address })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to track wallet')
    }
  }
)

const whaleSlice = createSlice({
  name: 'whale',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Top Whales
      .addCase(fetchTopWhales.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTopWhales.fulfilled, (state, action: PayloadAction<{ wallets: WhaleWallet[] }>) => {
        state.loading = false
        state.wallets = action.payload.wallets
      })
      .addCase(fetchTopWhales.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch Activities
      .addCase(fetchRecentActivities.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchRecentActivities.fulfilled,
        (state, action: PayloadAction<{ activities: WhaleActivity[] }>) => {
          state.loading = false
          state.recentActivities = action.payload.activities
        }
      )
      .addCase(fetchRecentActivities.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Track Wallet
      .addCase(trackWallet.fulfilled, (state, action: PayloadAction<{ wallet: WhaleWallet }>) => {
        const exists = state.wallets.some((wallet) => wallet.address === action.payload.wallet.address)
        if (!exists) {
          state.wallets.push(action.payload.wallet)
        }
      })
  },
})

export const { clearError } = whaleSlice.actions
export default whaleSlice.reducer 