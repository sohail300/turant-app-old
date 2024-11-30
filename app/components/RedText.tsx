// components/Heading.tsx
import { Text, TextStyle } from "react-native";
import React from "react";
import { styles } from "@/constants/styles";
import { useFontLoaded } from "@/context/FontContext";
import { TouchableOpacity } from "react-native-gesture-handler";

const RedText = ({
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
    <TouchableOpacity>
      <Text style={[styles.RedText, style]} {...props}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default RedText;
