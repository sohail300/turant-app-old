import { View, Text, Dimensions, StyleSheet } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { FlatList, ScrollView, TextInput } from "react-native-gesture-handler";
import { Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/constants/styles";
import { router } from "expo-router";
import ContactCard from "@/components/ContactCard";

const Component = () => {
  const contactList = [
    {
      id: 1,
      name: "Rahul",
      number: "(+91) 99999 99999",
      state: "Jharkhand",
      district: "Ranchi",
      block: "Jainagar Block Office",
    },
    {
      id: 2,
      name: "Rahul",
      number: "(+91) 99999 99999",
      state: "Jharkhand",
      district: "Ranchi",
      block: "Jainagar Block Office",
    },
    {
      id: 3,
      name: "Rahul",
      number: "(+91) 99999 99999",
      state: "Jharkhand",
      district: "Ranchi",
      block: "Jainagar Block Office",
    },
    {
      id: 4,
      name: "Rahul",
      number: "(+91) 99999 99999",
      state: "Jharkhand",
      district: "Ranchi",
      block: "Jainagar Block Office",
    },
  ];

  const [searchText, setSearchText] = useState("");

  const handleTextChange = (e) => {
    const newText = e.nativeEvent.text;
    setSearchText(newText);
  };

  const handleClearText = () => {
    setSearchText("");
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: `${Colors.light.background}`,
        height: Dimensions.get("screen").height,
        flex: 1,
      }}
    >
      <ScrollView
        style={{
          marginTop: 48,
          backgroundColor: Colors.light.white,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 24,
            borderBottomColor: Colors.light.border,
            borderBottomWidth: 1,
          }}
        >
          <Text
            style={{
              ...styles.Subheading2,
              fontSize: 22,
              color: Colors.light.subheading,
            }}
          >
            Contact Us
          </Text>
        </View>

        <View
          style={{
            marginTop: 20,
            paddingHorizontal: 16,
            display: "flex",
            gap: 16,
          }}
        >
          <View style={[fileStyles.searchContainer]}>
            <Feather
              name="search"
              size={24}
              color={Colors.light.accent}
              style={fileStyles.searchIcon}
            />
            <TextInput
              style={fileStyles.searchInput}
              multiline={true}
              placeholder="Search for Nearby Reporters"
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
          </View>
          <FlatList
            scrollEnabled={false}
            keyExtractor={(item) => String(item.id)}
            data={contactList}
            renderItem={({ item }) => (
              <ContactCard
                name={"Ramesh Kumar"}
                number={"(+91) 99999 99999"}
                state={"Jharkhand"}
                district={"Ranchi"}
                block={"Jainagar Block Office"}
              />
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Component;

const fileStyles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 4,
    backgroundColor: "white",
    width: "100%",
  },
  searchInput: {
    borderColor: Colors.light.border,
    borderWidth: 1,
    flex: 1,
    borderRadius: 5,
    minHeight: 48,
    paddingLeft: 48,
    marginVertical: 8,
  },
  closeIcon: {
    position: "absolute",
    right: 72,
  },
  searchIcon: {
    position: "absolute",
    left: 16,
  },
});
