import { Pressable, StyleSheet, Text, View } from "react-native";
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
      <Stack.Screen name="upload" />
      <Stack.Screen name="upload_video" />
      <Stack.Screen name="upload_image" />
      <Stack.Screen name="upload_article" />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
