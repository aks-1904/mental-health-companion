import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  verified: boolean;
}

const initialState: UserState = {
  verified: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state = action.payload;
    },
    setVerifiedUser: (state, action: PayloadAction<boolean>) => {
      state.verified = action.payload;
    },
  },
});

export const { setUser, setVerifiedUser } = userSlice.actions;
export default userSlice.reducer;
