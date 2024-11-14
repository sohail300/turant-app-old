import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import Feather from "@expo/vector-icons/Feather";
import { styles } from "@/constants/styles";

const setup = () => {
  return (
    <View>
      <Text style={{ ...styles.Subheading2, fontSize: 28, lineHeight: 42 }}>
        Choose Your Language
      </Text>
      <View>
        <View
          style={{
            backgroundColor: "#FF747666",
            shadowColor: "#0000001A",
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 25,
            shadowOpacity: 0,
            borderRadius: 10,
          }}
        >
          <Text>हि</Text>
          <Text>Hindi</Text>
        </View>
        <View
          style={{
            backgroundColor: "#FFE0C8",
            shadowColor: "#0000001A",
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 25,
            shadowOpacity: 0,
            borderRadius: 10,
          }}
        >
          <Text>E</Text>
          <Text>English</Text>
        </View>
      </View>
      <Text style={{ ...styles.Subheading2, fontSize: 28, lineHeight: 42 }}>
        Select Your Location
      </Text>

      <TouchableOpacity>
        <Text>Next</Text>
        <Feather name="arrow-right-circle" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default setup;
