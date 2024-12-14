import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { styles } from "@/constants/styles";
import { router } from "expo-router";
import RedText from "@/components/RedText";
import { OtpInput } from "react-native-otp-entry";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseURL } from "@/constants/config";
import { useSelector } from "react-redux";
import verifyPage from "@/locales/verifyPage.json";

export default function Signup() {
  const token = useSelector((state) => state.token.data);

  const [language, setLanguage] = useState(
    useSelector((state) => state.language.data)
  );

  const [mailOTP, setMailOTP] = useState("");
  const [phoneOTP, setPhoneOTP] = useState("");

  const handleSubmit = async () => {
    try {
      if (
        mailOTP === "" ||
        phoneOTP === "" ||
        mailOTP.length !== 4 ||
        phoneOTP.length !== 4
      ) {
        alert("Please enter OTP");
        return;
      }

      const response = await fetch(`${baseURL}/auth/verify-register-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: mailOTP,
          phone: phoneOTP,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        router.push("/");
      } else {
        console.error(data.message);
        alert("Enter the correct OTP");
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred. Please try again.");
    }
  };

  async function resendOTP() {
    try {
      const response = await fetch(`${baseURL}/auth/send-register-otp`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        alert("OTP sent successfully");
      }
    } catch (error) {
      console.log("error", error);
      alert("An error occurred. Please try again.");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.white }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingVertical: 24,
            paddingHorizontal: 16,
            paddingBottom: 0,
            gap: 24,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ padding: 20, gap: 32 }}>
            <View>
              <Text
                style={{
                  ...styles.Subheading2,
                  fontSize: 26,
                  lineHeight: 42,
                  textAlign: "center",
                }}
              >
                {verifyPage.verifyMailPhone[language]}
              </Text>

              <Text
                style={{
                  ...styles.ContentText,
                  fontSize: 16,
                  lineHeight: 24,
                  textAlign: "center",
                }}
              >
                {verifyPage.sentOTP[language]}
              </Text>
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ ...styles.Subheading2, textAlign: "left" }}>
                {verifyPage.mailOTP[language]}
              </Text>
              <OtpInput
                numberOfDigits={4}
                focusColor={Colors.light.border}
                autoFocus={false}
                focusStickBlinkingDuration={500}
                onTextChange={(text) => setMailOTP(text)}
                onFilled={(text) => console.log(`OTP is ${text}`)}
                textInputProps={{
                  accessibilityLabel: "One-Time Password",
                }}
                theme={{
                  pinCodeContainerStyle: {
                    aspectRatio: 1,
                    width: 64,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: Colors.light.border,
                  },
                }}
              />
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ ...styles.Subheading2, textAlign: "left" }}>
                {verifyPage.phoneOTP[language]}
              </Text>
              <OtpInput
                numberOfDigits={4}
                focusColor={Colors.light.border}
                focusStickBlinkingDuration={500}
                autoFocus={false}
                onTextChange={(text) => setPhoneOTP(text)}
                onFilled={(text) => console.log(`OTP is ${text}`)}
                textInputProps={{
                  accessibilityLabel: "One-Time Password",
                }}
                theme={{
                  pinCodeContainerStyle: {
                    aspectRatio: 1,
                    width: 64,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: Colors.light.border,
                  },
                }}
              />
              <RedText
                style={{ textAlign: "right", marginTop: 24 }}
                onPress={() => resendOTP()}
              >
                {verifyPage.resend[language]}
              </RedText>
            </View>

            <View>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => handleSubmit()}
              >
                <Text style={styles.button} onPress={() => handleSubmit()}>
                  {verifyPage.verify[language]}
                </Text>
                <Feather name="arrow-right-circle" size={24} color="#fff" />
              </TouchableOpacity>
              {/* <RedText style={{ textAlign: "right" }}>
                Change email or phone
              </RedText> */}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
});
