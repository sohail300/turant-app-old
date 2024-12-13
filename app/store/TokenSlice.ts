import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthSlice = createSlice({
  name: "token",
  initialState: {
    data: "",
  },
  reducers: {
    changeToken(state, action) {
      state.data = action.payload;
      AsyncStorage.setItem("token", action.payload);
    },
    setInitialToken(state, action) {
      state.data = action.payload;
    },
  },
});

export const initializeToken = async (dispatch) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      dispatch(setInitialToken(token));
    }
  } catch (error) {
    console.error("Error loading language:", error);
  }
};

export const { changeToken, setInitialToken } = AuthSlice.actions;
export default AuthSlice.reducer;
