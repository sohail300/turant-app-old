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
import { changeBottomSheetState } from "@/store/CommentBottomSheetSlice";
import { baseURL } from "@/constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CommentBottomSheet = ({
  isSingle = false,
  close,
}: {
  isSingle?: boolean;
  close?: () => void;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const dispatch = useDispatch();

  const [comment, setComment] = useState("");

  const [comments, setComments] = useState([]);
  const [limit, setLimit] = useState(10); // Limit for each request
  const [offset, setOffset] = useState(0); // Offset for pagination
  const [loading, setLoading] = useState(false); // To avoid duplicate requests
  const [hasMore, setHasMore] = useState(true); // To stop fetching if no more data

  const token = useSelector((state) => state.token.data); // Token from AsyncStorage

  const handleClose = () => {
    console.log(isSingle, close);
    if (isSingle && close) {
      close();
    } else {
      dispatch(changeBottomSheetState(false));
    }
  };

  async function getComments(initialLoad = false) {
    if (loading || !hasMore) return; // Avoid fetching if already loading or no more data
    setLoading(true);

    try {
      const postId = await AsyncStorage.getItem("postId");
      console.log("postId", postId);
      console.log("token", token);
      const response = await fetch(
        `${baseURL}/post/comment?postId=2&limit=10&offset=0`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const comments = await response.json();
      console.log("comments", comments.comments.post_comments);
      if (comments.length === 0) {
        setHasMore(false); // No more data to load
      } else {
        setComments((prevData) =>
          initialLoad
            ? comments.comments.post_comments
            : [...prevData, comments.comments.post_comments]
        );
        setOffset((prevOffset) => prevOffset + limit); // Increment offset for next fetch
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePost() {
    try {
      const postId = await AsyncStorage.getItem("postId");
      console.log("postId", postId);
      console.log("token", token);
      console.log("comment", comment);
      const response = await fetch(`${baseURL}/post/comment/${postId}`, {
        method: "POST",
        body: JSON.stringify({
          comment: comment,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setComment("");
      const comments = await response.json();
      console.log("comments", comments);
      getComments(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    getComments(true);

    console.log("comments", comments);
  }, []);

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

export default CommentBottomSheet;

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
