import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useRef } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Animated, Easing, Pressable, Text, View } from "react-native";
import { FontContext } from "@/context/FontContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";
import RedText from "@/components/RedText";
import LottieView from "lottie-react-native";

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Lora700: require("../assets/fonts/Lora700.ttf"),
    HindVadodara400: require("../assets/fonts/HindVadodara400.ttf"),
    HindVadodara500: require("../assets/fonts/HindVadodara500.ttf"),
    HindVadodara600: require("../assets/fonts/HindVadodara600.ttf"),
    OpenSans400: require("../assets/fonts/OpenSans400.ttf"),
    OpenSans700: require("../assets/fonts/OpenSans700.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const animationProgress = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);

  if (!fontsLoaded) {
    return (
      <AnimatedLottieView
        source={require("../assets/TN_app.json")}
        progress={animationProgress.current}
        style={{ width: "100%", height: "100%" }}
      />
    );
  }

  return (
    <FontContext.Provider value={fontsLoaded}>
      <GestureHandlerRootView onLayout={onLayoutRootView}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="SingleNews"
            options={{
              headerShown: true,
              headerTitle: "",
              headerTransparent: true,
              headerLeft: () => {
                return (
                  <Pressable onPress={() => router.back()}>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Ionicons
                        name="chevron-back"
                        size={24}
                        color={Colors.light.accent}
                      />
                      <RedText>Back</RedText>
                    </View>
                  </Pressable>
                );
              },
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </GestureHandlerRootView>
    </FontContext.Provider>
  );
}
