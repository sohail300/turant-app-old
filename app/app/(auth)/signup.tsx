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
import { Formik } from "formik";
import { TextInput } from "react-native-gesture-handler";
import * as Yup from "yup";
import ErrorText from "@/components/ErrorText";
import CheckBox from "react-native-check-box";
import { router } from "expo-router";
import RedText from "@/components/RedText";
import { useDispatch, useSelector } from "react-redux";
import { changeAuth } from "@/store/AuthSlice";
import { baseURL } from "@/constants/config";
import { changeToken } from "@/store/TokenSlice";
import signupPage from "@/locales/signupPage.json";

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
    name: Yup.string().required("Name is required"),
    username: Yup.string()
      .min(4, "Username must be at least 4 characters")
      .max(20, "Username must be at most 20 characters"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    phone: Yup.string()
      .required("Phone is required")
      .min(10, "Phone number must be 10 digits")
      .max(10, "Phone number must be 10 digits"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    cpassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    agreement: Yup.boolean().oneOf(
      [true],
      "You must agree to the terms and conditions"
    ),
  });

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
            <Text
              style={{
                ...styles.Subheading2,
                fontSize: 28,
                lineHeight: 42,
                textAlign: "center",
              }}
            >
              {signupPage.createYourAccount[language]}
            </Text>

            <Formik
              initialValues={{
                name: "",
                username: "",
                email: "",
                phone: "",
                password: "",
                cpassword: "",
                agreement: false,
              }}
              validationSchema={validate}
              onSubmit={async (values, { setSubmitting }) => {
                console.log(values);
                try {
                  console.log("fetched");
                  const response = await fetch(`${baseURL}/auth/signup`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      display_name: values.name,
                      username: values.username,
                      email: values.email,
                      phone: values.phone,
                      password: values.password,
                      state: location.countryState,
                      city: location.city,
                      app_language: language,
                    }),
                  });

                  const data = await response.json();

                  if (response.ok) {
                    dispatch(changeAuth("yes"));
                    dispatch(changeToken(data.accessToken));
                    setSubmitting(false);
                    router.push("/verify");
                  } else {
                    console.error(data);
                    alert("Enter the correct details");
                  }
                } catch (error) {
                  console.log(error);
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
                <View style={{ gap: 16 }}>
                  <View style={{ gap: 8 }}>
                    <Text style={{ ...styles.Subheading2, textAlign: "left" }}>
                      {signupPage.fullName[language]}
                    </Text>
                    <TextInput
                      value={values.name}
                      keyboardType="default"
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      placeholder={signupPage.enterFullName[language]}
                      placeholderTextColor={Colors.light.details}
                      style={[
                        styles.ContentText,
                        {
                          borderColor: Colors.light.border,
                          borderWidth: 1,
                          borderRadius: 5,
                          padding: 10,
                        },
                        touched.name && errors.name ? style.inputError : {},
                      ]}
                    />
                    {touched.name && errors.name && (
                      <ErrorText>{errors.name}</ErrorText>
                    )}
                  </View>

                  <View style={{ gap: 8 }}>
                    <Text style={{ ...styles.Subheading2, textAlign: "left" }}>
                      {signupPage.username[language]}
                    </Text>
                    <TextInput
                      value={values.username}
                      keyboardType="default"
                      onChangeText={handleChange("username")}
                      onBlur={handleBlur("username")}
                      placeholder={signupPage.enterUsername[language]}
                      placeholderTextColor={Colors.light.details}
                      style={[
                        styles.ContentText,
                        {
                          borderColor: Colors.light.border,
                          borderWidth: 1,
                          borderRadius: 5,
                          padding: 10,
                        },
                        touched.username && errors.username
                          ? style.inputError
                          : {},
                      ]}
                    />
                    {touched.username && errors.username && (
                      <ErrorText>{errors.username}</ErrorText>
                    )}
                  </View>

                  <View style={{ gap: 8 }}>
                    <Text style={{ ...styles.Subheading2, textAlign: "left" }}>
                      {signupPage.email[language]}
                    </Text>
                    <TextInput
                      value={values.email}
                      keyboardType="default"
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      placeholder={signupPage.enterEmail[language]}
                      placeholderTextColor={Colors.light.details}
                      style={[
                        styles.ContentText,
                        {
                          borderColor: Colors.light.border,
                          borderWidth: 1,
                          borderRadius: 5,
                          padding: 10,
                        },
                        touched.email && errors.email ? style.inputError : {},
                      ]}
                    />
                    {touched.email && errors.email && (
                      <ErrorText>{errors.email}</ErrorText>
                    )}
                  </View>

                  <View style={{ gap: 8 }}>
                    <Text style={{ ...styles.Subheading2, textAlign: "left" }}>
                      {signupPage.phone[language]}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          padding: 10,
                          borderWidth: 1,
                          borderColor: Colors.light.border,
                          borderRadius: 5,
                          marginRight: -1, // Removes double border between prefix and input
                          borderRightWidth: 0,
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                        }}
                      >
                        <Text
                          style={[
                            styles.ContentText,
                            { color: Colors.light.text },
                          ]}
                        >
                          +91
                        </Text>
                      </View>
                      <TextInput
                        value={values.phone}
                        keyboardType="numeric"
                        onChangeText={handleChange("phone")}
                        onBlur={handleBlur("phone")}
                        placeholder={signupPage.enterPhone[language]}
                        placeholderTextColor={Colors.light.details}
                        style={[
                          styles.ContentText,
                          {
                            flex: 1,
                            borderColor: Colors.light.border,
                            borderWidth: 1,
                            borderRadius: 5,
                            padding: 10,
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                          },
                          touched.phone && errors.phone ? style.inputError : {},
                        ]}
                      />
                    </View>
                    {touched.phone && errors.phone && (
                      <ErrorText>{errors.phone}</ErrorText>
                    )}
                  </View>

                  <View style={{ gap: 8 }}>
                    <Text style={{ ...styles.Subheading2, textAlign: "left" }}>
                      {signupPage.password[language]}
                    </Text>
                    <TextInput
                      value={values.password}
                      keyboardType="default"
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      placeholder={signupPage.enterPassword[language]}
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

                  <View style={{ gap: 8 }}>
                    <Text style={{ ...styles.Subheading2, textAlign: "left" }}>
                      {signupPage.confirmPassword[language]}
                    </Text>
                    <TextInput
                      value={values.cpassword}
                      keyboardType="default"
                      onChangeText={handleChange("cpassword")}
                      onBlur={handleBlur("cpassword")}
                      placeholder={signupPage.enterCPassword[language]}
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
                        touched.cpassword && errors.cpassword
                          ? style.inputError
                          : {},
                      ]}
                    />
                    {touched.cpassword && errors.cpassword && (
                      <ErrorText>{errors.cpassword}</ErrorText>
                    )}
                  </View>

                  <View style={{ gap: 8 }}>
                    <CheckBox
                      isChecked={values.agreement}
                      onClick={() => {
                        console.log(values.agreement);
                        setFieldValue("agreement", !values.agreement);
                        console.log(values.agreement);
                      }}
                      rightText={signupPage.agreement[language]}
                    />
                    {touched.agreement && errors.agreement && (
                      <ErrorText>{errors.agreement}</ErrorText>
                    )}
                  </View>

                  <RedText
                    onPress={() => router.push("/terms_and_conditions")}
                    style={{
                      marginVertical: -8,
                      textAlign: "right",
                      fontSize: 14,
                    }}
                  >
                    {signupPage.termsAndConditions[language]}
                  </RedText>

                  <TouchableOpacity
                    disabled={isSubmitting}
                    style={styles.buttonContainer}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.button}>
                      {signupPage.submit[language]}
                    </Text>
                    <Feather name="arrow-right-circle" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
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
