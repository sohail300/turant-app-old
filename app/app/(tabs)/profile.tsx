import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Post from "../profile/post";
import Saved from "../profile/saved";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

const profile = () => {
  return (
    <SafeAreaView>
      <View
        style={{
          padding: 16,
          backgroundColor: Colors.light.white,
          marginBottom: 16,
        }}
      >
        {/* Profile Info */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "HindVadodara500",
                fontSize: 20,
                lineHeight: 24,
                color: Colors.light.subheading,
              }}
            >
              Rahul Kumar
            </Text>
            <Text
              style={{
                color: Colors.light.subheading,
                fontSize: 16,
                lineHeight: 24,
                marginTop: -4,
                marginBottom: 12,
              }}
            >
              @rahulkumar001
            </Text>

            <View
              style={{
                flexDirection: "row",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontFamily: "HindVadodara500",
                  fontSize: 14,
                  lineHeight: 24,
                  color: Colors.light.subheading,
                }}
              >
                <Text
                  style={{
                    fontFamily: "HindVadodara500",
                    fontSize: 20,
                    lineHeight: 24,
                    color: Colors.light.subheading,
                  }}
                >
                  2.2k
                </Text>
                Followers
              </Text>
              <Text
                style={{
                  fontFamily: "HindVadodara500",
                  fontSize: 14,
                  lineHeight: 24,
                  color: Colors.light.subheading,
                }}
              >
                <Text
                  style={{
                    fontFamily: "HindVadodara500",
                    fontSize: 20,
                    lineHeight: 24,
                    color: Colors.light.subheading,
                  }}
                >
                  20
                </Text>{" "}
                Following
              </Text>
            </View>
          </View>

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
        </View>
      </View>

      <Tab.Navigator>
        <Tab.Screen name="post" component={Post} />
        <Tab.Screen name="saved" component={Saved} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default profile;

const styles = StyleSheet.create({});
