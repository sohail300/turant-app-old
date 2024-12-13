import { View, Text, Dimensions } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Image, Share } from "react-native";
import { useSelector } from "react-redux";
import { Link, router } from "expo-router";
import Heading from "@/components/Heading";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import Subheading from "@/components/Subheading";
import RedText from "@/components/RedText";
import { Feather, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import ContentText from "@/components/ContentText";
import Details from "@/components/Details";
import IconText from "@/components/IconText";
import DisclaimerText from "@/components/DisclaimerText";
import CommentBottomSheet from "@/components/CommentBottomSheet";
import { ScrollView } from "react-native-gesture-handler";
import card from "@/locales/card.json";

const SingleNews = () => {
  const [showCommentSheet, setShowCommentSheet] = useState(false);

  const item = {
    id: 2,
    heading:
      "Beyond Economics, Dr Bibek Debroy's Tongue-In-Cheek Take On Current Events",
    imageUrl:
      "https://fl-i.thgim.com/public/incoming/svh489/article68831258.ece/alternates/LANDSCAPE_1200/Bibek%20Debroy%20Obit.jpg",
    author: "Rahul Kumar",
    authorImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
    content:
      "A being with a thousand heads, a thousand eyes and a thousand feet 'surrounds the entire universe yet there is more of him that is left over'. Dr Bibek Debroy's explanation of the Supreme in one of his around 50 books. A being with a thousand heads, a thousand eyes and a thousand feet 'surrounds the entire universe yet there is more of him that is left over'. Dr Bibek Debroy's explanation of the Supreme in one of his around 50 books. A being with a thousand heads, a thousand eyes and a thousand feet 'surrounds the entire universe yet there is more of him that is left over'. Dr Bibek Debroy's explanation of the Supreme in one of his around 50 books. A being with a thousand heads, a thousand eyes and a thousand feet 'surrounds the entire universe yet there is more of him that is left over'. Dr Bibek Debroy's explanation of the Supreme in one of his around 50 books.",
    details: "Ranchi, Jharkhand | 1 Nov 2024 | 2:00 PM",
  };

  const language = useSelector((state) => state.language.data);

  return (
    <>
      <SafeAreaView
        style={{
          backgroundColor: `${Colors.light.background}`,
          height: Dimensions.get("screen").height,
          flex: 1,
        }}
      >
        <ScrollView
          style={{
            marginTop: 56,
          }}
        >
          <View
            style={{
              backgroundColor: `${Colors.light.white}`,
              margin: 12,
              marginTop: 0,
              padding: 20,
              borderColor: `${Colors.light.border}`,
              borderWidth: 1,
              borderRadius: 8,
              gap: 8,
            }}
          >
            <Image
              source={{
                uri: item.imageUrl,
              }}
              width={"100%"}
              height={200}
              borderRadius={8}
            />
            <Link href={"/single-news"}>
              <Heading>{item.heading}</Heading>
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
                <TouchableOpacity
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                  }}
                  onPress={() => router.push("/other-profile")}
                >
                  <Image
                    source={{
                      uri: item.authorImage,
                    }}
                    height={40}
                    width={40}
                    borderRadius={50}
                  />
                  <Subheading>{item.author}</Subheading>
                </TouchableOpacity>
                <Text>•</Text>
                <RedText> {card.follow[language]}</RedText>
              </View>
              <TouchableOpacity>
                <Feather name="bookmark" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <ContentText full={true}>{item.content}</ContentText>
            <Details>{item.details}</Details>
            <View style={{ display: "flex", flexDirection: "row", gap: 16 }}>
              <TouchableOpacity
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
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 4,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  setShowCommentSheet(true);
                }}
              >
                <FontAwesome5 name="comment" size={24} color="black" />
                <IconText>23.9k</IconText>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 4,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Feather name="eye" size={26} color="black" />
                <IconText>60k</IconText>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 4,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() =>
                  Share.share({
                    message:
                      "Checkout TurantNews, I think you will like it. https://play.google.com/",
                    url: "Checkout TurantNews, I think you will like it. https://play.google.com/",
                  })
                }
              >
                <FontAwesome6 name="share-square" size={22} color="black" />
                <IconText>214</IconText>
              </TouchableOpacity>
            </View>
            <View
              style={{
                borderTopColor: Colors.light.border,
                borderTopWidth: 1,
                paddingTop: 16,
                marginTop: 8,
              }}
            >
              <DisclaimerText>{card.disclaimer[language]}</DisclaimerText>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {showCommentSheet && (
        <CommentBottomSheet
          isSingle={true}
          close={() => setShowCommentSheet(false)}
        />
      )}
    </>
  );
};

export default SingleNews;
