import { configureStore } from "@reduxjs/toolkit";
import LanguageReducer from "./LanguageSlice";
import LocationReducer from "./LocationSlice";

const store = configureStore({
  reducer: {
    language: LanguageReducer,
    location: LocationReducer,
  },
});

export default store;
