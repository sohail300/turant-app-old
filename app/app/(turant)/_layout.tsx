import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import RedText from "@/components/RedText";

const _layout = () => {
  return (
    <Stack
      screenOptions={{
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
                  color={Colors.light.accent}
                />
                <RedText>Back</RedText>
              </View>
            </Pressable>
          );
        },
      }}
    >
      <Stack.Screen name="about" />
      <Stack.Screen name="company_info" />
      <Stack.Screen name="privacy_policy" />
      <Stack.Screen name="terms_and_conditions" />
      <Stack.Screen name="contact_us" />
      <Stack.Screen name="limits_and_privileges" />
      <Stack.Screen name="intellectual_property_policy" />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
