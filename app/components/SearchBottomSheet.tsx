import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
} from "react-native";
import {
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Feather from "@expo/vector-icons/Feather";
import { styles } from "@/constants/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Link, router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { changeBottomSheetState } from "@/store/SearchBottomSheetSlice";
import { baseURL } from "@/constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

const SearchBottomSheet = ({
  isSingle = false,
  close,
}: {
  isSingle?: boolean;
  close?: () => void;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  // const [users, setUsers] = useState([
  //   {
  //     id: 1,
  //     name: "Rahul Kumar",
  //     image:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
  //     username: "@rahulkumar001",
  //   },
  //   {
  //     id: 2,
  //     name: "Amit Singh",
  //     image:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
  //     username: "@rahulkumar001",
  //   },
  //   {
  //     id: 3,
  //     name: "Priya Sharma",
  //     image:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
  //     username: "@rahulkumar001",
  //   },
  //   {
  //     id: 4,
  //     name: "Vikas Mehta",
  //     image:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
  //     username: "@rahulkumar001",
  //   },
  //   {
  //     id: 5,
  //     name: "Neha Gupta",
  //     image:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
  //     username: "@rahulkumar001",
  //   },
  //   {
  //     id: 6,
  //     name: "Neha Gupta",
  //     image:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
  //     username: "@rahulkumar001",
  //   },
  //   {
  //     id: 7,
  //     name: "Neha Gupta",
  //     image:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
  //     username: "@rahulkumar001",
  //   },
  //   {
  //     id: 8,
  //     name: "Neha Gupta",
  //     image:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
  //     username: "@rahulkumar001",
  //   },
  //   {
  //     id: 9,
  //     name: "Neha Gupta",
  //     image:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
  //     username: "@rahulkumar001",
  //   },
  //   {
  //     id: 10,
  //     name: "Neha Gupta",
  //     image:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
  //     username: "@rahulkumar001",
  //   },
  // ]);

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
    console.log(usersData);
    setUsers(usersData.users);
  };
  useEffect(() => {
    if (searchText.length > 0) {
      fetchUsers();
    }
  }, [searchText]);

  const [limit, setLimit] = useState(10); // Limit for each request

  const token = useSelector((state) => state.token.data); // Token from AsyncStorage

  const handleClose = () => {
    console.log(isSingle, close);
    if (isSingle && close) {
      close();
    } else {
      dispatch(changeBottomSheetState(false));
    }
  };

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
        containerHeight={Dimensions.get("window").height}
        enablePanDownToClose={true}
        onClose={handleClose}
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
            <Pressable onPress={handleClose}>
              <Feather name="chevron-down" size={24} color="black" />
            </Pressable>
            <Text style={styles.Subheading2}>Comments</Text>
            <SafeAreaView />
          </View>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.created_at}
            renderItem={({ item }) => (
              <CommentCard
                comment={item.comment}
                name={item.user.display_name}
                image={item.user.image}
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
                width: 240,
                borderRadius: 4,
                minHeight: 48,
                paddingLeft: 16,
              }}
              multiline={true}
              value={comment}
              placeholder="Add your comment"
              placeholderTextColor={"#A8A8A8"}
              onChangeText={(text) => setComment(text)}
            ></TextInput>
            <TouchableOpacity
              style={{
                width: 80,
                borderRadius: 4,
                borderColor: Colors.light.accent,
                borderWidth: 1,
                padding: 8,
              }}
              onPress={() => {
                handlePost();
              }}
            >
              <Text style={{ ...styles.button, color: Colors.light.accent }}>
                Post
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default SearchBottomSheet;

function CommentCard({ name, image, comment }) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
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
      <View
        style={{
          display: "flex",
        }}
      >
        <Pressable onPress={() => router.push("/other-profile")}>
          <Text style={styles.Subheading}>{name}</Text>
        </Pressable>
        <Text style={styles.ContentText}>{comment}</Text>
      </View>
    </View>
  );
}
