import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

export interface Alert {
  id: string
  type: 'whale_movement' | 'price_change' | 'volume_spike' | 'custom'
  severity: 'low' | 'medium' | 'high'
  title: string
  description: string
  token?: string
  tokenSymbol?: string
  timestamp: string
  read: boolean
}

export interface AlertSetting {
  id: string
  type: 'whale_movement' | 'price_change' | 'volume_spike' | 'custom'
  enabled: boolean
  minAmount?: number
  threshold?: number
  tokens?: string[]
  customCondition?: string
}

interface AlertState {
  alerts: Alert[]
  settings: AlertSetting[]
  unreadCount: number
  loading: boolean
  error: string | null
}

const initialState: AlertState = {
  alerts: [],
  settings: [],
  unreadCount: 0,
  loading: false,
  error: null,
}

export const fetchAlerts = createAsyncThunk('alert/fetchAlerts', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/alerts')
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch alerts')
  }
})

export const fetchAlertSettings = createAsyncThunk(
  'alert/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/alerts/settings')
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch alert settings')
    }
  }
)

export const updateAlertSetting = createAsyncThunk(
  'alert/updateSetting',
  async (setting: AlertSetting, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/alerts/settings/${setting.id}`, setting)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update alert setting')
    }
  }
)

export const markAlertAsRead = createAsyncThunk(
  'alert/markAsRead',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/alerts/${id}/read`)
      return { id, ...response.data }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark alert as read')
    }
  }
)

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.unshift(action.payload)
      if (!action.payload.read) {
        state.unreadCount += 1
      }
    },
    markAllAsRead: (state) => {
      state.alerts = state.alerts.map((alert) => ({ ...alert, read: true }))
      state.unreadCount = 0
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Alerts
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAlerts.fulfilled, (state, action: PayloadAction<{ alerts: Alert[] }>) => {
        state.loading = false
        state.alerts = action.payload.alerts
        state.unreadCount = action.payload.alerts.filter((alert) => !alert.read).length
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch Alert Settings
      .addCase(fetchAlertSettings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchAlertSettings.fulfilled,
        (state, action: PayloadAction<{ settings: AlertSetting[] }>) => {
          state.loading = false
          state.settings = action.payload.settings
        }
      )
      .addCase(fetchAlertSettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Update Alert Setting
      .addCase(
        updateAlertSetting.fulfilled,
        (state, action: PayloadAction<{ setting: AlertSetting }>) => {
          const index = state.settings.findIndex((s) => s.id === action.payload.setting.id)
          if (index !== -1) {
            state.settings[index] = action.payload.setting
          }
        }
      )
      // Mark Alert as Read
      .addCase(markAlertAsRead.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        const alert = state.alerts.find((a) => a.id === action.payload.id)
        if (alert && !alert.read) {
          alert.read = true
          state.unreadCount -= 1
        }
      })
  },
})

export const { clearError, addAlert, markAllAsRead } = alertSlice.actions
export default alertSlice.reducer 