import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Feather from "@expo/vector-icons/Feather";
import { styles } from "@/constants/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import DropDownPicker from "react-native-dropdown-picker";
import { Link } from "expo-router";
import { router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "@/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import { changeLanguage } from "@/store/LanguageSlice";
import setupPage from "@/locales/setupPage.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { changeLocation } from "@/store/LocationSlice";

const setup = () => {
  const language = useSelector((state) => state.language.data);
  const location = useSelector((state) => state.location.data);
  const dispatch = useDispatch();

  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [selectedState, setSelectedState] = useState(location.countryState);
  const [selectedCity, setSelectedCity] = useState(location.city);
  const [states, setStates] = useState([
    { label: "Andhra Pradesh", value: "andhra_pradesh" },
    { label: "Arunachal Pradesh", value: "arunachal_pradesh" },
    { label: "Assam", value: "assam" },
    { label: "Bihar", value: "bihar" },
    { label: "Chhattisgarh", value: "chhattisgarh" },
    { label: "Goa", value: "goa" },
    { label: "Gujarat", value: "gujarat" },
    { label: "Haryana", value: "haryana" },
    { label: "Himachal Pradesh", value: "himachal_pradesh" },
    { label: "Jharkhand", value: "jharkhand" },
    { label: "Karnataka", value: "karnataka" },
    { label: "Kerala", value: "kerala" },
    { label: "Madhya Pradesh", value: "madhya_pradesh" },
    { label: "Maharashtra", value: "maharashtra" },
    { label: "Manipur", value: "manipur" },
    { label: "Meghalaya", value: "meghalaya" },
    { label: "Mizoram", value: "mizoram" },
    { label: "Nagaland", value: "nagaland" },
    { label: "Odisha", value: "odisha" },
    { label: "Punjab", value: "punjab" },
    { label: "Rajasthan", value: "rajasthan" },
    { label: "Sikkim", value: "sikkim" },
    { label: "Tamil Nadu", value: "tamil_nadu" },
    { label: "Telangana", value: "telangana" },
    { label: "Tripura", value: "tripura" },
    { label: "Uttar Pradesh", value: "uttar_pradesh" },
    { label: "Uttarakhand", value: "uttarakhand" },
    { label: "West Bengal", value: "west_bengal" },
    { label: "Andaman and Nicobar Islands", value: "andaman_and_nicobar" },
    { label: "Chandigarh", value: "chandigarh" },
    {
      label: "Dadra and Nagar Haveli and Daman and Diu",
      value: "dadra_and_nagar_haveli_and_daman_and_diu",
    },
    { label: "Lakshadweep", value: "lakshadweep" },
    { label: "Delhi", value: "delhi" },
    { label: "Puducherry", value: "puducherry" },
    { label: "Ladakh", value: "ladakh" },
    { label: "Jammu and Kashmir", value: "jammu_and_kashmir" },
  ]);

  const [cities, setCities] = useState([
    { label: "Ranchi", value: "ranchi" },
    { label: "Jamshedpur", value: "jamshedpur" },
    { label: "Dhanbad", value: "dhanbad" },
    { label: "Bokaro", value: "bokaro" },
    { label: "Deoghar", value: "deoghar" },
    { label: "Hazaribagh", value: "hazaribagh" },
    { label: "Giridih", value: "giridih" },
    { label: "Ramgarh", value: "ramgarh" },
    { label: "Phusro", value: "phusro" },
    { label: "Gumia", value: "gumia" },
    { label: "Chatra", value: "chatra" },
    { label: "Koderma", value: "koderma" },
    { label: "Simdega", value: "simdega" },
    { label: "Chaibasa", value: "chaibasa" },
    { label: "Medininagar", value: "medininagar" },
    { label: "Lohardaga", value: "lohardaga" },
    { label: "Pakur", value: "pakur" },
    { label: "Sahibganj", value: "sahibganj" },
    { label: "Jhumri Telaiya", value: "jhumri_telaiya" },
    { label: "Ghatshila", value: "ghatshila" },
    { label: "Daltonganj", value: "daltonganj" },
    { label: "Khunti", value: "khunti" },
    { label: "Latehar", value: "latehar" },
    { label: "Dumka", value: "dumka" },
    { label: "Gharwa", value: "gharwa" },
  ]);

  const onStateOpen = () => {
    setCityOpen(false);
  };

  const onCityOpen = () => {
    setStateOpen(false);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 24, paddingBottom: 0, gap: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              ...styles.Subheading2,
              fontSize: 28,
              lineHeight: 42,
              textAlign: "center",
            }}
          >
            {setupPage.chooseYourlanguage[language]}
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable
              style={{
                backgroundColor: "#FF747666",
                shadowColor: "#0000001A",
                shadowOffset: { width: 4, height: 4 },
                shadowRadius: 25,
                shadowOpacity: 0,
                padding: 10,
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                aspectRatio: 1,
                position: "relative",
              }}
              onPress={() => dispatch(changeLanguage("hindi"))}
            >
              {language === "hindi" && (
                <FontAwesome
                  name="check-circle"
                  size={32}
                  color={Colors.light.accent}
                  style={{ position: "absolute", top: 10, right: 10 }}
                />
              )}

              <Text
                style={{
                  ...styles.Subheading2,
                  fontSize: 48,
                  lineHeight: 72,
                  color: styles.Subheading.color,
                }}
              >
                हि
              </Text>
              <Text
                style={{
                  ...styles.ContentText,
                  fontSize: 24,
                  lineHeight: 36,
                  color: styles.Subheading.color,
                }}
              >
                Hindi
              </Text>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: "#FFE0C8",
                shadowColor: "#0000001A",
                shadowOffset: { width: 4, height: 4 },
                shadowRadius: 25,
                shadowOpacity: 0,
                padding: 10,
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                aspectRatio: 1,
              }}
              onPress={() => {
                dispatch(changeLanguage("english"));
              }}
            >
              {language === "english" && (
                <FontAwesome
                  name="check-circle"
                  size={32}
                  color={Colors.light.accent}
                  style={{ position: "absolute", top: 10, right: 10 }}
                />
              )}
              <Text
                style={{
                  ...styles.Subheading2,
                  fontSize: 48,
                  lineHeight: 72,
                  color: styles.Subheading.color,
                }}
              >
                E
              </Text>
              <Text
                style={{
                  ...styles.ContentText,
                  fontSize: 24,
                  lineHeight: 36,
                  color: styles.Subheading.color,
                }}
              >
                English
              </Text>
            </Pressable>
          </View>
          <Text
            style={{
              ...styles.Subheading2,
              fontSize: 28,
              lineHeight: 42,
              textAlign: "center",
            }}
          >
            {setupPage.chooseYourlanguage[language]}
          </Text>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                ...styles.Subheading2,
                marginBottom: 8,
              }}
            >
              {setupPage.chooseYourlanguage[language]}
            </Text>
            <DropDownPicker
              open={stateOpen}
              value={selectedState}
              items={states}
              setOpen={setStateOpen}
              setValue={setSelectedState}
              setItems={setStates}
              searchable={true}
              placeholder={setupPage.selectYourState[language]}
              zIndex={2000}
              zIndexInverse={1000}
              onOpen={onStateOpen}
              maxHeight={200}
              searchTextInputProps={{
                autoCorrect: false,
              }}
              listMode="SCROLLVIEW"
              onChangeValue={(value) =>
                dispatch(
                  changeLocation({ ...location, countryState: value as string })
                )
              }
            />

            <Text
              style={{
                ...styles.Subheading2,
                marginTop: 20,
                marginBottom: 8,
              }}
            >
              {setupPage.chooseYourlanguage[language]}
            </Text>
            <DropDownPicker
              open={cityOpen}
              value={selectedCity}
              items={cities}
              setOpen={setCityOpen}
              setValue={setSelectedCity}
              setItems={setCities}
              searchable={true}
              placeholder={setupPage.selectYourCity[language]}
              zIndex={1000}
              zIndexInverse={2000}
              onOpen={onCityOpen}
              maxHeight={200}
              searchTextInputProps={{
                autoCorrect: false,
              }}
              listMode="SCROLLVIEW"
              onChangeValue={(value) =>
                dispatch(changeLocation({ ...location, city: value as string }))
              }
            />
          </View>

          <Pressable
            style={styles.buttonContainer}
            onPress={async () => {
              AsyncStorage.setItem("isAppSetup", "true");
              router.replace("/welcome");
            }}
          >
            <Text style={styles.button}>
              {setupPage.chooseYourlanguage[language]}
            </Text>
            <Feather name="arrow-right-circle" size={24} color="#fff" />
          </Pressable>

          {/* <Text>{location.countryState}</Text> */}
          {/* <Text>{location.city}</Text> */}
          <View style={{ paddingBottom: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default setup;
