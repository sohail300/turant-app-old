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
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { styles } from "@/constants/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const SearchBottomSheet = ({ isOpen, close }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [searchText, setSearchText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const snapPoints = isExpanded ? ["80%"] : ["11.5%"];

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen]);

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
      name: "Neha Gupta",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
      username: "@rahulkumar001",
    },
    {
      id: 7,
      name: "Neha Gupta",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
      username: "@rahulkumar001",
    },
    {
      id: 8,
      name: "Neha Gupta",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
      username: "@rahulkumar001",
    },
    {
      id: 9,
      name: "Neha Gupta",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
      username: "@rahulkumar001",
    },
    {
      id: 10,
      name: "Neha Gupta",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
      username: "@rahulkumar001",
    },
  ];

  const handleTextChange = (e) => {
    const newText = e.nativeEvent.text;
    setSearchText(newText);
    if (newText) {
      setIsExpanded(newText.length > 0);
      // bottomSheetRef.current?.snapToIndex(0);
    }
  };

  const handleClearText = () => {
    setSearchText("");
    setIsExpanded(false);
    // bottomSheetRef.current?.snapToIndex(0);
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <BottomSheet
        ref={bottomSheetRef}
        index={isOpen ? 0 : -1}
        overDragResistanceFactor={0}
        snapPoints={snapPoints}
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
          elevation: 16, // For Android
        }}
      >
        <BottomSheetView style={{ height: searchText ? "auto" : 90 }}>
          {searchText !== "" ? (
            <View style={fileStyles.expandedContent}>
              <View style={fileStyles.headerContainer}>
                <Text style={styles.Subheading2}>People</Text>
              </View>
              <ScrollView>
                {users.map((item) => (
                  <UserCard
                    key={item.id}
                    name={item.name}
                    image={item.image}
                    username={item.username}
                  />
                ))}
              </ScrollView>
            </View>
          ) : null}

          <View
            style={[
              fileStyles.searchContainer,
              !searchText && fileStyles.searchContainerAbsolute,
            ]}
          >
            <Feather
              name="chevron-left"
              size={24}
              color={Colors.light.accent}
              onPress={close}
            />
            <TextInput
              style={fileStyles.searchInput}
              multiline={true}
              placeholder="Search"
              placeholderTextColor={"#A8A8A8"}
              value={searchText}
              onChange={handleTextChange}
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

export default SearchBottomSheet;

const fileStyles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    borderBottomColor: "#B1B1B1",
    borderBottomWidth: 1,
    width: Dimensions.get("window").width,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  searchContainer: {
    borderTopColor: "#B1B1B1",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    gap: 4,
    backgroundColor: "white",
    width: "100%",
  },
  searchContainerAbsolute: {
    position: "absolute",
    bottom: 0,
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
  expandedContent: {
    flex: 1,
    height: "100%",
  },
});

function UserCard({ name, image, username }) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 24,
        paddingHorizontal: 24,
        gap: 12,
      }}
    >
      <Image
        source={{ uri: image }}
        width={40}
        height={40}
        borderRadius={50}
      ></Image>
      <Text style={styles.Subheading}>{name}</Text>
      <Text style={{ ...styles.details, fontSize: 16, lineHeight: 24 }}>
        {username}
      </Text>
    </View>
  );
}
