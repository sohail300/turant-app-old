import { View, Text, Dimensions, Share } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Entypo } from "@expo/vector-icons";
import { styles } from "@/constants/styles";
import { router } from "expo-router";
import LogoutBottomSheet from "@/components/LogoutBottomSheet";

const About = () => {
  const [showLogoutSheet, setShowLogoutSheet] = useState(false);

  return (
    <SafeAreaView
      style={{
        backgroundColor: `${Colors.light.background}`,
        height: Dimensions.get("screen").height,
        flex: 1,
      }}
    >
      <ScrollView
        style={{
          marginTop: 48,
          backgroundColor: Colors.light.white,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 24,
            borderBottomColor: Colors.light.border,
            borderBottomWidth: 1,
          }}
        >
          <Text
            style={{
              ...styles.Subheading2,
              fontSize: 22,
              color: Colors.light.subheading,
            }}
          >
            About Turant
          </Text>
        </View>
        <View
          style={{
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderBottomColor: Colors.light.border,
            borderBottomWidth: 1,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPress={() => router.push("/company_info")}
          >
            <Text
              style={{
                ...styles.ContentText,
                fontFamily: "HindVadodara500",
                color: Colors.light.subheading,
              }}
            >
              Company Information
            </Text>
            <Entypo name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderBottomColor: Colors.light.border,
            borderBottomWidth: 1,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPress={() => router.push("/limits_and_privileges")}
          >
            <Text
              style={{
                ...styles.ContentText,
                fontFamily: "HindVadodara500",
                color: Colors.light.subheading,
              }}
            >
              Limits and Privileges
            </Text>
            <Entypo name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderBottomColor: Colors.light.border,
            borderBottomWidth: 1,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPress={() => router.push("/terms_and_conditions")}
          >
            <Text
              style={{
                ...styles.ContentText,
                fontFamily: "HindVadodara500",
                color: Colors.light.subheading,
              }}
            >
              Terms and Conditions
            </Text>
            <Entypo name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderBottomColor: Colors.light.border,
            borderBottomWidth: 1,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPress={() => router.push("/privacy_policy")}
          >
            <Text
              style={{
                ...styles.ContentText,
                fontFamily: "HindVadodara500",
                color: Colors.light.subheading,
              }}
            >
              Privacy Policy
            </Text>
            <Entypo name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderBottomColor: Colors.light.border,
            borderBottomWidth: 1,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPress={() => router.push("/intellectual_property_policy")}
          >
            <Text
              style={{
                ...styles.ContentText,
                fontFamily: "HindVadodara500",
                color: Colors.light.subheading,
              }}
            >
              Intellectual Property Policy
            </Text>
            <Entypo name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderBottomColor: Colors.light.border,
            borderBottomWidth: 1,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPress={() => router.push("/contact_us")}
          >
            <Text
              style={{
                ...styles.ContentText,
                fontFamily: "HindVadodara500",
                color: Colors.light.subheading,
              }}
            >
              Contact Us
            </Text>
            <Entypo name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderBottomColor: Colors.light.border,
            borderBottomWidth: 1,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPress={() =>
              Share.share({
                message:
                  "Checkout TurantNews, I think you will like it. https://play.google.com/",
                url: "Checkout TurantNews, I think you will like it. https://play.google.com/",
              })
            }
          >
            <Text
              style={{
                ...styles.ContentText,
                fontFamily: "HindVadodara500",
                color: Colors.light.subheading,
              }}
            >
              Share this app
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderBottomColor: Colors.light.border,
            borderBottomWidth: 1,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPress={() => setShowLogoutSheet(true)}
          >
            <Text
              style={{
                ...styles.ContentText,
                fontFamily: "HindVadodara500",
                color: Colors.light.accent,
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Gray overlay */}
      {showLogoutSheet && (
        <View
          style={{
            position: "absolute",
            top: 0, // This ensures it starts from the very top
            left: 0,
            right: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            height: Dimensions.get("screen").height,
          }}
        />
      )}
      {showLogoutSheet && (
        <LogoutBottomSheet close={() => setShowLogoutSheet(false)} />
      )}
    </SafeAreaView>
  );
};

export default About;
