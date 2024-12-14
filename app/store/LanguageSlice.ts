import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LanguageSlice = createSlice({
  name: "language",
  initialState: {
    data: "english",
  },
  reducers: {
    changeLanguage(state, action) {
      state.data = action.payload;
      AsyncStorage.setItem("appLanguage", action.payload);
    },
    setInitialLanguage(state, action) {
      state.data = action.payload;
    },
  },
});

// Function to initialize the language from AsyncStorage
export const initializeLanguage = async (dispatch) => {
  try {
    const savedLanguage = await AsyncStorage.getItem("appLanguage");
    if (savedLanguage) {
      dispatch(setInitialLanguage(savedLanguage));
    }
  } catch (error) {
    console.error("Error loading language:", error);
  }
};

export const { changeLanguage, setInitialLanguage } = LanguageSlice.actions;
export default LanguageSlice.reducer;
