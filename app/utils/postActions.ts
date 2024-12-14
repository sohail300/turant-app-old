import { baseURL } from "@/constants/config";
import { changeBottomSheetState } from "@/store/CommentBottomSheetSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Share } from "react-native";

// utils/postActions.js

export const handleCommentPress = ({
  post_id,
  isUserLoggedIn,
  setShowCommentSheet,
  full,
  dispatch,
}) => {
  if (isUserLoggedIn === "no") {
    router.push("/login");
    return;
  }
  AsyncStorage.setItem("postId", post_id.toString());
  full && setShowCommentSheet
    ? setShowCommentSheet(true)
    : dispatch(changeBottomSheetState(true));
};

export const handleSave = async ({
  post_id,
  isUserLoggedIn,
  token,
  setStatus,
}) => {
  try {
    if (isUserLoggedIn === "no") {
      router.push("/login");
      return;
    }

    const response = await fetch(`${baseURL}/post/save/${post_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (data.success) {
      setStatus((prevStatus) => ({
        ...prevStatus,
        hasSaved: !prevStatus.hasSaved,
      }));
    }
  } catch (error) {
    console.error("Error saving post:", error);
  }
};

export const handleShare = async ({
  post_id,
  isUserLoggedIn,
  token,
  setStatus,
  setCurrentShares,
}) => {
  try {
    const response = await fetch(`${baseURL}/post/share/${post_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (response.ok) {
      setCurrentShares((prevShares) => prevShares + 1);
    }

    await Share.share({
      message:
        "Checkout TurantNews, I think you will like it. https://play.google.com/",
      url: "Checkout TurantNews, I think you will like it. https://play.google.com/",
    });
  } catch (error) {
    console.log("error", error);
  }
};

export const handleFollow = async ({
  post_id,
  isUserLoggedIn,
  token,
  setStatus,
}) => {
  try {
    if (isUserLoggedIn === "no") {
      router.push("/login");
      return;
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

export const handleOtherProfile = ({ isUserLoggedIn }) => {
  if (isUserLoggedIn === "no") {
    router.push("/login");
  } else {
    router.push("/other-profile");
  }
};
