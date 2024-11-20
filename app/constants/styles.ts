import Subheading from "@/components/Subheading";
import { StyleSheet } from "react-native";
import { Colors } from "./Colors";

export const styles = StyleSheet.create({
  heading: {
    fontFamily: "Lora700",
    fontSize: 20,
    lineHeight: 25.6,
    color: Colors.light.heading,
  },
  Subheading: {
    fontFamily: "HindVadodara600",
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.subheading,
  },
  RedText: {
    fontFamily: "OpenSans700",
    fontSize: 16,
    lineHeight: 22,
    color: Colors.light.accent,
  },
  ContentText: {
    fontFamily: "HindVadodara400",
    fontSize: 18,
    lineHeight: 27,
    color: Colors.light.text,
  },
  details: {
    fontFamily: "HindVadodara400",
    fontSize: 14,
    lineHeight: 21,
    color: Colors.light.details,
  },
  Subheading2: {
    fontFamily: "HindVadodara500",
    fontSize: 20,
    lineHeight: 30,
    color: Colors.light.subheading2,
  },
  buttonContainer: {
    backgroundColor: Colors.light.accent,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 5,
    marginVertical: 16,
    gap: 8,
  },
  button: {
    fontFamily: "HindVadodara500",
    fontSize: 16,
    lineHeight: 30,
    color: Colors.light.white,
    textAlign: "center",
  },
  buttonReverse: {
    fontFamily: "HindVadodara500",
    fontSize: 16,
    lineHeight: 30,
    color: Colors.light.accent,
    textAlign: "center",
  },
  iconText: {
    fontFamily: "OpenSans400",
    fontSize: 14,
    lineHeight: 19,
    color: Colors.light.icons,
  },
  errorText: {
    fontFamily: "HindVadodara500",
    color: "red",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  disclaimerText: {
    fontFamily: "HindVadodara400",
    fontSize: 14,
    lineHeight: 21,
    color: Colors.light.disclaimer,
  },
});
