import {
  View,
  Text,
  SafeAreaView,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { Video, ResizeMode } from "expo-av";
import * as WebBrowser from "expo-web-browser";

export const AdCard = ({
  ad_id,
  target_url,
  image,
  videoUrl,
}: {
  ad_id: number;
  target_url: string;
  image?: string;
  videoUrl?: string;
}) => {
  const video = useRef(null);
  const [videoStatus, setVideoStatus] = useState({});

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
      {image && image !== "" && (
        <Pressable
          onPress={async () =>
            await WebBrowser.openBrowserAsync("https://youtube.com/@turantnews-f6c?si=o2r2mW6-fy6fd7YP")
          }
        >
          <Image
            source={{
              uri:
                image !== ""
                  ? image
                  : "https://d3i5efosrgchej.cloudfront.net/media/zomato.jpg",
            }}
            style={{
              width: "100%",
              height: 200,
              borderRadius: 8,
              objectFit: "contain",
            }}
          />
        </Pressable>
      )}
      {video && videoUrl !== "" && (
        <View style={fileStyles.container}>
          {/* Video Component */}
          <Video
            ref={video}
            style={fileStyles.video}
            source={{
              uri:
                videoUrl ||
                "https://d3i5efosrgchej.cloudfront.net/media/sample.mp4",
            }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            onPlaybackStatusUpdate={(status) => setVideoStatus(status)}
          />

          {/* Transparent Overlay Pressable */}
          <Pressable
            style={StyleSheet.absoluteFill} // Makes the Pressable fill the entire Video component
            onPress={async () =>
              await WebBrowser.openBrowserAsync(
                target_url || "https://youtube.com/@turantnews-f6c?si=o2r2mW6-fy6fd7YP"
              )
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default AdCard;

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
