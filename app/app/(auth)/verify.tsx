import React from "react";
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

export default function Signup() {
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
                onTextChange={(text) => console.log(text)}
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
                onTextChange={(text) => console.log(text)}
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
                <Text style={styles.button}>Verify</Text>
                <Feather name="arrow-right-circle" size={24} color="#fff" />
              </TouchableOpacity>
              <RedText style={{ textAlign: "right" }}>
                Change email or phone
              </RedText>
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
