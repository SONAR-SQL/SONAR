import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import whaleReducer from './slices/whaleSlice'
import alertReducer from './slices/alertSlice'
import marketReducer from './slices/marketSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    whale: whaleReducer,
    alert: alertReducer,
    market: marketReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 