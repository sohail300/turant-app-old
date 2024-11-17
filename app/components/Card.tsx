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
import DisclaimerText from "./DisclaimerText";
import { router } from "expo-router";

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
      <Link href={"/single-news"}>
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
          <Subheading onPress={() => router.push("/other-profile")}>
            {author}
          </Subheading>
          <Text>•</Text>
          <RedText> {language === "english" ? "Follow" : "फॉलो"}</RedText>
        </View>
        <Feather name="bookmark" size={24} color="black" />
      </View>
      <ContentText full={full}>{content}</ContentText>
      <Details>{details}</Details>
      <View style={{ display: "flex", flexDirection: "row", gap: 16 }}>
        <Pressable
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => router.push("/login")}
        >
          <FontAwesome5 name="heart" size={24} color="black" />
          <IconText>23.9k</IconText>
        </Pressable>
        <Pressable
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            full && setShowCommentSheet(true);
          }}
        >
          <FontAwesome5 name="comment" size={24} color="black" />
          <IconText>23.9k</IconText>
        </Pressable>
        <Pressable
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
        </Pressable>
      </View>
      {full && (
        <View
          style={{
            borderTopColor: Colors.light.border,
            borderTopWidth: 1,
            paddingTop: 16,
            marginTop: 8,
          }}
        >
          <DisclaimerText>
            Disclaimer: This content/video has been published directly by the
            user on TURANT, an intermediary platform. TURANT has neither
            reviewed nor endorsed the content and holds no prior knowledge of
            its details.
          </DisclaimerText>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Card;
