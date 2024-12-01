import { View, Text, Dimensions, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { styles } from "@/constants/styles";
import CardFlatlistComponent from "@/components/CardFlatlistComponent";

const OtherProfile = () => {
  const [isFollowing, setIsFollowing] = useState(false);

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
        height: Dimensions.get("screen").height,
        flex: 1,
      }}
    >
      <ScrollView style={{ marginTop: 56 }}>
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
                  marginBottom: 16,
                }}
              >
                @rahulkumar001
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 16,
                  gap: 24,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 4,
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
                  <Text
                    style={{
                      fontFamily: "HindVadodara500",
                      fontSize: 14,
                      lineHeight: 22,
                      color: Colors.light.subheading,
                    }}
                  >
                    Followers
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 4,
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
                  </Text>
                  <Text
                    style={{
                      fontFamily: "HindVadodara500",
                      fontSize: 14,
                      lineHeight: 22,
                      color: Colors.light.subheading,
                    }}
                  >
                    Following
                  </Text>
                </View>
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

          {/* Follow Button */}
          {isFollowing ? (
            <TouchableOpacity
              style={{
                backgroundColor: Colors.light.white,
                borderColor: Colors.light.accent,
                borderWidth: 1,
                paddingVertical: 8,
                paddingHorizontal: 48,
                borderRadius: 5,
                alignSelf: "flex-start",
                marginTop: 8,
              }}
              onPress={() => setIsFollowing(false)}
            >
              <Text style={{ ...styles.buttonReverse }}>Following</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: Colors.light.accent,
                borderColor: Colors.light.accent,
                borderWidth: 1,
                paddingVertical: 8,
                paddingHorizontal: 48,
                borderRadius: 5,
                alignSelf: "flex-start",
                marginTop: 8,
              }}
              onPress={() => setIsFollowing(true)}
            >
              <Text style={{ ...styles.button }}>Follow</Text>
            </TouchableOpacity>
          )}
        </View>

        <CardFlatlistComponent scrollEnabled={false} data={data} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default OtherProfile;
