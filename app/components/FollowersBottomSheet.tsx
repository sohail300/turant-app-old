import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
} from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Feather from "@expo/vector-icons/Feather";
import { styles } from "@/constants/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { changeFollowersBottomSheetState } from "@/store/FollowersBottomSheetSlice";
import { MaterialIcons } from "@expo/vector-icons";

const FollowersBottomSheet = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const dispatch = useDispatch();

  const handleClose = () => {
    setSearchText("");
    dispatch(changeFollowersBottomSheetState(false));
  };

  const [searchText, setSearchText] = useState("");

  const handleClearText = () => {
    setSearchText("");
  };

  const users = [
    {
      id: 1,
      name: "Rahul Kumar",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
      username: "@rahulkumar001",
    },
    {
      id: 2,
      name: "Amit Singh",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
      username: "@rahulkumar001",
    },
    {
      id: 3,
      name: "Priya Sharma",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
      username: "@rahulkumar001",
    },
    {
      id: 4,
      name: "Vikas Mehta",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
      username: "@rahulkumar001",
    },
    {
      id: 5,
      name: "Neha Gupta",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
      username: "@rahulkumar001",
    },
    {
      id: 6,
      name: "Rohit Patel",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
      username: "@rahulkumar001",
    },
  ];

  return (
    <View style={StyleSheet.absoluteFill}>
      <BottomSheet
        ref={bottomSheetRef}
        overDragResistanceFactor={0}
        snapPoints={["70%"]}
        handleIndicatorStyle={{ display: "none" }}
        handleStyle={{
          height: 0,
          padding: 0,
          margin: 0,
        }}
        style={{
          backgroundColor: "#fff", // Ensure background is set
          shadowColor: "#000", // Shadow color
          shadowOffset: { width: 0, height: -2 }, // Top shadow with a negative height
          shadowOpacity: 0.5, // Opacity of the shadow
          shadowRadius: 4, // Blur radius
          elevation: 12, // For Android
        }}
        containerHeight={Dimensions.get("window").height}
        enablePanDownToClose={true}
        onClose={handleClose}
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
              justifyContent: "flex-start",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Text style={styles.Subheading2}>People</Text>
          </View>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <UserCard
                name={item.name}
                image={item.image}
                username={item.username}
              />
            )}
            style={{
              flexGrow: 0,
              maxHeight: Dimensions.get("window").height * 0.54, // Constrain height
            }}
          />
          <View style={[fileStyles.searchContainer]}>
            <Feather
              name="chevron-left"
              size={24}
              color={Colors.light.accent}
              onPress={handleClose}
            />
            <TextInput
              style={fileStyles.searchInput}
              multiline={true}
              placeholder="Search"
              placeholderTextColor={"#A8A8A8"}
              value={searchText}
              onChange={(e) => setSearchText(e.nativeEvent.text)}
            />
            {searchText && (
              <MaterialIcons
                name="close"
                size={24}
                color={Colors.light.details}
                style={fileStyles.closeIcon}
                onPress={handleClearText}
              />
            )}
            <Feather
              name="search"
              size={24}
              color={Colors.light.accent}
              style={fileStyles.searchIcon}
            />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default FollowersBottomSheet;

function UserCard({ name, image, username }) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
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
      <Text style={{ ...styles.ContentText2, color: Colors.light.details }}>
        {username}
      </Text>
    </View>
  );
}

const fileStyles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 4,
    width: "100%",
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
  },
  searchInput: {
    borderColor: Colors.light.border,
    borderWidth: 1,
    flex: 1,
    borderRadius: 4,
    minHeight: 48,
    paddingLeft: 16,
    paddingRight: 80,
  },
  closeIcon: {
    position: "absolute",
    right: 72,
  },
  searchIcon: {
    position: "absolute",
    right: 36,
  },
});
