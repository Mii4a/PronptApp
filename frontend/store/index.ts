import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import userReducer from './userSlice';
import authReducer from './authSlice';


const store = () => configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
  },
});

export const wrapper = createWrapper(store)

export type AppStore = ReturnType<typeof store>
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch']; 