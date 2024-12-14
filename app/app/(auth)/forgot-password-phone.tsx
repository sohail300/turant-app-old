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
import { router, useLocalSearchParams } from "expo-router";
import { OtpInput } from "react-native-otp-entry";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseURL } from "@/constants/config";
import { useSelector } from "react-redux";

export default function Signup() {
  const { phone } = useLocalSearchParams();
  console.log(phone);

  const [language, setLanguage] = useState(
    useSelector((state) => state.language.data)
  );

  const validate = Yup.object({
    otp: Yup.string()
      .required("OTP is required")
      .length(4, "OTP must be 4 digits"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    cpassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  async function resendOTP() {
    try {
      const response = await fetch(`${baseURL}/auth/send-forgot-password-otp`, {
        method: "POST", // Use POST method for the request
        headers: {
          "Content-Type": "application/json", // Ensure the request is sent as JSON
        },
        body: JSON.stringify({
          medium: "phone",
          phone: phone,
        }),
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
    <SafeAreaView style={style.container}>
      <KeyboardAvoidingView behavior="height" style={style.keyboardView}>
        <ScrollView
          style={style.scrollView}
          contentContainerStyle={style.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={style.card}>
            <View style={style.headerContainer}>
              <Image source={logo} style={style.logo} />
              <Text style={style.title}>Change Password</Text>
              <Text style={style.subtitle}>
                We have send 4 digit code to (+91){phone}
              </Text>
            </View>

            <Formik
              initialValues={{ otp: "", password: "", cpassword: "" }}
              validationSchema={validate}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const response = await fetch(
                    `${baseURL}/auth/verify-forgot-password-otp`,
                    {
                      method: "POST", // Use POST method for the request
                      headers: {
                        "Content-Type": "application/json", // Ensure the request is sent as JSON
                      },
                      body: JSON.stringify({
                        medium: "phone",
                        phone: phone,
                        otp: values.otp,
                        password: values.password,
                      }),
                    }
                  );

                  const data = await response.json();
                  console.log(data);
                  if (response.ok) {
                    setSubmitting(false);
                    router.push("/login");
                  } else {
                    alert("Enter the correct OTP");
                  }
                } catch (error) {
                  console.log("error", error);
                  alert("An error occurred. Please try again.");
                }
              }}
            >
              {({
                setFieldValue,
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
              }) => (
                <View style={style.formContainer}>
                  <View style={style.inputGroup}>
                    <Text style={{ ...style.inputLabel, textAlign: "left" }}>
                      Enter OTP
                    </Text>
                    <OtpInput
                      numberOfDigits={4}
                      autoFocus={false}
                      focusColor={Colors.light.border}
                      focusStickBlinkingDuration={500}
                      onTextChange={(text) => setFieldValue("otp", text)}
                      onFilled={(text) => setFieldValue("otp", text)}
                      textInputProps={{
                        accessibilityLabel: "One-Time Password",
                      }}
                      theme={{
                        pinCodeContainerStyle: {
                          ...style.otpInput,
                          borderColor:
                            touched.otp && errors.otp
                              ? "red"
                              : Colors.light.border,
                        },
                      }}
                    />
                    {touched.otp && errors.otp && (
                      <ErrorText>{errors.otp}</ErrorText>
                    )}
                  </View>

                  <View style={style.inputGroup}>
                    <Text style={{ ...style.inputLabel, textAlign: "left" }}>
                      Password
                    </Text>
                    <TextInput
                      value={values.password}
                      keyboardType="default"
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      placeholder="Enter your password"
                      placeholderTextColor={Colors.light.details}
                      secureTextEntry={true}
                      style={[
                        style.textInput,
                        touched.password && errors.password && style.inputError,
                      ]}
                    />
                    {touched.password && errors.password && (
                      <ErrorText>{errors.password}</ErrorText>
                    )}
                  </View>

                  <View style={style.inputGroup}>
                    <Text style={{ ...style.inputLabel, textAlign: "left" }}>
                      Confirm Password
                    </Text>
                    <TextInput
                      value={values.cpassword}
                      keyboardType="default"
                      onChangeText={handleChange("cpassword")}
                      onBlur={handleBlur("cpassword")}
                      placeholder="Enter your password"
                      placeholderTextColor={Colors.light.details}
                      secureTextEntry={true}
                      style={[
                        style.textInput,
                        touched.cpassword &&
                          errors.cpassword &&
                          style.inputError,
                      ]}
                    />
                    {touched.cpassword && errors.cpassword && (
                      <ErrorText>{errors.cpassword}</ErrorText>
                    )}
                  </View>

                  <TouchableOpacity
                    disabled={isSubmitting}
                    style={styles.buttonContainer}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.button}>Reset Password</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
            <View style={style.resendContainer}>
              <Text style={style.resendText}>Not received OTP?</Text>
              <RedText style={style.resendButton} onPress={() => resendOTP()}>
                Resend Now
              </RedText>
            </View>
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
    marginTop: 0,
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
