import { createSlice, createAsyncThunk, PayloadAction, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import api from '../../api';
import { Alert, AlertSetting } from '../../types/alertTypes';

interface AlertState {
  alerts: Alert[];
  settings: AlertSetting[];
  loading: boolean;
  error: string | null;
  settingsLoading: boolean;
  settingsError: string | null;
}

const initialState: AlertState = {
  alerts: [],
  settings: [],
  loading: false,
  error: null,
  settingsLoading: false,
  settingsError: null,
};

// Async thunks
export const fetchAlerts = createAsyncThunk(
  'alert/fetchAlerts',
  async (_: void, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      const response = await api.get('/alerts');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch alerts');
    }
  }
);

export const markAlertAsRead = createAsyncThunk(
  'alert/markAsRead',
  async (id: string, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      const response = await api.put(`/alerts/${id}/read`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark alert as read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'alert/markAllAsRead',
  async (_: void, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      const response = await api.put('/alerts/mark-all-read');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all alerts as read');
    }
  }
);

export const fetchAlertSettings = createAsyncThunk(
  'alert/fetchSettings',
  async (_: void, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      const response = await api.get('/alerts/settings');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch alert settings');
    }
  }
);

export const updateAlertSetting = createAsyncThunk(
  'alert/updateSetting',
  async (setting: AlertSetting, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      const response = await api.put(`/alerts/settings/${setting.id}`, setting);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update alert setting');
    }
  }
);

export const createAlertSetting = createAsyncThunk(
  'alert/createSetting',
  async (setting: Omit<AlertSetting, 'id'>, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      const response = await api.post('/alerts/settings', setting);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create alert setting');
    }
  }
);

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    clearAlertErrors: (state: AlertState) => {
      state.error = null;
      state.settingsError = null;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<AlertState>) => {
    builder
      // Fetch alerts
      .addCase(fetchAlerts.pending, (state: AlertState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state: AlertState, action: PayloadAction<Alert[]>) => {
        state.loading = false;
        state.alerts = action.payload;
      })
      .addCase(fetchAlerts.rejected, (state: AlertState, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload as string || 'An error occurred';
      })
      
      // Mark alert as read
      .addCase(markAlertAsRead.fulfilled, (state: AlertState, action: PayloadAction<string>) => {
        const alertId = action.payload;
        const alert = state.alerts.find((a: Alert) => a.id === alertId);
        if (alert) {
          alert.read = true;
        }
      })
      
      // Mark all alerts as read
      .addCase(markAllAsRead.fulfilled, (state: AlertState) => {
        state.alerts = state.alerts.map((alert: Alert) => ({
          ...alert,
          read: true
        }));
      })
      
      // Fetch alert settings
      .addCase(fetchAlertSettings.pending, (state: AlertState) => {
        state.settingsLoading = true;
        state.settingsError = null;
      })
      .addCase(fetchAlertSettings.fulfilled, (state: AlertState, action: PayloadAction<AlertSetting[]>) => {
        state.settingsLoading = false;
        state.settings = action.payload;
      })
      .addCase(fetchAlertSettings.rejected, (state: AlertState, action: PayloadAction<any>) => {
        state.settingsLoading = false;
        state.settingsError = action.payload as string || 'An error occurred';
      })
      
      // Update alert setting
      .addCase(updateAlertSetting.fulfilled, (state: AlertState, action: PayloadAction<AlertSetting>) => {
        const updatedSetting = action.payload;
        const index = state.settings.findIndex((s: AlertSetting) => s.id === updatedSetting.id);
        if (index !== -1) {
          state.settings[index] = updatedSetting;
        }
      })
      
      // Create alert setting
      .addCase(createAlertSetting.fulfilled, (state: AlertState, action: PayloadAction<AlertSetting>) => {
        state.settings.push(action.payload);
      });
  },
});

export const { clearAlertErrors } = alertSlice.actions;
export default alertSlice.reducer; 