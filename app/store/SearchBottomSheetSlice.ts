import { createSlice } from "@reduxjs/toolkit";

export const SearchBottomSheetSlice = createSlice({
  name: "search",
  initialState: {
    data: false,
  },
  reducers: {
    changeBottomSheetState(state, action) {
      state.data = action.payload;
    },
  },
});

export const { changeBottomSheetState } = SearchBottomSheetSlice.actions;
export default SearchBottomSheetSlice.reducer;
