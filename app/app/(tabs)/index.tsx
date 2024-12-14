import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { initializeLanguage } from "@/store/LanguageSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { initializeLocation } from "@/store/LocationSlice";
import CardFlatlistComponent from "@/components/CardFlatlistComponent";
import { initializeAuth } from "@/store/AuthSlice";
import { baseURL } from "@/constants/config";
import { initializeToken } from "@/store/TokenSlice";

export default function HomeScreen() {
  const dispatch = useDispatch();
  initializeLanguage(dispatch);
  initializeLocation(dispatch);
  initializeAuth(dispatch);
  initializeToken(dispatch);

  const token = useSelector((state) => state.token.data);

  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10); // Limit for each request
  const [offset, setOffset] = useState(0); // Offset for pagination
  const [loading, setLoading] = useState(false); // To avoid duplicate requests
  const [hasMore, setHasMore] = useState(true); // To stop fetching if no more data

  useEffect(() => {
    async function initializeApp() {
      try {
        let value = await AsyncStorage.getItem("isAppSetup");
        if (value === null) {
          await AsyncStorage.setItem("isAppSetup", "false");
          value = "false";
        }
        if (value !== "true") {
          router.replace("/setup");
        }
      } catch (error) {
        console.error("Error getting isAppSetup:", error.message || error);
      }
    }
    initializeApp();
  }, []);

  const adData = [
    {
      ad_id: 1,
      target_url: "https://www.zomato.com/",
      image: "https://d3i5efosrgchej.cloudfront.net/media/zomato.jpg",
      videoUrl: "",
    },
    {
      ad_id: 2,
      target_url: "https://www.zomato.com/",
      image: "",
      videoUrl: "https://d3i5efosrgchej.cloudfront.net/media/sample.mp4",
    },
    {
      ad_id: 3,
      target_url: "https://www.zomato.com/",
      image: "https://d3i5efosrgchej.cloudfront.net/media/zomato.jpg",
      videoUrl: "",
    },
  ];

  function interleaveAds(newsData, adData) {
    const result = [];
    let adIndex = 0;

    for (let i = 0; i < newsData.length; i++) {
      result.push(newsData[i]);
      if ((i + 1) % 3 === 0 && adIndex < adData.length) {
        result.push({ ...adData[adIndex], isAd: true });
        adIndex = (adIndex + 1) % adData.length; // Cycle through ads
      }
    }
    return result;
  }

  async function getData(initialLoad = false) {
    if (loading || !hasMore) return; // Avoid fetching if already loading or no more data
    setLoading(true);

    try {
      const response = await fetch(
        `${baseURL}/post/show-posts?limit=${limit}&offset=${offset}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const posts = await response.json();
        if (posts.length === 0) {
          setHasMore(false); // No more data to load
        } else {
          const newsWithAds = interleaveAds(posts, adData);
          setData((prevData) =>
            initialLoad ? newsWithAds : [...prevData, ...newsWithAds]
          );
          setOffset((prevOffset) => prevOffset + limit); // Increment offset for next fetch
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData(true); // Initial load
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: `${Colors.light.background}`,
        height: Dimensions.get("window").height,
        paddingBottom: 24,
      }}
    >
      <CardFlatlistComponent
        data={data}
        onEndReachedThreshold={0.5} // Load more when 50% of the list is scrolled
        onEndReached={() => getData()} // Fetch more data
      />
    </SafeAreaView>
  );
}
