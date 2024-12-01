import { configureStore } from "@reduxjs/toolkit";
import LanguageReducer from "./LanguageSlice";
import LocationReducer from "./LocationSlice";
import CommentBottomSheetReducer from "./CommentBottomSheetSlice";
import FollowersBottomSheetReducer from "./FollowersBottomSheetSlice";

const store = configureStore({
  reducer: {
    language: LanguageReducer,
    location: LocationReducer,
    commentBottomSheet: CommentBottomSheetReducer,
    followersBottomSheet: FollowersBottomSheetReducer,
  },
});

export default store;
