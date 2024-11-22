import React, { useRef } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { styles } from "@/constants/styles";
import { Colors } from "@/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";

const RestrictedBottomSheet = ({ close }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <View style={StyleSheet.absoluteFill}>
      <BottomSheet
        ref={bottomSheetRef}
        overDragResistanceFactor={0}
        snapPoints={["45%"]}
        handleIndicatorStyle={{ display: "none" }}
        handleStyle={{
          height: 0,
          padding: 0,
          margin: 0,
        }}
        containerHeight={Dimensions.get("window").height}
        enablePanDownToClose={true}
        onClose={close}
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
              padding: 24,
            }}
          >
            <View
              style={{
                display: "flex",
                alignItems: "flex-end",
              }}
            >
              <AntDesign name="close" size={24} color="black" onPress={close} />
            </View>
            <View
              style={{
                paddingTop: 12,
                paddingBottom: 16,
                borderBottomColor: "#B1B1B1",
                borderBottomWidth: 1,
              }}
            >
              <Text
                style={{
                  ...styles.ContentText,
                  fontFamily: "HindVadodara500",
                  color: Colors.light.accent,
                }}
              >
                Your upload feature is temporarily disabled as your account is
                blocked for 3 days due to not following instructions. You can
                still view other posts.
              </Text>
            </View>
            <View
              style={{
                paddingVertical: 16,
              }}
            >
              <Text
                style={{
                  ...styles.ContentText,
                  fontFamily: "HindVadodara500",
                  color: Colors.light.black,
                  fontSize: 20,
                }}
              >
                Admin Note:
              </Text>
              <Text
                style={{
                  ...styles.ContentText,
                  fontFamily: "HindVadodara500",
                  color: Colors.light.subheading,
                }}
              >
                This action was taken due to a violation in your recent post.
                Please review the following post to understand the issue.
              </Text>
              <Text
                style={{
                  ...styles.ContentText,
                  fontFamily: "HindVadodara500",
                  color: Colors.light.link,
                  textDecorationLine: "underline",
                  marginTop: 4,
                }}
              >
                turant.com/aabb
              </Text>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default RestrictedBottomSheet;
