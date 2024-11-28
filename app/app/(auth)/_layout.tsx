import React from "react";
import { router, Stack } from "expo-router";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RedText from "@/components/RedText";
import { Colors } from "@/constants/Colors";

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="verify" />
      <Stack.Screen
        name="forgot-password"
        options={{
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerLeft: () => {
            return (
              <Pressable onPress={() => router.back()}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={Colors.light.white}
                  />
                  <RedText style={{ color: Colors.light.white }}>Back</RedText>
                </View>
              </Pressable>
            );
          },
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
