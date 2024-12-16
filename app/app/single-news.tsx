import { View, Text, Dimensions, Button, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Image, Share } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Link, router } from "expo-router";
import Heading from "@/components/Heading";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import Subheading from "@/components/Subheading";
import RedText from "@/components/RedText";
import {
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";
import ContentText from "@/components/ContentText";
import Details from "@/components/Details";
import IconText from "@/components/IconText";
import DisclaimerText from "@/components/DisclaimerText";
import CommentBottomSheet from "@/components/CommentBottomSheet";
import { ScrollView } from "react-native-gesture-handler";
import card from "@/locales/card.json";
import { useLocalSearchParams } from "expo-router";
import { formatDate } from "@/utils/formatDate";
import {
  handleCommentPress,
  handleFollow,
  handleOtherProfile,
  handleSave,
} from "@/utils/postActions";
import { baseURL } from "@/constants/config";
import { Video, ResizeMode } from "expo-av";

const SingleNews = () => {
  const [showCommentSheet, setShowCommentSheet] = useState(false);
  const dispatch = useDispatch();

  const video = useRef(null);
  const [videoStatus, setVideoStatus] = useState({});

  const {
    title,
    post_id,
    type,
    snippet,
    created_at,
    author,
    authorImage,
    thumbnail,
    currentLikes,
    currentComments,
    currentShares,
    currentViews,
    authorId,
    setCurrentLikes,
    setCurrentComments,
  } = useLocalSearchParams();

  const language = useSelector((state) => state.language.data);
  const isUserLoggedIn = useSelector((state) => state.auth.data);
  const token = useSelector((state) => state.token.data);

  const [content, setContent] = useState("");

  const [status, setStatus] = useState({
    hasLiked: false,
    hasSaved: false,
    isFollowing: false,
  });

  async function getData() {
    try {
      if (type === "video") {
        const response = await fetch(
          `${baseURL}/post/single-video/${post_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setContent(data.post.content);
      } else {
        const response = await fetch(
          `${baseURL}/post/single-image/${post_id}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        setContent(data.post.content);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    getData();
  }, [isUserLoggedIn]);

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
            {type === "image" ? (
              <Image
                source={{
                  uri: "https://fl-i.thgim.com/public/incoming/svh489/article68831258.ece/alternates/LANDSCAPE_1200/Bibek%20Debroy%20Obit.jpg",
                }}
                width={"100%"}
                height={200}
                borderRadius={8}
              />
            ) : type === "video" ? (
              // <Image
              //   source={{
              //     uri: "https://d3i5efosrgchej.cloudfront.net/misc/video.jpg",
              //   }}
              //   width={"100%"}
              //   height={200}
              //   borderRadius={8}
              // />

              <View style={fileStyles.container}>
                <Video
                  ref={video}
                  style={fileStyles.video}
                  source={{
                    uri: "https://d3i5efosrgchej.cloudfront.net/media/sample.mp4",
                  }}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  onPlaybackStatusUpdate={(videoStatus) =>
                    setVideoStatus(() => videoStatus)
                  }
                />
              </View>
            ) : (
              ""
            )}
            <Heading>{title}</Heading>
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
                  onPress={() =>
                    handleOtherProfile({
                      isUserLoggedIn,
                    })
                  }
                >
                  <Image
                    source={{
                      uri:
                        authorImage !== ""
                          ? authorImage
                          : "https://d3i5efosrgchej.cloudfront.net/misc/profile-pic.png",
                    }}
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 50,
                      objectFit: "cover",
                    }}
                  />
                  <Subheading>{author}</Subheading>
                </TouchableOpacity>
                <Text>•</Text>
                <RedText
                  onPress={() =>
                    handleFollow({ post_id, isUserLoggedIn, token, setStatus })
                  }
                >
                  {status.isFollowing
                    ? card.unfollow[language]
                    : card.follow[language]}
                </RedText>
              </View>
              <TouchableOpacity
                onPress={() =>
                  handleSave({ post_id, isUserLoggedIn, token, setStatus })
                }
              >
                <Ionicons
                  name={status.hasSaved ? "bookmark-outline" : "bookmark"} // 'heart' is filled, 'heart-o' is outlined
                  size={24}
                  color={status.hasLiked ? "black" : "black"}
                />
              </TouchableOpacity>
            </View>
            <ContentText full={true}>{snippet}</ContentText>
            <Details>{formatDate(created_at!)}</Details>
            <View style={{ display: "flex", flexDirection: "row", gap: 16 }}>
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 4,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() =>
                  handleLike({
                    post_id,
                    isUserLoggedIn,
                    token,
                    setStatus,
                    setCurrentLikes,
                  })
                }
              >
                <FontAwesome
                  name={status.hasLiked ? "heart" : "heart-o"} // 'heart' is filled, 'heart-o' is outlined
                  size={24}
                  color={status.hasLiked ? "red" : "black"} // Set color to red when liked
                />
                <IconText>{currentLikes}</IconText>
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
                  {
                    handleCommentPress({
                      post_id,
                      isUserLoggedIn,
                      setShowCommentSheet,
                      full: true,
                      dispatch,
                    });
                  }
                }}
              >
                <FontAwesome5 name="comment" size={24} color="black" />
                <IconText>{currentComments}</IconText>
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
                <IconText>{currentViews}</IconText>
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
                <IconText>{currentShares}</IconText>
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

const fileStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  video: {
    width: "100%",
    height: 200, // Set a fixed height or adjust according to your layout
    backgroundColor: "#000", // Placeholder background for the video
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
