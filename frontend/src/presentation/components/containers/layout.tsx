import "react-native-get-random-values";
import "@/presentation/styles/global.css";
import { NAV_THEME, BRAND_COLORS } from "@/presentation/styles/theme";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/query-persist-client-core";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ActivityIndicator, Platform, Text } from "react-native";
import { DATABASE_NAME, db } from "@/infrastructure/persistence/drizzle";
import migrations from "@/../drizzle/migrations";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import * as React from "react";
import { Suspense, useEffect, useState } from "react";
import { SQLiteProvider } from "expo-sqlite";
import { KeyboardProvider } from "react-native-keyboard-controller";
import * as z from "zod";
import { en } from "zod/locales";
/* eslint-disable camelcase */
import {
    NotoSans_400Regular,
    NotoSans_500Medium,
    NotoSans_600SemiBold,
    NotoSans_700Bold,
    NotoSans_900Black,
    useFonts,
} from "@expo-google-fonts/noto-sans";
/* eslint-enable camelcase */
import { tokenStore, queryClient, queryPersister } from "@/infrastructure/api";
import { initLanguage } from "@/presentation/i18n";

const PERSIST_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;

/**
 * Render the app's root layout: font/migration/auth/language gating, then
 * the query, keyboard, theme, and navigation providers.
 * @returns The rendered root layout.
 */
export default function Layout(): React.JSX.Element {
    const { success, error } = useMigrations(db, migrations);
    const nativewindColorScheme = useColorScheme();
    const { colorScheme } = nativewindColorScheme;
    /* eslint-disable camelcase, typescript/naming-convention */
    const [fontsLoaded] = useFonts({
        NotoSans_400Regular,
        NotoSans_500Medium,
        NotoSans_600SemiBold,
        NotoSans_700Bold,
        NotoSans_900Black,
    });
    /* eslint-enable camelcase, typescript/naming-convention */
    const [tokenHydrated, setTokenHydrated] = useState(false);
    const [languageReady, setLanguageReady] = useState(false);

    nativewindColorScheme.setColorScheme("light"); // Forcefully set to light theme.

    z.config(en());

    useEffect(() => {
        void tokenStore.hydrate().then(() => {
            setTokenHydrated(true);
        });
        void initLanguage().then(() => {
            setLanguageReady(true);
        });

        const [unsubscribe] = persistQueryClient({
            queryClient,
            persister: queryPersister,
            maxAge: PERSIST_MAX_AGE_MS,
        });

        return unsubscribe;
    }, []);

    if (error) {
        return <Text>Shit broke</Text>;
    }

    if (!success) {
        return <Text>Shit is trying</Text>;
    }

    if (!fontsLoaded || !tokenHydrated || !languageReady) {
        return <ActivityIndicator />;
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
                            <StatusBar
                                backgroundColor={BRAND_COLORS.primary}
                                style="dark" // eslint-disable-line react/style-prop-object
                            />

                            <Stack>
                                <Stack.Screen
                                    name="(tabs)"
                                    options={{ headerShown: false }}
                                />
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
