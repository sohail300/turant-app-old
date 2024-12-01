import { router, Tabs } from "expo-router";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SearchBottomSheet from "@/components/SearchBottomSheet";
import RestrictedBottomSheet from "@/components/RestrictedBottomSheet";
import { Dimensions, View } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import CommentBottomSheet from "@/components/CommentBottomSheet";
import { useSelector } from "react-redux";
import FollowersBottomSheet from "@/components/FollowersBottomSheet";

export default function TabLayout() {
  const [showRestrictedBottomSheet, setShowRestrictedBottomSheet] =
    useState(false);

  const [showSearchBar, setShowSearchBar] = useState(false);

  const commentSheetState = useSelector(
    (state) => state.commentBottomSheet.data
  );
  const followersSheetState = useSelector(
    (state) => state.followersBottomSheet.data
  );

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
              <Feather
                name="home"
                size={24}
                color={focused ? Colors.light.accent : Colors.light.black}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setShowSearchBar(true);
            },
          }}
          options={{
            title: "Search",
            tabBarActiveTintColor: Colors.light.accent,
            tabBarIcon: ({ color, focused }) => (
              <Feather
                name="search"
                size={24}
                color={focused ? Colors.light.accent : Colors.light.black}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="upload"
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              router.push("/(upload)/upload");
              // setShowRestrictedBottomSheet(true);
            },
          }}
          options={{
            title: "Upload",
            tabBarActiveTintColor: Colors.light.accent,
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons
                name="add-circle-outline"
                size={24}
                color={focused ? Colors.light.accent : Colors.light.black}
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
              <FontAwesome6
                name="user"
                size={21}
                color={focused ? Colors.light.accent : Colors.light.black}
              />
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
      {showSearchBar && (
        <SearchBottomSheet
          isOpen={true}
          close={() => setShowSearchBar(false)}
        />
      )}

      {commentSheetState && <CommentBottomSheet />}
      {followersSheetState && <FollowersBottomSheet />}
    </>
  );
}
