import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    data: "no",
  },
  reducers: {
    changeAuth(state, action) {
      state.data = action.payload;
      AsyncStorage.setItem("isLoggedIn", action.payload);
    },
    setInitialAuth(state, action) {
      state.data = action.payload;
    },
  },
});

// Function to initialize the language from AsyncStorage
export const initializeAuth = async (dispatch) => {
  try {
    const useLoggedIn = await AsyncStorage.getItem("isLoggedIn");
    if (useLoggedIn) {
      dispatch(setInitialAuth(useLoggedIn));
    }
  } catch (error) {
    console.error("Error loading language:", error);
  }
};

export const { changeAuth, setInitialAuth } = AuthSlice.actions;
export default AuthSlice.reducer;
