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
import * as ImagePicker from "expo-image-picker";

export default function Signup() {
  const { display_name, username, email, phone, image, verified } =
    useLocalSearchParams();

  console.log(verified);

  const [originalPhone, setOriginalPhone] = useState(phone);
  const [originalName, setOriginalName] = useState(display_name);
  const [originalUsername, setOriginalUsername] = useState(username);
  const [originalEmail, setOriginalEmail] = useState(email);

  const [imagePicked, setImagePicked] = useState(false);
  const [newImage, setNewImage] = useState(null);

  const [sendOrConfirm, setSendOrConfirm] = useState("send");

  const token = useSelector((state) => state.token.data);
  const location = useSelector((state) => state.location.data);
  const language = useSelector((state) => state.language.data);

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

  const handleProfilePicChange = async () => {
    if (!image) {
      console.error("No image selected");
      return;
    }

    const formData = new FormData();
    formData.append("image", {
      uri: newImage,
      name: "profile-pic.jpg",
      type: "image/jpeg",
    });
    formData.append("imageId", "12345"); // Optional: Add image ID

    try {
      const response = await fetch(`${baseURL}/user/change-profile-pic`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log("Response:", data);
      alert("Profile picture changed successfully");
      setImagePicked(false); // Set the flag to false
    } catch (error) {
      console.error("Error changing profile picture:", error);
    }
  };

  const handleProfilePicSelection = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio
      quality: 1, // Best quality
    });

    if (!result.canceled) {
      // Set the image URI
      setNewImage(result.assets[0].uri); // Save the image URI in state
      setImagePicked(true); // Set the flag to true
    } else {
      console.log("Image selection canceled");
    }
  };

  async function handleVerify() {
    try {
      const response = await fetch(`${baseURL}/auth/send-register-otp`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Response:", data);
      if (response.ok) {
        router.push("/verify");
      } else {
        console.error("Error sending OTP:", data);
        alert("Error sending OTP");
      }
    } catch (error) {
      console.error("Error verifying:", error);
    }
  }

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
                  uri: newImage !== null ? newImage : image,
                }}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                }}
              />
              {imagePicked === true ? (
                <RedText onPress={() => handleProfilePicChange()}>
                  Confirm
                </RedText>
              ) : (
                <RedText onPress={() => handleProfilePicSelection()}>
                  Change Profile Picture
                </RedText>
              )}
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
                const updatedFields = {};

                // Compare current values with original values and only add changes to the `updatedFields` object
                if (values.name !== originalName) {
                  updatedFields.display_name = values.name;
                }
                if (values.username !== originalUsername) {
                  updatedFields.username = values.username;
                }
                if (values.email !== originalEmail) {
                  updatedFields.email = values.email;
                }

                // Add constant fields if required
                updatedFields.state = location.countryState;
                updatedFields.city = location.city;
                updatedFields.app_language = values.language;

                // Proceed only if there are changes
                if (Object.keys(updatedFields).length > 0) {
                  const request = await fetch(`${baseURL}/user/edit-profile`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(updatedFields),
                  });

                  const response = await request.json();
                  console.log(response);

                  if (request.ok) {
                    router.push("/profile");
                  }
                } else {
                  console.log("No changes detected.");
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

                        {sendOrConfirm === "send" &&
                          originalPhone !== values.phone && (
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

                    <View style={{ gap: 8 }}>
                      <Text
                        style={{ ...styles.Subheading2, textAlign: "left" }}
                      >
                        Verified
                      </Text>

                      {verified === "false" ? (
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              backgroundColor: Colors.light.orange,
                              padding: 10,
                              borderRadius: 5,
                              color: Colors.light.white,
                            }}
                          >
                            Not Verified
                          </Text>

                          <RedText onPress={() => handleVerify()}>
                            Verify
                          </RedText>
                        </View>
                      ) : (
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              backgroundColor: Colors.light.green,
                              padding: 10,
                              borderRadius: 5,
                              color: Colors.light.white,
                            }}
                          >
                            Verified
                          </Text>
                        </View>
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
