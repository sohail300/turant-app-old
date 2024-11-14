import React, { useRef } from "react";
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
import { Link } from "expo-router";

const CommentBottomSheet = ({ close }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const comments = [
    {
      id: 1,
      name: "Rahul Kumar",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
      comment:
        "India and China reached an agreement on patrolling arrangements along the LAC.",
    },
    {
      id: 2,
      name: "Amit Singh",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
      comment:
        "The new economic policy is expected to boost the nation's GDP significantly.",
    },
    {
      id: 3,
      name: "Priya Sharma",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
      comment:
        "The healthcare initiative will benefit millions in rural areas.",
    },
    {
      id: 4,
      name: "Vikas Mehta",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
      comment:
        "A new record has been set in the tech industry with this innovation.",
    },
    {
      id: 5,
      name: "Neha Gupta",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
      comment:
        "The environmental policies introduced are essential for sustainable development.",
    },
    {
      id: 6,
      name: "Rohit Patel",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
      comment:
        "Educational reforms are a great step towards a brighter future.",
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
        containerHeight={Dimensions.get("window").height}
        enablePanDownToClose={true}
        onClose={close}
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
            }}
          >
            <Pressable onPress={close}>
              <Feather name="chevron-down" size={24} color="black" />
            </Pressable>
            <Text style={styles.Subheading2}>Comments</Text>
            <SafeAreaView />
          </View>
          <ScrollView style={{ flex: 1 }}>
            {comments.map((item) => {
              return (
                <CommentCard
                  key={item.id}
                  name={item.name}
                  image={item.image}
                  comment={item.comment}
                />
              );
            })}
          </ScrollView>
          <View
            style={{
              borderTopColor: "#B1B1B1",
              borderTopWidth: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 24,
              gap: 4,
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
              placeholder="Add your comment"
              placeholderTextColor={"#A8A8A8"}
            ></TextInput>
            <Link href="/signup">
              <TouchableOpacity
                style={{
                  width: 80,
                  borderRadius: 4,
                  borderColor: Colors.light.accent,
                  borderWidth: 1,
                  padding: 8,
                }}
                onPress={() => {}}
              >
                <Text style={{ ...styles.button }}>Post</Text>
              </TouchableOpacity>
            </Link>
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
        padding: 16,
        gap: 12,
        borderBottomColor: "#DBDBDB",
        borderBottomWidth: 1,
      }}
    >
      <Image
        source={{ uri: image }}
        width={40}
        height={40}
        borderRadius={50}
      ></Image>
      <View style={{ display: "flex", marginTop: 8, paddingRight: 32 }}>
        <Text style={styles.Subheading}>{name}</Text>
        <Text style={styles.ContentText}>{comment}</Text>
      </View>
    </View>
  );
}
