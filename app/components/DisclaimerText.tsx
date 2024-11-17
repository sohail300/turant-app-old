import { StyleSheet, Text, TextStyle, View } from "react-native";
import React from "react";
import { styles } from "@/constants/styles";

const DisclaimerText = ({
  children,
  style,
  ...props
}: {
  children: React.ReactNode;
  style?: TextStyle;
  [x: string]: any;
}) => {
  return (
    <Text style={{ ...styles.disclaimerText, ...style }} {...props}>
      {children}
    </Text>
  );
};

export default DisclaimerText;
