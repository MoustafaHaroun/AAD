import "react-native-get-random-values";
import "@/presentation/styles/global.css";
import { NAV_THEME } from "@/presentation/styles/theme";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ActivityIndicator, Platform, Text } from "react-native";
import { DATABASE_NAME, db } from "@/infrastructure/persistence/drizzle";
import migrations from "@/../drizzle/migrations";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Suspense, useEffect, useState } from "react";
import { SQLiteProvider } from "expo-sqlite";
import { KeyboardProvider } from "react-native-keyboard-controller";
import * as z from "zod";
import { en } from "zod/locales";
import {
    NotoSans_400Regular,
    NotoSans_500Medium,
    NotoSans_600SemiBold,
    NotoSans_700Bold,
    NotoSans_900Black,
    useFonts,
} from "@expo-google-fonts/noto-sans";
import { tokenStore } from "@/infrastructure/api";
import { BRAND_COLORS } from "@/presentation/styles/theme";
import { initLanguage } from "@/presentation/i18n";

/**
 * Render the Layout component.
 * @returns The Layout component.
 */
export default function Layout() {
    const queryClient = new QueryClient();
    const { success, error } = useMigrations(db, migrations);
    const { colorScheme, setColorScheme } = useColorScheme();
    const [fontsLoaded] = useFonts({
        NotoSans_400Regular,
        NotoSans_500Medium,
        NotoSans_600SemiBold,
        NotoSans_700Bold,
        NotoSans_900Black,
    });
    const [tokenHydrated, setTokenHydrated] = useState(false);
    const [languageReady, setLanguageReady] = useState(false);

    setColorScheme("light"); // Forcefully set to light theme.

    z.config(en());

    useEffect(() => {
        void tokenStore.hydrate().then(() => setTokenHydrated(true));
        void initLanguage().then(() => setLanguageReady(true));
    }, []);

    if (error) {
        return (<Text>Shit broke</Text>)
    }

    if (!success) {
        return (<Text>Shit is trying</Text>)
    }

    if (!fontsLoaded || !tokenHydrated || !languageReady) {
        return (<ActivityIndicator />);
    }

    return (
        <Suspense fallback={<ActivityIndicator />}>
            <SQLiteProvider
                databaseName={DATABASE_NAME}
                options={{ enableChangeListener: true }}
                useSuspense
            >
                <QueryClientProvider client={queryClient}>
                    <KeyboardProvider>
                        <ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
                            <StatusBar backgroundColor={BRAND_COLORS.primary} style="dark" />

                            <Stack>
                                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                            </Stack>

                            <PortalHost />

                            {Platform.OS === "web" &&
                                <ReactQueryDevtools initialIsOpen={false} />}
                        </ThemeProvider>
                    </KeyboardProvider>
                </QueryClientProvider>
            </SQLiteProvider>
        </Suspense>
    );
}
