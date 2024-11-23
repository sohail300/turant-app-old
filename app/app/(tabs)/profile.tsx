import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Post from "../profile/post";
import Saved from "../profile/saved";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import RedText from "@/components/RedText";
import Feather from "@expo/vector-icons/Feather";
import Card from "@/components/Card";
import { FlatList } from "react-native-gesture-handler";
import logo from "@/assets/images/logo-red-without-text.png";
import verified from "@/assets/icons/verified.png";
import UserPost from "@/components/UserPost";
import UserSaved from "@/components/UserSaved";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

console.log(logo);

const profile = () => {
  const [tab, setTab] = useState(1);

  const data = [
    {
      id: 1,
      heading:
        "Beyond Economics, Dr Bibek Debroy's Tongue-In-Cheek Take On Current Events",
      imageUrl:
        "https://fl-i.thgim.com/public/incoming/svh489/article68831258.ece/alternates/LANDSCAPE_1200/Bibek%20Debroy%20Obit.jpg",
      author: "Rahul Kumar",
      authorImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
      content:
        "A being with a thousand heads, a thousand eyes and a thousand feet 'surrounds the entire universe yet there is more of him that is left over'. Dr Bibek Debroy's explanation of the Supreme in one of his around 50 books",
      details: "Ranchi, Jharkhand | 1 Nov 2024 | 2:00 PM",
    },
    {
      id: 2,
      heading:
        "Beyond Economics, Dr Bibek Debroy's Tongue-In-Cheek Take On Current Events",
      imageUrl:
        "https://fl-i.thgim.com/public/incoming/svh489/article68831258.ece/alternates/LANDSCAPE_1200/Bibek%20Debroy%20Obit.jpg",
      author: "Rahul Kumar",
      authorImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
      content:
        "A being with a thousand heads, a thousand eyes and a thousand feet 'surrounds the entire universe yet there is more of him that is left over'. Dr Bibek Debroy's explanation of the Supreme in one of his around 50 books",
      details: "Ranchi, Jharkhand | 1 Nov 2024 | 2:00 PM",
    },
    {
      id: 3,
      heading:
        "Beyond Economics, Dr Bibek Debroy's Tongue-In-Cheek Take On Current Events",
      imageUrl:
        "https://fl-i.thgim.com/public/incoming/svh489/article68831258.ece/alternates/LANDSCAPE_1200/Bibek%20Debroy%20Obit.jpg",
      author: "Rahul Kumar",
      authorImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
      content:
        "A being with a thousand heads, a thousand eyes and a thousand feet 'surrounds the entire universe yet there is more of him that is left over'. Dr Bibek Debroy's explanation of the Supreme in one of his around 50 books",
      details: "Ranchi, Jharkhand | 1 Nov 2024 | 2:00 PM",
    },
  ];

  return (
    <SafeAreaView
      style={{
        backgroundColor: `${Colors.light.background}`,
        height: Dimensions.get("window").height,
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.light.border,
      }}
    >
      <View
        style={{
          padding: 16,
          backgroundColor: Colors.light.white,
        }}
      >
        {/* Profile Info */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            paddingVertical: 20,
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
                marginBottom: 16,
              }}
            >
              @rahulkumar001
            </Text>

            <View
              style={{
                flexDirection: "row",
                gap: 16,
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

          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
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
            <RedText>Edit Profile</RedText>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Image source={verified} style={{ height: 16, width: 16 }} />
          <Text
            style={{
              fontFamily: "HindVadodara500",
              fontSize: 14,
              lineHeight: 18,
              color: Colors.light.subheading,
            }}
          >
            Earn a blue badge upon reaching 1,000 followers
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: Colors.light.white,
          borderTopWidth: 1,
          borderTopColor: Colors.light.border,
          paddingHorizontal: 40,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => setTab(1)}
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            gap: 7,
            borderBottomColor:
              tab == 1 ? Colors.light.accent : Colors.light.white,
            borderBottomWidth: 2,
            paddingVertical: 16,
          }}
        >
          <FontAwesome
            name="file-text-o"
            size={24}
            color={tab == 1 ? Colors.light.accent : Colors.light.subheading2}
          />
          <Text
            style={{
              textAlign: "center",
              color: tab == 1 ? Colors.light.accent : Colors.light.subheading,
            }}
          >
            Post
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab(2)}
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            borderBottomColor:
              tab == 2 ? Colors.light.accent : Colors.light.white,
            borderBottomWidth: 2,
            paddingVertical: 16,
          }}
        >
          <Ionicons
            name="bookmark-outline"
            size={28}
            color={tab == 2 ? Colors.light.accent : Colors.light.subheading2}
          />
          <Text
            style={{
              textAlign: "center",
              color: tab == 2 ? Colors.light.accent : Colors.light.subheading,
            }}
          >
            Saved
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/about")}
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            borderBottomColor:
              tab == 3 ? Colors.light.accent : Colors.light.white,
            borderBottomWidth: 2,
            paddingVertical: 16,
          }}
        >
          <Image source={logo} style={{ height: 28, width: 28 }} />

          <Text
            style={{
              textAlign: "center",
              color: tab == 3 ? Colors.light.accent : Colors.light.subheading,
            }}
          >
            Turant
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{ flex: 1, borderWidth: 1, borderColor: Colors.light.border }}
      >
        {tab == 1 && <UserPost />}
        {tab == 2 && <UserSaved />}
      </View>
    </SafeAreaView>
  );
};

export default profile;
