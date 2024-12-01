import React, { useRef } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Feather from "@expo/vector-icons/Feather";
import { styles } from "@/constants/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";

const LogoutBottomSheet = ({ close }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <View style={StyleSheet.absoluteFill}>
      <BottomSheet
        ref={bottomSheetRef}
        overDragResistanceFactor={0}
        snapPoints={["23%"]}
        handleIndicatorStyle={{ display: "none" }}
        handleStyle={{
          height: 0,
          padding: 0,
          margin: 0,
        }}
        containerHeight={Dimensions.get("window").height}
        enablePanDownToClose={true}
        onClose={close}
        style={{
          backgroundColor: "#fff", // Ensure background is set
          shadowColor: "#000", // Shadow color
          shadowOffset: { width: 0, height: -2 }, // Top shadow with a negative height
          shadowOpacity: 0.5, // Opacity of the shadow
          shadowRadius: 4, // Blur radius
          elevation: 12, // For Android
          borderRadius: 10,
        }}
      >
        <BottomSheetView
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            borderRadius: 8,
          }}
        >
          <View
            style={{
              borderBottomColor: "#B1B1B1",
              borderBottomWidth: 1,
              width: Dimensions.get("window").width,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <View
              style={{
                paddingVertical: 20,
              }}
            >
              <Text
                style={{
                  ...styles.ContentText,
                  fontFamily: "HindVadodara500",
                  color: Colors.light.subheading,
                  textAlign: "center",
                }}
              >
                Are your sure, you want to logout?
              </Text>
            </View>
            <View
              style={{
                borderTopColor: Colors.light.border,
                borderTopWidth: 1,
                paddingVertical: 16,
              }}
            >
              <TouchableOpacity onPress={close}>
                <Text
                  style={{
                    ...styles.Subheading2,
                    color: Colors.light.accent,
                    textAlign: "center",
                  }}
                >
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                borderTopColor: Colors.light.border,
                borderTopWidth: 1,
                paddingVertical: 16,
              }}
            >
              <TouchableOpacity onPress={close}>
                <Text
                  style={{
                    ...styles.Subheading2,
                    color: Colors.light.subheading,
                    textAlign: "center",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default LogoutBottomSheet;
