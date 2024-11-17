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
import { useNavigation } from "@react-navigation/native";
import CheckBox from "react-native-check-box";

export default function Signup() {
  const navigation = useNavigation();

  const validate = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    phone: Yup.string()
      .required("Phone is required")
      .min(10, "Phone number must be 10 digits")
      .max(10, "Phone number must be 10 digits"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
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
              Create Your Account
            </Text>

            <Formik
              initialValues={{
                name: "",
                email: "",
                phone: "",
                password: "",
                cpassword: "",
                agreement: false,
              }}
              validationSchema={validate}
              onSubmit={(values, { setSubmitting }) => {
                console.log(values);
                setSubmitting(false);
                // navigation.navigate("verify");
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
                    <Text style={styles.Subheading2}>Full Name</Text>
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

                  <View style={{ gap: 8 }}>
                    <Text style={styles.Subheading2}>Password</Text>
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

                  <View style={{ gap: 8 }}>
                    <Text style={styles.Subheading2}>Confirm Password</Text>
                    <TextInput
                      value={values.cpassword}
                      keyboardType="default"
                      onChangeText={handleChange("cpassword")}
                      onBlur={handleBlur("cpassword")}
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
                      rightText="I agree to follow the Terms And Conditions and avoid uploading adult content."
                    />
                    {touched.agreement && errors.agreement && (
                      <ErrorText>{errors.agreement}</ErrorText>
                    )}
                  </View>

                  <TouchableOpacity
                    disabled={isSubmitting}
                    style={styles.buttonContainer}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.button}>Submit</Text>
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
