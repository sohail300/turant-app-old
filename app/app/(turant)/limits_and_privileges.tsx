import { View, Text, Dimensions, StyleSheet } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { ScrollView } from "react-native-gesture-handler";
import { Entypo } from "@expo/vector-icons";
import { styles } from "@/constants/styles";
import { router } from "expo-router";

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
            Limits and Privileges
          </Text>
        </View>

        <View style={{ paddingHorizontal: 24, marginTop: 16, gap: 16 }}>
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

          <View style={fileStyles.table}>
            <View style={[fileStyles.tableRow, fileStyles.tableHeader]}>
              <Text
                style={[fileStyles.tableCell, fileStyles.tableHeaderTextLeft]}
              >
                Profile Status
              </Text>
              <Text style={[fileStyles.tableCell, fileStyles.tableHeaderText]}>
                Videos / Day
              </Text>
              <Text style={[fileStyles.tableCell, fileStyles.tableHeaderText]}>
                Max Duration
              </Text>
            </View>
            <View style={fileStyles.tableRow}>
              <View style={fileStyles.tableCellLeft}>
                <Text>Regular Profile</Text>
                <Text>Before 1k followers</Text>
              </View>
              <Text style={fileStyles.tableCell}>Up to 3</Text>
              <Text style={fileStyles.tableCell}>3 minutes</Text>
            </View>
            <View style={fileStyles.tableRow}>
              <View>
                <Text style={fileStyles.tableCellLeft}>Blue Tick</Text>
                <Text style={fileStyles.tableCellLeft}>After 1k followers</Text>
              </View>
              <Text style={fileStyles.tableCell}>Up to 5</Text>
              <Text style={fileStyles.tableCell}>5 minutes</Text>
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

const fileStyles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 5,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  tableHeader: {
    backgroundColor: Colors.light.header,
  },
  tableHeaderTextLeft: {
    textAlign: "center",
    fontFamily: "HindVadodara500",
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.subheading,
  },
  tableHeaderText: {
    textAlign: "center",
    fontFamily: "HindVadodara500",
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.subheading,
  },
  tableCellLeft: {
    flex: 1,
    paddingLeft: 8,
    textAlign: "left",
    fontFamily: "HindVadodara500",
    fontSize: 16,
    color: Colors.light.subheading,
    margin: 0,
  },
  tableCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    textAlign: "center",
    fontFamily: "HindVadodara500",
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.subheading,
  },
});
