import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  id: "",
  name: "",
  email: "",
  bio: "",
  avatar: "",
  emailNotifications: false,
  pushNotifications: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginUser: (state, action: PayloadAction<AuthState>) => {
      state.isAuthenticated = true;
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.bio = action.payload.bio;
      state.avatar = action.payload.avatar;
      state.emailNotifications = action.payload.emailNotifications;
      state.pushNotifications = action.payload.pushNotifications;
    },
    clearLoginUser: (state) => {
      state.isAuthenticated = true;
      state.id = "";
      state.name = "";
      state.email = "";
      state.bio = "";
      state.avatar = "";
      state.emailNotifications = false;
      state.pushNotifications = false;
    },
  },
});

export const { setLoginUser, clearLoginUser } = authSlice.actions;
export default authSlice.reducer;