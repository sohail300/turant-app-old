import {
  View,
  Text,
  Dimensions,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import {
  FlatList,
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
import * as ImagePicker from "expo-image-picker";
import AntDesign from "@expo/vector-icons/AntDesign";

const UploadImage = () => {
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

  const [selectedImages, setSelectedImages] = useState([]);

  const handleImagePick = async () => {
    // Request permission to access photos
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access media library is required!");
      return;
    }

    // Open the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.fileName || `image-${Date.now()}.jpg`,
        type: "image/jpeg",
      }));

      // Add new images to the selectedImages state
      setSelectedImages((prev) => [...prev, ...newImages].slice(0, 5)); // Limit to 5 images
    }
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (selectedImages.length === 0) {
      alert("Please select at least one image!");
      return;
    }

    const formData = new FormData();

    // Append article data
    formData.append("title", title);
    formData.append("content", description);
    formData.append("language", language);

    // Append selected images
    selectedImages.forEach((image, index) => {
      formData.append(`image`, image);
    });

    try {
      const response = await fetch(`${baseURL}/upload/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // Send as multipart form
      });

      const result = await response.json();
      if (response.ok) {
        alert("Article uploaded successfully!");
        setSelectedImages([]); // Clear selected images
      } else {
        console.error(result);
        alert("Failed to upload article. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  };

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
                {uploadPage.postImage[language]}
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
                    borderColor: "#ccc",
                    borderWidth: 1,
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#777",
                      textAlign: "center",
                    }}
                  >
                    {uploadPage.browse[language]}
                  </Text>
                  <TouchableOpacity
                    onPress={handleImagePick}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 24,
                      borderRadius: 8,
                      marginTop: 16,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Feather
                      name="upload"
                      size={24}
                      color={Colors.light.accent}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.light.accent,
                        marginLeft: 8,
                      }}
                    >
                      {uploadPage.upload[language]}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Preview Section */}
                <FlatList
                  data={selectedImages}
                  horizontal
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{ marginTop: 16 }}
                  renderItem={({ item, index }) => (
                    <View style={fileStyles.imagePreview}>
                      <Pressable
                        style={fileStyles.removeIcon}
                        onPress={() => handleRemoveImage(index)}
                      >
                        <AntDesign name="closecircle" size={16} color="red" />
                      </Pressable>
                      <Image
                        source={{ uri: item.uri }}
                        style={fileStyles.image}
                        resizeMode="cover"
                      />
                    </View>
                  )}
                />
              </View>
              <View style={{ marginVertical: 12 }}>
                <Text style={{ ...styles.details, textAlign: "center" }}>
                  {uploadPage.imageSupportedFormats[language]}
                </Text>
                <Text style={{ ...styles.details, textAlign: "center" }}>
                  {uploadPage.imageMaximumFileSize[language]}
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
                      placeholder="Description"
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
                      Hide Text Editor
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
                      Show Text Editor
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
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default UploadImage;

const fileStyles = StyleSheet.create({
  imagePreview: {
    width: 80,
    height: 80,
    marginRight: 8,
    position: "relative", // Ensure the parent container has position set
  },
  image: {
    width: "100%", // Adjust to fill the container fully
    height: "100%", // Adjust to fill the container fully
    borderRadius: 8,
  },
  removeIcon: {
    position: "absolute",
    top: 0, // Slightly outside the image for better visibility
    right: 0, // Slightly outside the image for better visibility
    borderRadius: 12,
    padding: 4,
    zIndex: 50,
  },
});
