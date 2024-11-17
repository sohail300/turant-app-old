import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";

const search = () => {
  const [isAppSetup, setIsAppSetup] = useState("");
  const location = useSelector((state) => state.location.data);
  console.log(location);

  useEffect(() => {
    async function getIsAppSetup() {
      try {
        const value = await AsyncStorage.getItem("isAppSetup");
        setIsAppSetup(value);
      } catch (error) {
        console.error("Error getting isAppSetup:", error);
      }
    }
    getIsAppSetup();
  }, []);

  return (
    <SafeAreaView>
      <Pressable
        style={{
          backgroundColor: "#FF747666",
          padding: 40,
          marginTop: 40,
        }}
        onPress={() => AsyncStorage.setItem("isAppSetup", "false")}
      >
        <Text style={{ textAlign: "center", color: "#000" }}>Set</Text>
      </Pressable>
      <Text>{isAppSetup}</Text>
      <Text>{location.countryState}</Text>
      <Text>{location.city}</Text>
    </SafeAreaView>
  );
};

export default search;
