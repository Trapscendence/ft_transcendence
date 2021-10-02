import { createSlice } from "@reduxjs/toolkit";

const sessionSlice = createSlice({
  name: "session",
  initialState: {
    tmpId: "",
  },
  reducers: {
    signIn: (state, action) => {
      return { ...state };
    },
    signInSuccess(state, action) {
      return {
        ...state,
        loading: false,
      };
    },
  },
});

export const { signIn } = sessionSlice.actions;
export default sessionSlice.reducer;
