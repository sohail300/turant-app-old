// components/Heading.tsx
import { Text, TextStyle, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { styles } from "@/constants/styles";
import { useFontLoaded } from "@/context/FontContext";
import RedText from "./RedText";

const ContentText = ({
  children,
  style,
  full,
  ...props
}: {
  children: React.ReactNode;
  style?: TextStyle;
  [x: string]: any;
}) => {
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
          <RedText>Read More</RedText>
        </>
      )}
    </View>
  );
};

export default ContentText;
