// components/Heading.tsx
import { Text, TextStyle, StyleSheet } from "react-native";
import React from "react";
import { styles } from "@/constants/styles";
import { useFontLoaded } from "@/context/FontContext";

const Heading = ({
  children,
  style,
  ...props
}: {
  children: React.ReactNode;
  style?: TextStyle;
  [x: string]: any;
}) => {
  const fontsLoaded = useFontLoaded();

  console.log("Fonts loaded in Heading:", fontsLoaded);

  return (
    <Text style={[styles.heading, style]} {...props}>
      {children}
    </Text>
  );
};

export default Heading;
