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
import { baseURL } from "@/constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { changeAuth } from "@/store/AuthSlice";
import { changeToken } from "@/store/TokenSlice";

export default function Signup() {
  const [language, setLanguage] = useState(
    useSelector((state) => state.language.data)
  );
  const [location, setLocation] = useState(
    useSelector((state) => state.location.data)
  );
  const dispatch = useDispatch();
  console.log("language", language);
  console.log("location", location);

  const validate = Yup.object({
    identifier: Yup.string()
      .required("Email or Phone is required")
      .test(
        "identifier",
        "Enter a valid email or 10-digit phone number",
        (value) => {
          if (!value) return false;

          // Check if value is a valid email
          const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
          const isValidEmail = emailRegex.test(value);

          // Check if value is a 10-digit phone number
          const phoneRegex = /^[0-9]{10}$/;
          const isValidPhone = phoneRegex.test(value);

          return isValidEmail || isValidPhone;
        }
      ),
    password: Yup.string().required("Password is required"),
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.light.accent,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingVertical: 24,
              paddingHorizontal: 16,
              paddingBottom: 80, // Ensure content does not overlap the footer
              gap: 24,
              flexGrow: 1, // Ensure ScrollView takes up remaining space
              justifyContent: "center",
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={{
                paddingVertical: 30,
                paddingHorizontal: 20,
                gap: 32,
                backgroundColor: Colors.light.white,
                borderRadius: 20,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <View style={{ gap: 16 }}>
                <Image
                  source={logo}
                  style={{ width: 80, height: 80, margin: "auto" }}
                />

                <Text
                  style={{
                    fontFamily: "HindVadodara600",
                    fontSize: 28,
                    lineHeight: 36,
                    textAlign: "center",
                  }}
                >
                  Login
                </Text>

                <Text
                  style={{
                    ...styles.details,
                    fontSize: 16,
                    lineHeight: 24,
                    fontFamily: "HindVadodara500",
                    textAlign: "center",
                    color: "#6d6d6d",
                  }}
                >
                  Welcome back! Please enter your detail
                </Text>
              </View>

              <Formik
                initialValues={{
                  identifier: "",
                  password: "",
                }}
                validationSchema={validate}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    console.log(values);
                    // Wait for the AsyncStorage values to resolve
                    console.log(language);
                    console.log(location);
                    const response = await fetch(`${baseURL}/auth/login`, {
                      method: "POST", // Use POST method for the request
                      headers: {
                        "Content-Type": "application/json", // Ensure the request is sent as JSON
                      },
                      body: JSON.stringify({
                        identifier: values.identifier,
                        password: values.password,
                        state: location.countryState,
                        city: location.city,
                        app_language: language,
                      }),
                    });

                    if (!response.ok) {
                      // Handle any errors (non-2xx responses)
                      const errorText = await response.text(); // Read the response body as text
                      console.error("Error:", errorText);
                      throw new Error(
                        "Request failed with status " + response.status
                      );
                    }

                    const data = await response.json(); // Parse the
                    dispatch(changeAuth("yes"));
                    dispatch(changeToken(data.user.accessToken));
                    console.log("token in login", data.user.accessToken);
                    setSubmitting(false);
                    router.push("/");
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  isSubmitting,
                }) => (
                  <View style={{ gap: 16 }}>
                    <View style={{ gap: 8 }}>
                      <Text style={{ ...styles.Subheading2, fontSize: 16 }}>
                        Email or Phone
                      </Text>
                      <TextInput
                        value={values.identifier}
                        keyboardType="default"
                        onChangeText={handleChange("identifier")}
                        onBlur={handleBlur("identifier")}
                        placeholder="Enter your email or phone"
                        placeholderTextColor={Colors.light.details}
                        autoCapitalize="none" // Added to help with email validation
                        autoCorrect={false}
                        style={[
                          styles.ContentText,
                          {
                            borderColor: Colors.light.border,
                            borderWidth: 1,
                            borderRadius: 5,
                            padding: 10,
                          },
                          touched.identifier && errors.identifier
                            ? style.inputError
                            : {},
                        ]}
                      />
                      {touched.identifier && errors.identifier && (
                        <ErrorText>{errors.identifier}</ErrorText>
                      )}
                    </View>

                    <View style={{ gap: 8 }}>
                      <Text style={{ ...styles.Subheading2, fontSize: 16 }}>
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
                          styles.ContentText,
                          {
                            borderColor: Colors.light.border,
                            borderWidth: 1,
                            borderRadius: 5,
                            padding: 10,
                          },
                          touched.password && errors.password
                            ? style.inputError
                            : {},
                        ]}
                      />
                      {touched.password && errors.password && (
                        <ErrorText>{errors.password}</ErrorText>
                      )}
                    </View>

                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 16,
                      }}
                    >
                      <RedText
                        style={{ textAlign: "left" }}
                        onPress={() => {
                          router.push("/signup");
                        }}
                      >
                        Sign up
                      </RedText>
                      <RedText
                        style={{ textAlign: "right" }}
                        onPress={() => {
                          router.push("/forgot-password");
                        }}
                      >
                        Forgot Password?
                      </RedText>
                    </View>

                    <TouchableOpacity
                      disabled={isSubmitting}
                      style={styles.buttonContainer}
                      onPress={handleSubmit}
                    >
                      <Text style={styles.button}>Log In</Text>
                      {/* <Feather name="arrow-right-circle" size={24} color="#fff" /> */}
                    </TouchableOpacity>
                  </View>
                )}
              </Formik>
            </View>

            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
                justifyContent: "center",
                borderTopColor: Colors.light.border,
                borderTopWidth: 1,
                paddingVertical: 16,
                marginHorizontal: 16,
              }}
            >
              <Text
                style={{
                  fontFamily: "HindVadodara400",
                  fontSize: 20,
                  lineHeight: 30,
                  color: Colors.light.white,
                }}
              >
                Powered By:
              </Text>
              <Text
                style={{
                  fontFamily: "HindVadodara600",
                  fontSize: 20,
                  lineHeight: 30,
                  color: Colors.light.white,
                }}
              >
                Lok Vishwa Bharti
              </Text>
            </View>
          </ScrollView>
        </View>
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
