import {
  View,
  Text,
  Dimensions,
  Share,
  Image,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { styles } from "@/constants/styles";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import RedText from "@/components/RedText";
import MarkdownEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import RenderHtml from "react-native-render-html";

const UploadVideo = () => {
  const [description, setDescription] = useState("<div><b>bsnjdjdjd</b></div>");
  const richText = useRef();

  const handleHead = ({ tintColor }) => (
    <Text style={{ color: tintColor }}>H1</Text>
  );

  const handleContentChange = (descriptionText) => {
    console.log("descriptionText:", descriptionText);
    setDescription(descriptionText);
  };

  const tagsStyles = {
    b: {
      color: "black",
    },
    i: {
      color: "gray",
    },
    u: {
      color: "blue",
    },
    div: {
      marginBottom: 10,
    },
  };

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
        <KeyboardAvoidingView behavior="padding">
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 24,
              paddingVertical: 12,
            }}
          >
            <Text
              style={{
                ...styles.Subheading2,
                fontSize: 22,
                color: Colors.light.subheading,
              }}
            >
              Share a Video
            </Text>
          </View>
          <View
            style={{
              paddingVertical: 8,
              paddingHorizontal: 24,
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 32,
                paddingVertical: 32,
                borderColor: Colors.light.border,
                borderWidth: 1,
                borderRadius: 5,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 24,
                  borderStyle: "dashed",
                  borderColor: Colors.light.border,
                  borderWidth: 1,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    ...styles.Subheading2,
                    color: Colors.light.subheading,
                    textAlign: "center",
                  }}
                >
                  Drag and drop a video or browse to upload
                </Text>
                <TouchableOpacity
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderRadius: 8,
                    marginTop: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Feather
                    name="upload"
                    size={24}
                    color={Colors.light.accent}
                  />
                  <Text
                    style={{ ...styles.button2, color: Colors.light.accent }}
                  >
                    Upload
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ marginVertical: 12 }}>
              <Text style={{ ...styles.details, textAlign: "center" }}>
                The video duration should be between 1 and 5 minutes
              </Text>
              <Text style={{ ...styles.details, textAlign: "center" }}>
                Supported formats: MP4
              </Text>
              <Text style={{ ...styles.details, textAlign: "center" }}>
                Maximum file size: 10 MB
              </Text>
            </View>
            <View style={{ marginTop: 12 }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.light.border,
                  borderRadius: 8,
                  marginTop: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                }}
              >
                <TextInput
                  style={styles.ContentText}
                  placeholder="Title"
                  placeholderTextColor={Colors.light.details}
                />
              </View>
            </View>
            <View style={{ marginTop: 16 }}>
              {/* <RenderHtml
                contentWidth={300}
                source={{ html: description }}
                tagsStyles={tagsStyles}
              /> */}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.light.border,
                  borderRadius: 8,
                  marginTop: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                }}
              >
                <RichEditor
                  ref={richText}
                  onChange={handleContentChange}
                  initialHeight={300}
                  value={description}
                />
                <RichToolbar
                  editor={richText}
                  actions={[
                    actions.setBold,
                    actions.setItalic,
                    actions.setUnderline,
                    actions.setStrikethrough,
                    actions.insertBulletsList,
                    actions.insertOrderedList,
                    actions.insertLine,
                  ]}
                  iconMap={{ [actions.heading1]: handleHead }}
                />
              </View>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.light.accent,
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 8,
                marginVertical: 24,
              }}
            >
              <Text style={{ color: Colors.light.white }}>Save</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UploadVideo;
