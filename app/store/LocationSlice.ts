import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

export const LocationSlice = createSlice({
  name: "location",
  initialState: {
    data: {
      countryState: 'Bihar',
      city: 'Motihari'
    },
  },
  reducers: {
    changeLocation(state, action) {
      state.data = action.payload;
      AsyncStorage.setItem("state", action.payload.countryState);
      AsyncStorage.setItem("city", action.payload.city);
      console.log(action.payload);
    },
    initialiseLocation(state, action) {
      state.data = action.payload;
    },
  },
});

// Function to initialize the location from AsyncStorage
export const initializeLocation = async (dispatch) => {
  try {
    const savedState = await AsyncStorage.getItem("state");
    const savedCity = await AsyncStorage.getItem("city");
    if (savedState && savedCity) {
      const savedLocation = {
        countryState: savedState,
        city: savedCity,
      };
      dispatch(initialiseLocation(savedLocation));
    }
  } catch (error) {
    console.error("Error loading location:", error);
  }
};

export const { changeLocation, initialiseLocation } = LocationSlice.actions;
export default LocationSlice.reducer;
