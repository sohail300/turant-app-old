import { createSlice } from "@reduxjs/toolkit";

export const FollowersBottomSheetSlice = createSlice({
  name: "followers",
  initialState: {
    data: false,
  },
  reducers: {
    changeFollowersBottomSheetState(state, action) {
      state.data = action.payload;
    },
  },
});

export const { changeFollowersBottomSheetState } =
  FollowersBottomSheetSlice.actions;
export default FollowersBottomSheetSlice.reducer;
