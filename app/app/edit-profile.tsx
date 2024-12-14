import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { styles } from "@/constants/styles";
import { Formik } from "formik";
import { TextInput } from "react-native-gesture-handler";
import * as Yup from "yup";
import ErrorText from "@/components/ErrorText";
import { router, useLocalSearchParams } from "expo-router";
import RedText from "@/components/RedText";
import { OtpInput } from "react-native-otp-entry";
import { useSelector } from "react-redux";
import { baseURL } from "@/constants/config";

export default function Signup() {
  const { display_name, username, email, phone, image } =
    useLocalSearchParams();
  console.log(display_name);

  const [originalPhone, setOriginalPhone] = useState(phone);
  const [originalName, setOriginalName] = useState(display_name);
  const [originalUsername, setOriginalUsername] = useState(username);
  const [originalEmail, setOriginalEmail] = useState(email);

  const [sendOrConfirm, setSendOrConfirm] = useState("send");

  const token = useSelector((state) => state.token.data);
  const location = useSelector((state) => state.location.data);
  const languages = [
    { label: "Hindi", value: "hindi" },
    { label: "English", value: "english" },
  ];

  const DEBOUNCE_DELAY = 500; // 500ms debounce delay

  const [usernameAvailable, setUsernameAvailable] = useState(null); // Track username availability
  const [debounceTimeout, setDebounceTimeout] = useState(null); // Track debounce timeout

  const validate = Yup.object({
    name: Yup.string().required("Name is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    phone: Yup.string()
      .required("Phone is required")
      .min(10, "Phone number must be 10 digits")
      .max(10, "Phone number must be 10 digits"),
  });

  async function sendOTP(phone: any) {
    if (phone.length !== 10) {
      alert("Enter a valid phone number");
      return;
    }
    const otpRequest = await fetch(`${baseURL}/auth/send-change-phone-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ phone: phone }),
    });

    if (otpRequest.ok) {
      const response = await otpRequest.json();
      console.log(response);
      setSendOrConfirm("confirm");
      alert("OTP sent successfully");
    }
  }

  async function changePhone(phone, otp) {
    if (phone.length !== 10) {
      alert("Enter a valid phone number");
      return;
    }
    if (otp.length !== 4) {
      alert("Enter a valid OTP");
      return;
    }
    const otpRequest = await fetch(`${baseURL}/auth/verify-change-phone-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ phone, otp }),
    });
    console.log(otpRequest);

    if (otpRequest.ok) {
      const response = await otpRequest.json();

      setSendOrConfirm("send");
      setOriginalPhone(phone);
      alert("Phone Number updated successfully");
    } else {
      alert("Enter the correct details");
    }
  }

  const debouncedHandleIsUsernameAvailable = useCallback(
    (username) => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout); // Clear the previous timeout
      }
      const timeout = setTimeout(async () => {
        try {
          const response = await fetch(`${baseURL}/user/available-username`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ username }),
          });
          const data = await response.json();
          setUsernameAvailable(data.available);
          console.log("Username available:", data.available);
        } catch (error) {
          console.error("Error checking username availability:", error);
        }
      }, DEBOUNCE_DELAY);
      setDebounceTimeout(timeout); // Save the timeout
    },
    [debounceTimeout]
  );

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
                  uri: image,
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
                name: display_name,
                username: username,
                email: email,
                phone: phone,
                otp: "",
                language: "english",
              }}
              // validationSchema={validate}
              onSubmit={async (values) => {
                const request = await fetch(`${baseURL}/user/edit-profile`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    display_name: values.name,
                    username: values.username,
                    email: values.email,
                    state: "bihar",
                    city: "delhi",
                    app_language: "english",
                  }),
                });

                const response = await request.json();
                console.log(response);
                if (request.ok) {
                  router.push("/profile");
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
              }) => {
                return (
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
                      <Text
                        style={{ ...styles.Subheading2, textAlign: "left" }}
                      >
                        Name
                      </Text>
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
                      <Text
                        style={{ ...styles.Subheading2, textAlign: "left" }}
                      >
                        Username
                      </Text>
                      <TextInput
                        value={values.username}
                        keyboardType="default"
                        onChangeText={(text) => {
                          setFieldValue("username", text);
                          debouncedHandleIsUsernameAvailable(text);
                        }}
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
                        {usernameAvailable === false && (
                          <ErrorText style={{ color: Colors.light.orange }}>
                            Not available
                          </ErrorText>
                        )}
                        {usernameAvailable === true && (
                          <ErrorText style={{ color: Colors.light.green }}>
                            Available
                          </ErrorText>
                        )}
                      </View>
                    </View>

                    <View style={{ gap: 8 }}>
                      <Text
                        style={{ ...styles.Subheading2, textAlign: "left" }}
                      >
                        Phone
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          position: "relative",
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
                            touched.phone && errors.phone
                              ? style.inputError
                              : {},
                          ]}
                        />

                        {sendOrConfirm === "send" && (
                          <RedText
                            style={{
                              ...style.resendButton,
                              position: "absolute",
                              right: 10, // Slight padding from the edge
                              top: "50%", // Move to 50% of container height
                              transform: [{ translateY: -12 }], // Offset by half height to center vertically
                            }}
                            onPress={() => sendOTP(values.phone)}
                          >
                            Send OTP
                          </RedText>
                        )}
                        {sendOrConfirm === "confirm" &&
                          originalPhone !== values.phone && (
                            <RedText
                              style={{
                                ...style.resendButton,
                                position: "absolute",
                                right: 10, // Slight padding from the edge
                                top: "50%", // Move to 50% of container height
                                transform: [{ translateY: -12 }], // Offset by half height to center vertically
                              }}
                              onPress={() =>
                                changePhone(values.phone, values.otp)
                              }
                            >
                              Confirm
                            </RedText>
                          )}
                      </View>

                      {touched.phone && errors.phone && (
                        <ErrorText>{errors.phone}</ErrorText>
                      )}
                    </View>

                    {originalPhone !== values.phone && (
                      <View style={style.inputGroup}>
                        <Text
                          style={{ ...styles.Subheading2, textAlign: "left" }}
                        >
                          Phone OTP
                        </Text>
                        <OtpInput
                          numberOfDigits={4}
                          focusColor={Colors.light.border}
                          focusStickBlinkingDuration={500}
                          onTextChange={(text) => {
                            setFieldValue("otp", text);
                            console.log(text);
                          }}
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

                          <RedText style={style.resendButton}>
                            Resend OTP
                          </RedText>
                        </View>
                      </View>
                    )}

                    <View style={{ gap: 8 }}>
                      <Text
                        style={{ ...styles.Subheading2, textAlign: "left" }}
                      >
                        Email
                      </Text>
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
                      <Text
                        style={{ ...styles.Subheading2, textAlign: "left" }}
                      >
                        Selected Language
                      </Text>
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
                            onPress={() =>
                              setFieldValue("language", lang.value)
                            }
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

                    <Pressable
                      style={{ ...styles.buttonContainer, marginBottom: 32 }}
                      onPress={() => handleSubmit()}
                    >
                      <Text style={styles.button}>Save</Text>
                    </Pressable>
                  </View>
                );
              }}
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
