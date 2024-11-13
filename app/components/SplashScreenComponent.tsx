import { View, Text } from "react-native";
import React, { useEffect, useRef } from "react";
import LottieView from "lottie-react-native";

interface SplashScreenProps {
  onAnimationFinished: () => void;
}

const SplashScreenComponent: React.FC<SplashScreenProps> = ({
  onAnimationFinished,
}) => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    const animation = require("../assets/TN_app.json");

    // Start playing as soon as possible
    requestAnimationFrame(() => {
      animationRef.current?.play();
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#B22A2C",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <LottieView
        ref={animationRef}
        loop={false}
        autoPlay={false}
        onAnimationFinish={(isCancelled) => {
          if (!isCancelled) {
            onAnimationFinished();
          }
        }}
        source={require("../assets/TN_app.json")}
        style={{
          width: "100%",
          height: "100%",
          aspectRatio: 1,
          borderColor: "#00ff00",
          borderWidth: 4,
        }}
      />
    </View>
  );
};

export default SplashScreenComponent;
