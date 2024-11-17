import { View, Text, SafeAreaView, Image, Pressable } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "@/constants/Colors";
import Heading from "./Heading";
import RedText from "./RedText";
import Subheading from "./Subheading";
import ContentText from "./ContentText";
import Details from "./Details";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import IconText from "./IconText";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link } from "expo-router";
import { useSelector } from "react-redux";

const Card = ({
  heading,
  content,
  details,
  author,
  authorImage,
  imageUrl,
  setShowCommentSheet,
  full = false,
}) => {
  const language = useSelector((state) => state.language.data);

  return (
    <SafeAreaView
      style={{
        backgroundColor: `${Colors.light.white}`,
        margin: 12,
        padding: 20,
        borderColor: `${Colors.light.border}`,
        borderWidth: 1,
        borderRadius: 8,
        gap: 8,
      }}
    >
      <Image
        source={{
          uri: imageUrl,
        }}
        width={330}
        height={200}
        borderRadius={8}
      />
      <Link href={"/SingleNews"}>
        <Heading>{heading}</Heading>
      </Link>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            paddingVertical: 8,
          }}
        >
          <Image
            source={{
              uri: authorImage,
            }}
            height={40}
            width={40}
            borderRadius={50}
          />
          <Subheading>{author}</Subheading>
          <Text>•</Text>
          <RedText> {language === "english" ? "Follow" : "फॉलो"}</RedText>
        </View>
        <Feather name="bookmark" size={24} color="black" />
      </View>
      <ContentText full={full}>{content}</ContentText>
      <Details>{details}</Details>
      <View style={{ display: "flex", flexDirection: "row", gap: 16 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable>
            <FontAwesome5 name="heart" size={24} color="black" />
          </Pressable>
          <IconText>23.9k</IconText>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={() => {
              full && setShowCommentSheet(true);
            }}
          >
            <FontAwesome5 name="comment" size={24} color="black" />
          </Pressable>
          <IconText>23.9k</IconText>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SimpleLineIcons name="share-alt" size={24} color="black" />
          <IconText>214</IconText>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Card;
