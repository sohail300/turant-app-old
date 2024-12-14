// components/Heading.tsx
import { Text, TextStyle, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { styles } from "@/constants/styles";
import { useFontLoaded } from "@/context/FontContext";
import RedText from "./RedText";
import { useSelector } from "react-redux";
import { router } from "expo-router";
import card from "@/locales/card.json";

const ContentText = ({
  children,
  style,
  full,
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
  ...props
}: {
  children: React.ReactNode;
  style?: TextStyle;
  [x: string]: any;
}) => {
  const language = useSelector((state) => state.language.data);

  return (
    <View>
      {full ? (
        <Text style={[styles.ContentText, style]} {...props}>
          {children}
        </Text>
      ) : (
        <>
          <Text
            style={[styles.ContentText, style]}
            {...props}
            numberOfLines={5}
          >
            {children}
          </Text>
          <RedText
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
            {card.readMore[language]}
          </RedText>
        </>
      )}
    </View>
  );
};

export default ContentText;
