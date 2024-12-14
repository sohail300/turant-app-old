import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { styles } from "@/constants/styles";
import { Formik } from "formik";
import { TextInput } from "react-native-gesture-handler";
import * as Yup from "yup";
import ErrorText from "@/components/ErrorText";
import logo from "@/assets/images/logo-red.png";
import RedText from "@/components/RedText";
import { router } from "expo-router";
import { OtpInput } from "react-native-otp-entry";
import { baseURL } from "@/constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import forgotPasswordPage from "@/locales/forgotPasswordPage.json";
import signupPage from "@/locales/signupPage.json";
import { useSelector } from "react-redux";

export default function Signup() {
  const [language, setLanguage] = useState(
    useSelector((state) => state.language.data)
  );

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedMedium, setSelectedMedium] = useState<string | null>(null); // This will store the selected medium: 'phone' or 'email'

  const handleSubmit = async () => {
    try {
      let bodyObject;
      if (selectedMedium === "phone") {
        bodyObject = {
          medium: "phone",
          phone: phone,
        };
      } else {
        bodyObject = {
          medium: "email",
          email: email,
        };
      }

      const response = await fetch(`${baseURL}/auth/send-forgot-password-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure the request is sent as JSON
        },
        body: JSON.stringify(bodyObject),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        if (selectedMedium === "phone") {
          await AsyncStorage.setItem("phone", JSON.stringify(phone));
          router.push("/forgot-password-phone");
        } else if (selectedMedium === "email") {
          await AsyncStorage.setItem("email", JSON.stringify(email));
          router.push("/forgot-password-email");
        }
      } else {
        alert("Enter the correct details");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
      console.log("error", error);
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={style.keyboardView}
      >
        <ScrollView
          style={style.scrollView}
          contentContainerStyle={style.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={style.card}>
            <View style={style.headerContainer}>
              <Image source={logo} style={style.logo} />
              <Text style={style.title}>
                {forgotPasswordPage.changePassword[language]}
              </Text>
              <Text style={style.subtitle}>
                {forgotPasswordPage.chooseMedium[language]}
              </Text>
            </View>

            {/* There will be two radio buttons for phone and email */}
            <View style={style.formContainer}>
              <View style={style.inputGroup}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    style={[
                      style.radioButton,
                      selectedMedium === "phone" && style.selectedRadioButton,
                    ]}
                    onPress={() => setSelectedMedium("phone")}
                  >
                    <Text style={style.radioText}>
                      {signupPage.phone[language]}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      style.radioButton,
                      selectedMedium === "email" && style.selectedRadioButton,
                    ]}
                    onPress={() => setSelectedMedium("email")}
                  >
                    <Text style={style.radioText}>
                      {signupPage.email[language]}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {selectedMedium === "phone" && (
              <View style={style.inputGroup}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 16,
                  }}
                >
                  <View
                    style={{
                      padding: 10,
                      borderWidth: 1,
                      borderColor: Colors.light.border,
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                      marginRight: -1,
                    }}
                  >
                    <Text
                      style={[styles.ContentText, { color: Colors.light.text }]}
                    >
                      +91
                    </Text>
                  </View>
                  <TextInput
                    value={phone}
                    keyboardType="numeric"
                    onChangeText={setPhone}
                    placeholder={signupPage.enterPhone[language]}
                    placeholderTextColor={Colors.light.details}
                    style={[
                      styles.ContentText,
                      {
                        flex: 1,
                        borderColor: Colors.light.border,
                        borderWidth: 1,
                        borderTopRightRadius: 5,
                        borderBottomRightRadius: 5,
                        padding: 10,
                      },
                    ]}
                  />
                </View>
              </View>
            )}

            {selectedMedium === "email" && (
              <View style={style.inputGroup}>
                <TextInput
                  value={email}
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholder={signupPage.enterEmail[language]}
                  placeholderTextColor={Colors.light.details}
                  style={[
                    styles.ContentText,
                    {
                      borderColor: Colors.light.border,
                      borderWidth: 1,
                      borderRadius: 5,
                      padding: 10,
                      marginTop: 16,
                    },
                  ]}
                />
              </View>
            )}

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.button}>
                {forgotPasswordPage.sendOTP[language]}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={style.footer}>
            <Text style={style.footerText}>Powered By:</Text>
            <Text style={style.footerBrand}>Lok Vishwa Bharti</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.accent,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 0,
    minHeight: "100%",
  },
  card: {
    padding: 20,
    backgroundColor: Colors.light.white,
    borderRadius: 20,
    marginVertical: 24,
    marginTop: 40,
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
  },
  title: {
    fontFamily: "HindVadodara600",
    fontSize: 28,
    lineHeight: 36,
    textAlign: "center",
    marginTop: 16,
  },
  subtitle: {
    ...styles.details,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "HindVadodara500",
    textAlign: "center",
    color: "#6d6d6d",
    marginTop: 8,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  selectedRadioButton: {
    backgroundColor: Colors.light.accent, // Change to your selected button color
    color: Colors.light.white, // Change to your selected button text color
  },
  radioText: {
    fontFamily: "HindVadodara500",
    fontSize: 16,
    color: Colors.light.text,
  },
  spamContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  cantFindText: {
    ...styles.details,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "HindVadodara600",
  },
  spamText: {
    ...styles.details,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "HindVadodara500",
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    ...styles.Subheading2,
    fontSize: 16,
  },
  otpInput: {
    aspectRatio: 1,
    width: 64,
    borderRadius: 5,
    borderWidth: 1,
  },
  textInput: {
    ...styles.ContentText,
    borderColor: Colors.light.border,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  inputError: {
    borderColor: "red",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 4,
    marginTop: -16,
  },
  resendText: {
    ...styles.details,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "HindVadodara500",
  },
  resendButton: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "HindVadodara700",
  },
  footer: {
    flexDirection: "row",
    gap: 8,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    borderTopColor: Colors.light.border,
    borderTopWidth: 1,
    paddingVertical: 16,
  },
  footerText: {
    fontFamily: "HindVadodara400",
    fontSize: 20,
    lineHeight: 30,
    color: Colors.light.white,
  },
  footerBrand: {
    fontFamily: "HindVadodara600",
    fontSize: 20,
    lineHeight: 30,
    color: Colors.light.white,
  },
});
