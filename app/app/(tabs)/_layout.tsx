import { router, Tabs } from "expo-router";
import React, { useRef, useState } from "react";
import { Colors } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SearchBottomSheet from "@/components/SearchBottomSheet";

export default function TabLayout() {
  const [isOpen, setIsOpen] = useState(false);

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
          // listeners={{
          //   tabPress: (e) => {
          //     e.preventDefault();
          //     setIsOpen(true);
          //   },
          // }}
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
              router.push("/about");
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

      {/* <SearchBottomSheet isOpen={isOpen} close={() => setIsOpen(false)} /> */}
    </>
  );
}
