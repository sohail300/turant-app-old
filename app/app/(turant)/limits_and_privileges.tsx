import { View, Text, Dimensions, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { ScrollView } from "react-native-gesture-handler";
import { styles } from "@/constants/styles";

const Component = () => {
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
            Limits and Privileges
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 16, gap: 16 }}>
          <Text
            style={{
              fontFamily: "HindVadodara500",
              fontSize: 16,
              lineHeight: 24,
              color: Colors.light.subheading,
            }}
          >
            Video Upload Limits and Privileges by Follower Count
          </Text>

          <View style={tableStyles.container}>
            <View style={tableStyles.headerRow}>
              <Text style={[tableStyles.headerCell, tableStyles.profileCell]}>
                Profile Status
              </Text>
              <Text style={[tableStyles.centerCell, tableStyles.headerCell]}>
                Videos / Day
              </Text>
              <Text style={[tableStyles.centerCell, tableStyles.headerCell]}>
                Max Duration
              </Text>
            </View>
            <View style={tableStyles.row}>
              <View style={tableStyles.profileCellContainer}>
                <Text style={tableStyles.profileMainText}>Regular Profile</Text>
                <Text style={tableStyles.profileSubText} numberOfLines={1}>
                  Before 1k followers
                </Text>
              </View>
              <Text style={tableStyles.centerCell}>Up to 3</Text>
              <Text style={tableStyles.centerCell}>3 minutes</Text>
            </View>
            <View style={tableStyles.row}>
              <View style={tableStyles.profileCellContainer}>
                <Text style={tableStyles.profileMainText}>Blue Tick</Text>
                <Text style={tableStyles.profileSubText} numberOfLines={1}>
                  After 1k followers
                </Text>
              </View>
              <Text style={tableStyles.centerCell}>Up to 5</Text>
              <Text style={tableStyles.centerCell}>5 minutes</Text>
            </View>
          </View>

          <Text
            style={{
              fontFamily: "HindVadodara500",
              fontSize: 16,
              lineHeight: 24,
              color: Colors.light.subheading,
            }}
          >
            *Note: There are no restrictions on the number of text articles or
            image uploads.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Component;

const tableStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: Colors.light.header,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingVertical: 12,
  },
  headerCell: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: "HindVadodara600",
    fontSize: 14,
    color: Colors.light.subheading,
  },
  profileCell: {
    paddingLeft: 12,
    textAlign: "left",
  },
  centerCell: {
    textAlign: "center",
    flex: 1,
    fontFamily: "HindVadodara500",
    color: Colors.light.subheading,
  },
  profileCellContainer: {
    flex: 1,
    paddingLeft: 12,
  },
  profileMainText: {
    fontFamily: "HindVadodara500",
    fontSize: 15,
    color: Colors.light.subheading,
  },
  profileSubText: {
    fontFamily: "HindVadodara500",
    fontSize: 13,
    color: Colors.light.subheading2,
    marginTop: 2,
  },
});
