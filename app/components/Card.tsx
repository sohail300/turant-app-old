import { View, Text, SafeAreaView, Image } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "@/constants/Colors";
import Heading from "./Heading";

const Card = () => {
  return (
    <SafeAreaView
      style={{
        backgroundColor: `${Colors.light.white}`,
        margin: 12,
        padding: 20,
        borderColor: `${Colors.light.border}`,
        borderWidth: 1,
        borderRadius: 16,
      }}
    >
      <Image
        source={{
          uri: "https://fl-i.thgim.com/public/incoming/svh489/article68831258.ece/alternates/LANDSCAPE_1200/Bibek%20Debroy%20Obit.jpg",
        }}
        width={330}
        height={200}
        style={{ objectFit: "contain" }}
      />
      <Heading style={{ fontFamily: "Lora700" }}>
        Beyond Economics, Dr Bibek Debroy's Tongue-In-Cheek Take On Current
        Events
      </Heading>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Image
            source={{
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
            }}
          ></Image>
          <Text>Rahul Kumar</Text>
          <Text>Follow</Text>
        </View>
        <Feather name="bookmark" size={24} color="black" />
      </View>
    </SafeAreaView>
  );
};

export default Card;
