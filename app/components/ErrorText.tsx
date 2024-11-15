import { View, Text, StyleSheet, TextStyle } from "react-native";
import React from "react";
import { styles } from "@/constants/styles";

const ErrorText = ({
  children,
  style,
  ...props
}: {
  children: React.ReactNode;
  style?: TextStyle;
  [x: string]: any;
}) => {
  return (
    <Text {...props} style={{ ...styles.errorText, ...style }}>
      {children}
    </Text>
  );
};

export default ErrorText;
