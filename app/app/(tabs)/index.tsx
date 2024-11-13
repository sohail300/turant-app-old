import {
  Image,
  StyleSheet,
  Platform,
  Text,
  Dimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";
import Card from "@/components/Card";

export default function HomeScreen() {
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
        paddingBottom: 24,
      }}
    >
      <FlatList
        keyExtractor={(item) => item.id}
        data={data}
        renderItem={({ item }) => (
          <Card
            heading={item.heading}
            imageUrl={item.imageUrl}
            content={item.content}
            author={item.author}
            authorImage={item.authorImage}
            details={item.details}
          />
        )}
      />
    </SafeAreaView>
  );
}
