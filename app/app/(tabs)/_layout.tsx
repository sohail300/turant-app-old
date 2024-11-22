import { router, Tabs } from "expo-router";
import React, { useRef, useState } from "react";
import { Colors } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SearchBottomSheet from "@/components/SearchBottomSheet";
import RestrictedBottomSheet from "@/components/RestrictedBottomSheet";
import { Dimensions, View } from "react-native";

export default function TabLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const [showRestrictedBottomSheet, setShowRestrictedBottomSheet] =
    useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#fff",
            height: 60,
            paddingTop: 10,
            paddingBottom: 10,
            borderColor: "transparent",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarActiveTintColor: Colors.light.accent,
            tabBarIcon: ({ color, focused }) => (
              <Feather name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              router.push("/about");
            },
          }}
          options={{
            title: "Search",
            tabBarActiveTintColor: Colors.light.accent,
            tabBarIcon: ({ color, focused }) => (
              <Feather name="search" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="upload"
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setShowRestrictedBottomSheet(true);
            },
          }}
          options={{
            title: "Upload",
            tabBarActiveTintColor: Colors.light.accent,
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons
                name="add-circle-outline"
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarActiveTintColor: Colors.light.accent,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name="person-outline" size={24} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* Gray overlay */}
      {showRestrictedBottomSheet && (
        <View
          style={{
            position: "absolute",
            top: 0, // This ensures it starts from the very top
            left: 0,
            right: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            height: Dimensions.get("screen").height,
          }}
        />
      )}
      {showRestrictedBottomSheet && (
        <RestrictedBottomSheet
          close={() => setShowRestrictedBottomSheet(false)}
        />
      )}
    </>
  );
}
