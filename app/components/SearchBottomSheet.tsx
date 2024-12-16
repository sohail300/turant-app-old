import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Feather from "@expo/vector-icons/Feather";
import { styles } from "@/constants/styles";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { baseURL } from "@/constants/config";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchBottomSheet = ({
  isOpen,
  close,
}: {
  isOpen: boolean;
  close?: () => void;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const response = await fetch(`${baseURL}/user/search-users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        identifier: searchText,
        limit: 10,
        offset: 0,
      }),
    });
    const usersData = await response.json();
    console.log("usersData");
    console.log(usersData.users);
    setUsers(usersData.users);
  };
  useEffect(() => {
    if (searchText.length > 0) {
      fetchUsers();
    }
  }, [searchText]);

  const [limit, setLimit] = useState(10); // Limit for each request

  const token = useSelector((state) => state.token.data); // Token from AsyncStorage

  // Handle back button press
  useEffect(() => {
    const backAction = () => {
      if (isOpen) {
        bottomSheetRef.current?.close(); // Close the bottom sheet
        return true; // Prevent app from closing
      }
      return false; // Let the system handle the back button press (close the app)
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      backHandler.remove(); // Clean up the back button listener
    };
  }, []);

  return (
    <SafeAreaView style={StyleSheet.absoluteFill}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <BottomSheet
          ref={bottomSheetRef}
          overDragResistanceFactor={0}
          snapPoints={["100%"]}
          handleIndicatorStyle={{ display: "none" }}
          handleStyle={{
            height: 0,
            padding: 0,
            margin: 0,
          }}
          containerHeight={Dimensions.get("window").height}
          enablePanDownToClose={true}
          onClose={close}
          style={{
            backgroundColor: "#fff", // Ensure background is set
            shadowColor: "#000", // Shadow color
            shadowOffset: { width: 0, height: -2 }, // Top shadow with a negative height
            shadowOpacity: 0.5, // Opacity of the shadow
            shadowRadius: 4, // Blur radius
            elevation: 12, // For Android
            borderRadius: 10,
          }}
        >
          <BottomSheetView
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <View
              style={{
                borderBottomColor: "#B1B1B1",
                borderBottomWidth: 1,
                width: Dimensions.get("window").width,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 8,
                position: "relative",
              }}
            >
              <Pressable
                onPress={close}
                style={{ position: "absolute", left: 16 }}
              >
                <Feather name="chevron-down" size={24} color="black" />
              </Pressable>
              <Text style={styles.Subheading2}>People</Text>
              <View />
            </View>
            <FlatList
              data={users}
              keyExtractor={(item) => item.user_id}
              renderItem={({ item }) => (
                <UserCard
                  username={item.username}
                  name={item.display_name}
                  image={item.image}
                />
              )}
              style={{
                flexGrow: 0,
                maxHeight: Dimensions.get("window").height * 0.54, // Constrain height
              }}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 24,
                gap: 4,
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "#fff", // Ensure background is set
                shadowColor: "#000", // Shadow color
                shadowOffset: { width: 0, height: -2 }, // Top shadow with a negative height
                shadowOpacity: 0.25, // Opacity of the shadow
                shadowRadius: 4, // Blur radius
                elevation: 8, // For Android
              }}
            >
              <TextInput
                style={{
                  borderColor: Colors.light.border,
                  borderWidth: 1,
                  width: "100%",
                  borderRadius: 4,
                  minHeight: 48,
                  paddingLeft: 16,
                }}
                multiline={true}
                value={searchText}
                placeholder="Search"
                placeholderTextColor={"#A8A8A8"}
                onChangeText={(text) => setSearchText(text)}
              ></TextInput>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SearchBottomSheet;

function UserCard({ username, name, image }) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 6,
        gap: 12,
        borderBottomColor: "#DBDBDB",
        borderBottomWidth: 1,
      }}
    >
      <Pressable onPress={() => router.push("/other-profile")}>
        <Image
          source={{ uri: image }}
          width={40}
          height={40}
          borderRadius={50}
        />
      </Pressable>
      <Pressable onPress={() => router.push("/other-profile")}>
        <Text style={styles.Subheading}>{name}</Text>
      </Pressable>
      <Text style={styles.ContentText}>{username}</Text>
    </View>
  );
}
