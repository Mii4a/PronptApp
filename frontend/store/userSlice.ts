import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

const initialState: UserState = {
  id: '',
  name: '',
  email: '',
  bio: '',
  avatar: '',
  emailNotifications: false,
  pushNotifications: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    updateUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUser, updateUser } = userSlice.actions;
export default userSlice.reducer; 