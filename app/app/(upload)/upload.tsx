import { View, Text, Dimensions, Share } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { styles } from "@/constants/styles";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";
import uploadPage from "@/locales/uploadPage.json";

const About = () => {
  const [language, setLanguage] = useState(
    useSelector((state) => state.language.data)
  );

  return (
    <SafeAreaView
      style={{
        backgroundColor: `${Colors.light.background}`,
        height: Dimensions.get("screen").height,
        flex: 1,
      }}
    >
      <ScrollView
        style={{
          marginTop: 56,
          backgroundColor: Colors.light.white,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 32,
            paddingVertical: 16,
          }}
        >
          <Text
            style={{
              ...styles.Subheading2,
              fontSize: 22,
              color: Colors.light.subheading,
            }}
          >
            {uploadPage.shareContent[language]}
          </Text>
        </View>
        <View
          style={{
            paddingVertical: 0,
            paddingHorizontal: 24,
          }}
        >
          <TouchableOpacity
            style={{
              ...styles.buttonContainer,
              flex: 1,
              justifyContent: "space-between",
              paddingHorizontal: 16,
            }}
            onPress={() => router.push("/upload_video")}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <Feather name="play-circle" size={24} color="#fff" />
              <Text style={styles.button2}>
                {uploadPage.shareVideo[language]}
              </Text>
            </View>
            <Feather name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.buttonContainer,
              flex: 1,
              justifyContent: "space-between",
              paddingHorizontal: 16,
            }}
            onPress={() => router.push("/upload_image")}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <Feather name="image" size={24} color="#fff" />
              <Text style={styles.button2}>
                {uploadPage.postImage[language]}
              </Text>
            </View>
            <Feather name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.buttonContainer,
              flex: 1,
              justifyContent: "space-between",
              paddingHorizontal: 16,
            }}
            onPress={() => router.push("/upload_article")}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              {/* <Feather name="play-circle" size={24} color="#fff" /> */}
              <Ionicons name="text-sharp" size={24} color="#fff" />
              <Text style={styles.button2}>
                {uploadPage.writeArticle[language]}
              </Text>
            </View>
            <Feather name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default About;
