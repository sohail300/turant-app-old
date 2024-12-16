import {
  View,
  Text,
  SafeAreaView,
  Image,
  Pressable,
  Share,
} from "react-native";
import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import DisclaimerText from "./DisclaimerText";
import { router } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { TouchableOpacity } from "react-native-gesture-handler";
import { changeBottomSheetState } from "@/store/CommentBottomSheetSlice";
import { formatDate } from "@/utils/formatDate";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { baseURL } from "@/constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import card from "@/locales/card.json";
import { useNavigation } from "expo-router";
import {
  handleCommentPress,
  handleFollow,
  handleOtherProfile,
  handleSave,
  handleShare,
} from "@/utils/postActions";
import RenderHTML from "react-native-render-html";

const Card = ({
  post_id,
  title,
  type,
  snippet,
  created_at,
  author, // Default author name if not provided
  authorImage, // Placeholder image if not provided
  thumbnail,
  full = false,
  setShowCommentSheet,
  likes,
  comments,
  shares,
  views,
  authorId,
  liked = false,
  saved = false,
}: {
  post_id: number;
  title: string;
  snippet: string;
  type: string;
  author?: string;
  created_at?: string;
  authorImage?: string;
  thumbnail?: string;
  full?: boolean;
  setShowCommentSheet?: (value: boolean) => void;
  likes?: number;
  comments?: number;
  shares?: number;
  views?: number;
  authorId?: number;
  liked?: boolean;
  saved?: boolean;
}) => {
  const language = useSelector((state: any) => state.language.data);
  const token = useSelector((state: any) => state.token.data);
  const isUserLoggedIn = useSelector((state: any) => state.auth.data);
  const dispatch = useDispatch();

  const [currentLikes, setCurrentLikes] = useState(likes);
  const [currentComments, setCurrentComments] = useState(comments);
  const [currentShares, setCurrentShares] = useState(shares);
  const [currentViews, setCurrentViews] = useState(views);

  const [status, setStatus] = useState({
    hasLiked: false,
    hasSaved: false,
    isFollowing: false,
  });

  async function getData() {
    try {
      const response = await fetch(
        `${baseURL}/post/has-liked-saved-following?postId=${post_id}&authorId=${authorId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log("data", data);
      setStatus(data);
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const handleLike = async () => {
    try {
      if (isUserLoggedIn === "no") {
        router.push("/login");
      }

      const response = await fetch(`${baseURL}/post/like/${post_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      setStatus((prevStatus) => ({
        ...prevStatus,
        liked: !liked,
      }));
      setCurrentLikes((prevLikes) =>
        data.hasLiked ? prevLikes - 1 : prevLikes + 1
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

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
          uri:
            thumbnail !== ""
              ? thumbnail
              : "https://d3i5efosrgchej.cloudfront.net/misc/profile-pic.png",
        }}
        style={{
          width: "100%",
          height: 200,
          borderRadius: 8,
          objectFit: "contain",
        }}
      />
      {/* <Text onPress={() => router.push("/login")}>Login</Text> */}
      <Heading
        onPress={() =>
          router.push({
            pathname: "/single-news",
            params: {
              title,
              post_id,
              type,
              thumbnail,
              snippet,
              created_at,
              author,
              authorImage,
              authorId,
              currentLikes,
              currentComments,
              currentShares,
              currentViews,
            },
          })
        }
      >
        {title}
      </Heading>
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
              handleOtherProfile({ post_id, isUserLoggedIn, token, setStatus })
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
            name={saved ? "bookmark" : "bookmark-outline"} // 'heart' is filled, 'heart-o' is outlined
            size={24}
            color={saved ? "black" : "black"}
          />
        </TouchableOpacity>
      </View>
      <ContentText
        full={false}
        title={title}
        post_id={post_id}
        type={type}
        thumbnail={thumbnail}
        snippet={snippet}
        created_at={created_at}
        author={author}
        authorImage={authorImage}
        authorId={authorId}
        currentLikes={currentLikes}
        currentComments={currentComments}
        currentShares={currentShares}
        currentViews={currentViews}
      >
        <RenderHTML source={{html: snippet}} />
      </ContentText>
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
          onPress={() => handleLike()}
        >
          <FontAwesome
            name={liked ? "heart" : "heart-o"} // 'heart' is filled, 'heart-o' is outlined
            size={24}
            color={liked ? "red" : "black"} // Set color to red when liked
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
                full,
                dispatch,
              });
            }
          }}
        >
          <FontAwesome5 name="comment" size={24} color="black" />
          <IconText>{currentComments}</IconText>
        </TouchableOpacity>

        {type === "video" && (
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
        )}

        <TouchableOpacity
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() =>
            handleShare({
              post_id,
              isUserLoggedIn,
              token,
              setStatus,
              setCurrentShares,
            })
          }
        >
          <FontAwesome6 name="share-square" size={22} color="black" />
          <IconText>{currentShares}</IconText>
        </TouchableOpacity>
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
          <DisclaimerText>{card.disclaimer[language]}</DisclaimerText>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Card;
