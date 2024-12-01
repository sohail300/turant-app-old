import { createSlice } from "@reduxjs/toolkit";

export const CommentBottomSheetSlice = createSlice({
  name: "comment",
  initialState: {
    data: false,
  },
  reducers: {
    changeBottomSheetState(state, action) {
      state.data = action.payload;
    },
  },
});

export const { changeBottomSheetState } = CommentBottomSheetSlice.actions;
export default CommentBottomSheetSlice.reducer;
