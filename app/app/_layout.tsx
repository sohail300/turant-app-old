import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useRef, useState } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Easing, Pressable, Text, View } from "react-native";
import { FontContext } from "@/context/FontContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";
import RedText from "@/components/RedText";
import SplashScreenComponent from "@/components/SplashScreenComponent";
import Animated, { FadeIn } from "react-native-reanimated";
import { Provider } from "react-redux";
import store from "@/store/store";

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);
  const router = useRouter();

  const [fontsLoaded, fontsError] = useFonts({
    Lora700: require("../assets/fonts/Lora700.ttf"),
    HindVadodara400: require("../assets/fonts/HindVadodara400.ttf"),
    HindVadodara500: require("../assets/fonts/HindVadodara500.ttf"),
    HindVadodara600: require("../assets/fonts/HindVadodara600.ttf"),
    HindVadodara700: require("../assets/fonts/HindVadodara700.ttf"),
    OpenSans400: require("../assets/fonts/OpenSans400.ttf"),
    OpenSans700: require("../assets/fonts/OpenSans700.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      // SplashScreen.hideAsync();
    }
  }, [fontsLoaded || fontsError]);

  if (!fontsLoaded || fontsError || !splashAnimationFinished) {
    return (
      <SplashScreenComponent
        onAnimationFinished={() => setSplashAnimationFinished(true)}
      />
    );
  }

  return (
    <FontContext.Provider value={fontsLoaded}>
      <Provider store={store}>
        <GestureHandlerRootView>
          <Animated.View style={{ flex: 1 }} entering={FadeIn.duration(300)}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(turant)" options={{ headerShown: false }} />
              <Stack.Screen name="(upload)" options={{ headerShown: false }} />
              <Stack.Screen
                name="single-news"
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
              <Stack.Screen
                name="other-profile"
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
              <Stack.Screen
                name="edit-profile"
                options={{
                  headerShown: true,
                  headerTitle: "Edit Profile",
                  headerTitleAlign: "center",
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
                            color={Colors.light.icons}
                          />
                        </View>
                      </Pressable>
                    );
                  },
                }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>
          </Animated.View>
        </GestureHandlerRootView>
      </Provider>
    </FontContext.Provider>
  );
}
