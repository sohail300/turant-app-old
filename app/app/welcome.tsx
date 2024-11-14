import { View, Text, Pressable } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { styles } from "@/constants/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const setup = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 32,
        gap: 24,
        backgroundColor: "#fff",
      }}
    >
      <Text
        style={{
          ...styles.Subheading2,
          fontSize: 28,
          lineHeight: 42,
          textAlign: "center",
        }}
      >
        Welcome To Turant
      </Text>

      <View style={{ flex: 1, height: 340, backgroundColor: "#D9D9D9" }}></View>

      <Pressable
        style={styles.buttonContainer}
        onPress={() => router.push("/")}
      >
        <Text style={styles.button}>Get Started</Text>
        <Feather name="arrow-right-circle" size={24} color="#fff" />
      </Pressable>
      <View style={{ paddingBottom: 100 }} />
    </SafeAreaView>
  );
};

export default setup;
