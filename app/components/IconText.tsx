// components/Heading.tsx
import { Text, TextStyle, StyleSheet } from "react-native";
import React from "react";
import { styles } from "@/constants/styles";
import { useFontLoaded } from "@/context/FontContext";

const IconText = ({
  children,
  style,
  ...props
}: {
  children: React.ReactNode;
  style?: TextStyle;
  [x: string]: any;
}) => {
  const fontsLoaded = useFontLoaded();

  return (
    <Text style={[styles.iconText, style]} {...props}>
      {children}
    </Text>
  );
};

export default IconText;
