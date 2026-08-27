import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { AuthUser } from '../types/api';

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
};

const stored = localStorage.getItem('chb.auth');
const initial: AuthState = stored
  ? (JSON.parse(stored) as AuthState)
  : { user: null, accessToken: null, refreshToken: null };

const authSlice = createSlice({
  name: 'auth',
  initialState: initial,
  reducers: {
    setSession(state, action: PayloadAction<AuthState>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem('chb.auth', JSON.stringify(state));
    },
    clearSession(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem('chb.auth');
    },
  },
});

export const { setSession, clearSession } = authSlice.actions;

export const store = configureStore({
  reducer: { auth: authSlice.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
