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

export default function Signup() {
  const [mailOTP, setMailOTP] = useState("");
  const [phoneOTP, setPhoneOTP] = useState("");

  const handleSubmit = async () => {
    try {
      const phone = await AsyncStorage.getItem("phone");

      const response = await fetch(`${baseURL}/auth/verify-register-otp`, {
        method: "POST", // Use POST method for the request
        headers: {
          "Content-Type": "application/json", // Ensure the request is sent as JSON
        },
        body: JSON.stringify({
          email: mailOTP,
          phone: phoneOTP,
        }),
      });

      if (!response.ok) {
        // Handle any errors (non-2xx responses)
        const errorText = await response.text(); // Read the response body as text
        console.error("Error:", errorText);
        throw new Error("Request failed with status " + response.status);
      }

      const data = await response.json();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

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
                Verify Your Mail And Phone
              </Text>

              <Text
                style={{
                  ...styles.ContentText,
                  fontSize: 16,
                  lineHeight: 24,
                  textAlign: "center",
                }}
              >
                We've sent a 4-digit code to shubham@gmail.com and (+91) 99999
                99999
              </Text>
            </View>

            <View style={{ gap: 8 }}>
              <Text style={styles.Subheading2}>Mail OTP</Text>
              <OtpInput
                numberOfDigits={4}
                focusColor={Colors.light.border}
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
              <RedText style={{ textAlign: "right" }}>Resend OTP</RedText>
            </View>

            <View style={{ gap: 8 }}>
              <Text style={styles.Subheading2}>Phone OTP</Text>
              <OtpInput
                numberOfDigits={4}
                focusColor={Colors.light.border}
                focusStickBlinkingDuration={500}
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
              <RedText style={{ textAlign: "right" }}>Resend OTP</RedText>
            </View>

            <View>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => router.push("/")}
              >
                <Text style={styles.button} onPress={() => handleSubmit()}>
                  Verify
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
