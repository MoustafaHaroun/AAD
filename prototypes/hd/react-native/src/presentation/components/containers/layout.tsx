import "@/presentation/styles/global.css";
import { NAV_THEME } from "@/presentation/styles/theme";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ActivityIndicator, Platform } from "react-native";
import { DATABASE_NAME, db } from "@/infrastructure/persistence/drizzle";
import migrations from "@/../drizzle/migrations";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Suspense } from "react";
import { SQLiteProvider } from "expo-sqlite";
import { KeyboardProvider } from "react-native-keyboard-controller";
import * as z from "zod";
import { en } from "zod/locales";

/**
 * Render the Layout component.
 * @returns The Layout component.
 */
export default function Layout() {
    const queryClient = new QueryClient();
    const { success, error } = useMigrations(db, migrations);
    const { colorScheme, setColorScheme } = useColorScheme();

    setColorScheme("light"); // Forcefully set to light theme.

    z.config(en());

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
                            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

                            <Stack />

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
