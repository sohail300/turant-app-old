import { View, Text, Dimensions } from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { styles } from "@/constants/styles";
import Feather from "@expo/vector-icons/Feather";
import "react-markdown-editor-lite/lib/index.css";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import RenderHtml from "react-native-render-html";
import DropDownPicker from "react-native-dropdown-picker";
import uploadPage from "@/locales/uploadPage.json";
import { useSelector } from "react-redux";
import { baseURL } from "@/constants/config";
import { router } from "expo-router";

const UploadArticle = () => {
  const [language, setLanguage] = useState(
    useSelector((state) => state.language.data)
  );
  const token = useSelector((state) => state.token.data);

  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [lanaguages, setLanaguages] = useState([
    { label: "English", value: "English" },
    { label: "Hindi", value: "Hindi" },
  ]);

  const [textEditorShow, setTextEditorShow] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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

  async function handleSubmit() {
    const response = await fetch(`${baseURL}/upload/article`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        title: title,
        content: description,
        language: language,
      }),
    });
    const data = await response.json();
    console.log("data", data);
    router.push("/upload");
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          backgroundColor: `${Colors.light.background}`,
          flex: 1,
        }}
      >
        <View style={{ flex: 1, height: Dimensions.get("screen").height - 56 }}>
          <ScrollView
            style={{
              marginTop: 56,
              backgroundColor: Colors.light.white,
            }}
            contentContainerStyle={{
              flexGrow: 1, // Ensures content doesn't scroll beyond constraints
            }}
            keyboardShouldPersistTaps="handled"
          >
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
                {uploadPage.writeArticle[language]}
              </Text>
            </View>
            <View
              style={{
                paddingVertical: 8,
                paddingHorizontal: 24,
              }}
            >
              <View>
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
                    placeholder={uploadPage.title[language]}
                    placeholderTextColor={Colors.light.details}
                    value={title}
                    onChangeText={(text) => setTitle(text)}
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
                    marginTop: 8,
                  }}
                >
                  <View style={{ flex: 1, maxHeight: 300 }}>
                    <RichEditor
                      ref={richText}
                      initialHeight={300}
                      onChange={handleContentChange}
                      value={description}
                      placeholder={uploadPage.description[language]}
                      style={{
                        maxHeight: 300,
                        borderColor: Colors.light.border,
                        borderWidth: 1,
                      }}
                      scrollEnabled={true}
                      scrollViewProps={{
                        showsVerticalScrollIndicator: true,
                        indicatorStyle: Colors.light.accent, // For iOS
                        style: {
                          // Custom scrollbar style for Android
                          scrollbarFadeDuration: 1000,
                          scrollbarThumbTintColor: Colors.light.accent,
                          scrollbarTrackTintColor: "transparent",
                        },
                      }}
                    />
                  </View>

                  {textEditorShow && (
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
                  )}
                </View>
                {textEditorShow ? (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 8,
                    }}
                    onPress={() => setTextEditorShow(false)}
                  >
                    <Text style={{ color: Colors.light.subheading }}>
                      {uploadPage.hideTextEditor[language]}
                    </Text>
                    <Feather
                      name="chevron-down"
                      size={24}
                      color={Colors.light.text}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 8,
                    }}
                    onPress={() => setTextEditorShow(true)}
                  >
                    <Text style={{ color: Colors.light.subheading }}>
                      {uploadPage.showTextEditor[language]}
                    </Text>
                    <Feather
                      name="chevron-up"
                      size={24}
                      color={Colors.light.text}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <DropDownPicker
                style={{
                  marginTop: 24,
                  borderColor: Colors.light.border,
                  borderWidth: 1,
                  width: "40%",
                }}
                listChildContainerStyle={{
                  backgroundColor: Colors.light.background,
                  width: "40%",
                }}
                dropDownContainerStyle={{
                  width: "40%",
                  borderColor: Colors.light.border,
                  borderWidth: 1,
                }}
                open={languageOpen}
                value={selectedLanguage}
                items={lanaguages}
                setOpen={setLanguageOpen}
                setValue={setSelectedLanguage}
                setItems={setLanaguages}
                placeholder="Select Language"
                zIndex={2000}
                zIndexInverse={1000}
                maxHeight={200}
                listMode="SCROLLVIEW"
              />
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "flex-end",
                paddingHorizontal: 24,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.light.accent,
                  paddingVertical: 12,
                  paddingHorizontal: 56,
                  borderRadius: 8,
                  marginVertical: 24,
                }}
                onPress={() => handleSubmit()}
              >
                <Text
                  style={{ color: Colors.light.white, textAlign: "center" }}
                >
                  {uploadPage.save[language]}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default UploadArticle;
