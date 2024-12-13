import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { useDispatch } from "react-redux";
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

  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10); // Limit for each request
  const [offset, setOffset] = useState(0); // Offset for pagination
  const [loading, setLoading] = useState(false); // To avoid duplicate requests
  const [hasMore, setHasMore] = useState(true); // To stop fetching if no more data

  useEffect(() => {
    async function getIsAppSetup() {
      try {
        const value = await AsyncStorage.getItem("isAppSetup");
        if (value !== "true") {
          router.replace("/setup");
        }
      } catch (error) {
        console.error("Error getting isAppSetup:", error);
      }
    }
    getIsAppSetup();
  }, []);

  async function getData(initialLoad = false) {
    if (loading || !hasMore) return; // Avoid fetching if already loading or no more data
    setLoading(true);

    try {
      const response = await fetch(
        `${baseURL}/post/show-posts?limit=${limit}&offset=${offset}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const posts = await response.json();
      if (posts.length === 0) {
        setHasMore(false); // No more data to load
      } else {
        setData((prevData) => (initialLoad ? posts : [...prevData, ...posts]));
        setOffset((prevOffset) => prevOffset + limit); // Increment offset for next fetch
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
