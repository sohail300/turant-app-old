import { View, Text, Dimensions, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { styles } from "@/constants/styles";
import CardFlatlistComponent from "@/components/CardFlatlistComponent";
import { baseURL } from "@/constants/config";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OtherProfile = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const token = useSelector((state) => state.token.data); // Token from AsyncStorage
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10); // Limit for each request
  const [offset, setOffset] = useState(0); // Offset for pagination
  const [loading, setLoading] = useState(false); // To avoid duplicate requests
  const [hasMore, setHasMore] = useState(true); // To stop fetching if no more data

  const [profile, setProfile] = useState({});

  async function getData(initialLoad = false) {
    if (loading || !hasMore) return; // Avoid fetching if already loading or no more data
    setLoading(true);

    try {
      const authorId = await AsyncStorage.getItem("authorId");

      const response = await fetch(`${baseURL}/user/others-posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: authorId?.replaceAll('"', ""),
          limit: 10,
          offset: 0,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const posts = await response.json();
      console.log("posts", posts.posts[0].posts);
      if (posts.length === 0) {
        setHasMore(false); // No more data to load
      } else {
        setData((prevData) =>
          initialLoad
            ? posts.posts[0].posts
            : [...prevData, posts.posts[0].posts]
        );
        setOffset((prevOffset) => prevOffset + limit); // Increment offset for next fetch
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function getProfile() {
    try {
      const authorId = await AsyncStorage.getItem("authorId");
      console.log("authorId", authorId);

      const response = await fetch(`${baseURL}/user/others-profile/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: authorId?.replaceAll('"', ""),
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const profile = await response.json();
      setProfile(profile);
      console.log("profile", profile);
      setProfile(profile);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getProfile();
    getData(true); // Initial load
  }, []);

  const handleFollow = async () => {
    try {
      const authorId = await AsyncStorage.getItem("authorId");
      console.log(authorId);

      const response = await fetch(
        `${baseURL}/user/follow/${authorId?.replaceAll('"', "")}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("data", data);

      setProfile((prevProfile) => ({
        ...prevProfile,
        user: {
          ...prevProfile.user,
          isFollowing: !prevProfile.user.isFollowing,
        },
      }));
    } catch (error) {
      console.log("error", error);
    }
  };

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
                {profile?.user?.display_name}
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
                {profile?.user?.username}
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
                    {profile?.user?.follower_count}
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
                    {profile?.user?.following_count}
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
                uri: profile?.user?.image,
              }}
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
              }}
            />
          </View>

          {/* Follow Button */}
          {profile?.user?.isFollowing ? (
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
              onPress={() => handleFollow()}
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
              onPress={() => handleFollow()}
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
