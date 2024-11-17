import { View, Text, Dimensions } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { ScrollView } from "react-native-gesture-handler";
import Card from "@/components/Card";
import CommentBottomSheet from "@/components/CommentBottomSheet";

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

  return (
    <SafeAreaView
      style={{
        backgroundColor: `${Colors.light.background}`,
        height: Dimensions.get("screen").height,
        flex: 1,
      }}
    >
      <ScrollView style={{ marginTop: 48 }}>
        <Card
          heading={item.heading}
          imageUrl={item.imageUrl}
          content={item.content}
          author={item.author}
          authorImage={item.authorImage}
          details={item.details}
          full={true}
          setShowCommentSheet={setShowCommentSheet}
        />
      </ScrollView>
      {showCommentSheet && (
        <CommentBottomSheet close={() => setShowCommentSheet(false)} />
      )}
    </SafeAreaView>
  );
};

export default SingleNews;
