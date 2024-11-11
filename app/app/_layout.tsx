import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text } from "react-native";
import { FontContext } from "@/context/FontContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Lora700: require("../assets/fonts/Lora700.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <FontContext.Provider value={fontsLoaded}>
      <GestureHandlerRootView onLayout={onLayoutRootView}>
        <Text
          style={[
            { fontSize: 40, color: "red" }, // Test if basic styles work
            { fontFamily: "Lora700" }, // Test if font family works
          ]}
        >
          Test
        </Text>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </GestureHandlerRootView>
    </FontContext.Provider>
  );
}
