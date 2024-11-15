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
import { Formik } from "formik";
import { TextInput } from "react-native-gesture-handler";
import * as Yup from "yup";
import ErrorText from "@/components/ErrorText";

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

            <TouchableOpacity style={styles.buttonContainer}>
              <Text style={styles.button}>Submit</Text>
              <Feather name="arrow-right-circle" size={24} color="#fff" />
            </TouchableOpacity>
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
