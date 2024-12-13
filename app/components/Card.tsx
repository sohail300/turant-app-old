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
}) => {
  const language = useSelector((state) => state.language.data);
  const isUserLoggedIn = useSelector((state) => state.auth.data);
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

  const token = useSelector((state) => state.token.data); // Token from AsyncStorage
  const auth = useSelector((state) => state.auth.data); // Auth from AsyncStorage
  // console.log("token", token);

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

      if (status.hasLiked) {
        setCurrentLikes(currentLikes! - 1);
      } else {
        setCurrentLikes(currentLikes! + 1);
      }
      setStatus((prevStatus) => ({
        ...prevStatus,
        hasLiked: !prevStatus.hasLiked,
      }));
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSave = async () => {
    try {
      if (isUserLoggedIn === "no") {
        router.push("/login");
      }
      const response = await fetch(`${baseURL}/post/save/${post_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("data", data);
      setStatus((prevStatus) => ({
        ...prevStatus,
        hasSaved: !prevStatus.hasSaved,
      }));
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleShare = async () => {
    try {
      const response = await fetch(`${baseURL}/post/share/${post_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCurrentShares(currentShares! + 1);

      await Share.share({
        message:
          "Checkout TurantNews, I think you will like it. https://play.google.com/",
        url: "Checkout TurantNews, I think you will like it. https://play.google.com/",
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleFollow = async () => {
    try {
      if (isUserLoggedIn === "no") {
        router.push("/login");
      }
      const response = await fetch(`${baseURL}/user/follow/${authorId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("data", data);

      setStatus((prevStatus) => ({
        ...prevStatus,
        isFollowing: !prevStatus.isFollowing,
      }));
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleCommentPress = () => {
    if (isUserLoggedIn === "no") {
      router.push("/login");
    }
    AsyncStorage.setItem("postId", post_id.toString());
    full && setShowCommentSheet
      ? setShowCommentSheet(true)
      : dispatch(changeBottomSheetState(true));
  };

  const handleOtherProfile = () => {
    if (isUserLoggedIn === "no") {
      router.push("/login");
    } else {
      AsyncStorage.setItem("authorId", authorId!.toString());
      router.push("/other-profile");
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
      <Text onPress={() => router.push("/login")}>Login</Text>
      <Link href={"/single-news"}>
        <Heading>{title}</Heading>
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
            onPress={() => handleOtherProfile()}
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
          <RedText onPress={() => handleFollow()}>
            {status.isFollowing ? "Unfollow" : "Follow"}
          </RedText>
        </View>
        <TouchableOpacity onPress={() => handleSave()}>
          <Ionicons
            name={status.hasSaved ? "bookmark-outline" : "bookmark"} // 'heart' is filled, 'heart-o' is outlined
            size={24}
            color={status.hasLiked ? "black" : "black"}
          />
        </TouchableOpacity>
      </View>
      <ContentText full={false}>{snippet}</ContentText>
      {/* <Details>{formatDate(created_at!)}</Details> */}
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
              handleCommentPress();
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
          onPress={() => handleShare()}
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
