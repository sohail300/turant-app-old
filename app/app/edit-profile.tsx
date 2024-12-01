import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { styles } from "@/constants/styles";
import { Formik } from "formik";
import { TextInput } from "react-native-gesture-handler";
import * as Yup from "yup";
import ErrorText from "@/components/ErrorText";
import { router } from "expo-router";
import RedText from "@/components/RedText";
import { OtpInput } from "react-native-otp-entry";

export default function Signup() {
  const languages = [
    { label: "Hindi", value: "hindi" },
    { label: "English", value: "english" },
  ];

  const validate = Yup.object({
    name: Yup.string().required("Name is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    phone: Yup.string()
      .required("Phone is required")
      .min(10, "Phone number must be 10 digits")
      .max(10, "Phone number must be 10 digits"),
    otp: Yup.string()
      .required("OTP is required")
      .length(4, "OTP must be 4 digits"),
    langauge: Yup.string().required("Language is required"),
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.light.white,
        borderTopColor: Colors.light.border,
        borderTopWidth: 1,
      }}
    >
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          flex: 1,
        }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            gap: 24,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                paddingVertical: 24,
              }}
            >
              <Image
                source={{
                  uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
                }}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                }}
              />
              <RedText>Change Profile Picture</RedText>
            </View>
            <Formik
              initialValues={{
                name: "",
                username: "",
                email: "",
                phone: "",
                otp: "",
                language: "english",
              }}
              validationSchema={validate}
              onSubmit={(values, { setSubmitting }) => {
                console.log(values);
                setSubmitting(false);
                router.push("/profile");
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
                <View
                  style={{
                    gap: 16,
                    paddingHorizontal: 24,
                    borderTopColor: Colors.light.border,
                    borderTopWidth: 1,
                    paddingTop: 16,
                  }}
                >
                  <View style={{ gap: 8 }}>
                    <Text style={styles.Subheading2}>Name</Text>
                    <TextInput
                      value={values.name}
                      keyboardType="default"
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      placeholder="Enter your name"
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
                    <Text style={styles.Subheading2}>Username</Text>
                    <TextInput
                      value={values.username}
                      keyboardType="default"
                      onChangeText={handleChange("username")}
                      onBlur={handleBlur("username")}
                      placeholder="Enter your username"
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
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {touched.username && errors.username && (
                        <ErrorText>{errors.username}</ErrorText>
                      )}
                      {touched.username && errors.username && (
                        <ErrorText style={{ color: Colors.light.orange }}>
                          Not available
                        </ErrorText>
                      )}
                    </View>
                  </View>

                  <View style={{ gap: 8 }}>
                    <Text style={styles.Subheading2}>Phone</Text>
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
                        placeholder="Enter your phone"
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

                  <View style={style.inputGroup}>
                    <Text style={styles.Subheading2}>Phone OTP</Text>
                    <OtpInput
                      numberOfDigits={4}
                      focusColor={Colors.light.border}
                      focusStickBlinkingDuration={500}
                      onTextChange={(text) => setFieldValue("otp", text)}
                      onFilled={(text) => setFieldValue("otp", text)}
                      textInputProps={{
                        accessibilityLabel: "One-Time Password",
                      }}
                      autoFocus={false}
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
                    <View style={style.resendContainer}>
                      {touched.otp && errors.otp ? (
                        <ErrorText>{errors.otp}</ErrorText>
                      ) : (
                        <View />
                      )}

                      <RedText style={style.resendButton}>Resend OTP</RedText>
                    </View>
                  </View>

                  <View style={{ gap: 8 }}>
                    <Text style={styles.Subheading2}>Email</Text>
                    <TextInput
                      value={values.email}
                      keyboardType="default"
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      placeholder="Enter your email"
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
                    <Text style={styles.Subheading2}>Selected Language</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: 10,
                      }}
                    >
                      {languages.map((lang) => (
                        <TouchableOpacity
                          key={lang.value}
                          onPress={() => setFieldValue("language", lang.value)}
                          style={[
                            {
                              flex: 1,
                              flexDirection: "row",
                              alignItems: "center",
                              borderWidth: 1,
                              borderRadius: 5,
                              padding: 10,
                              borderColor:
                                touched.language && errors.language
                                  ? "red"
                                  : Colors.light.border,
                              backgroundColor: "transparent",
                            },
                          ]}
                        >
                          <View
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 10,
                              borderWidth: 2,
                              borderColor:
                                values.language === lang.value
                                  ? Colors.light.accent
                                  : Colors.light.text,
                              marginRight: 10,
                              backgroundColor:
                                values.language === lang.value
                                  ? Colors.light.accent
                                  : "transparent",
                            }}
                          />
                          <Text
                            style={[
                              styles.ContentText,
                              {
                                color: Colors.light.text,
                              },
                            ]}
                          >
                            {lang.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    {touched.language && errors.language && (
                      <ErrorText>{errors.language}</ErrorText>
                    )}
                  </View>

                  <TouchableOpacity
                    disabled={isSubmitting}
                    style={{ ...styles.buttonContainer, marginBottom: 32 }}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.button}>Save</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
  resendContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resendButton: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "HindVadodara700",
  },
});
