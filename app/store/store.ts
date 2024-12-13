import { configureStore } from "@reduxjs/toolkit";
import LanguageReducer from "./LanguageSlice";
import LocationReducer from "./LocationSlice";
import CommentBottomSheetReducer from "./CommentBottomSheetSlice";
import FollowersBottomSheetReducer from "./FollowersBottomSheetSlice";
import AuthReducer from "./AuthSlice";
import TokenReducer from "./TokenSlice";

const store = configureStore({
  reducer: {
    language: LanguageReducer,
    location: LocationReducer,
    commentBottomSheet: CommentBottomSheetReducer,
    followersBottomSheet: FollowersBottomSheetReducer,
    auth: AuthReducer,
    token: TokenReducer,
  },
});

export default store;
