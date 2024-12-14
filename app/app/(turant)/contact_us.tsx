import { View, Text, Dimensions, StyleSheet } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { FlatList, ScrollView, TextInput } from "react-native-gesture-handler";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/constants/styles";
import ContactCard from "@/components/ContactCard";
import { baseURL } from "@/constants/config";

const Component = () => {
  const [reporters, setReporters] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredReporters, setFilteredReporters] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const response = await fetch(`${baseURL}/info/contact`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setReporters(data.reporters);
      setFilteredReporters(data.reporters); // Initially display all reporters
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Debounce logic
  const debounceSearch = useCallback(() => {
    const timer = setTimeout(() => {
      if (searchText.trim() === "") {
        setFilteredReporters(reporters); // Show all reporters if search text is empty
      } else {
        const filtered = reporters.filter((reporter) =>
          reporter.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredReporters(filtered);
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchText, reporters]);

  // Trigger debounce on text change
  useEffect(() => {
    debounceSearch();
  }, [searchText]);

  const handleTextChange = (e) => {
    const newText = e.nativeEvent.text;
    setSearchText(newText);
  };

  const handleClearText = () => {
    setSearchText("");
  };

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
          marginTop: 56,
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
            Contact Us
          </Text>
        </View>

        <View
          style={{
            marginTop: 20,
            paddingHorizontal: 16,
            display: "flex",
            gap: 16,
          }}
        >
          <View style={[fileStyles.searchContainer]}>
            <Feather
              name="search"
              size={24}
              color={Colors.light.accent}
              style={fileStyles.searchIcon}
            />
            <TextInput
              style={fileStyles.searchInput}
              multiline={true}
              placeholder="Search for Nearby Reporters"
              placeholderTextColor={"#A8A8A8"}
              value={searchText}
              onChange={handleTextChange}
            />
            {searchText && (
              <MaterialIcons
                name="close"
                size={24}
                color={Colors.light.details}
                style={fileStyles.closeIcon}
                onPress={handleClearText}
              />
            )}
          </View>
          <FlatList
            scrollEnabled={false}
            keyExtractor={(item) => String(item.reporter_id)}
            data={filteredReporters}
            renderItem={({ item }) => (
              <ContactCard
                name={item.name}
                state={item.state}
                district={item.district}
                block={item.block}
                phone={item.phone}
                image={item.image}
              />
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Component;

const fileStyles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 4,
    backgroundColor: "white",
    width: "100%",
  },
  searchInput: {
    borderColor: Colors.light.border,
    borderWidth: 1,
    flex: 1,
    borderRadius: 5,
    minHeight: 48,
    paddingLeft: 48,
    marginVertical: 8,
  },
  closeIcon: {
    position: "absolute",
    right: 16,
  },
  searchIcon: {
    position: "absolute",
    left: 16,
  },
});
