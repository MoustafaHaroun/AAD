import LandingScreen from "@/presentation/screens/landing.screen";
import * as React from "react";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { tokenStore } from "@/infrastructure/api";

/**
 * Render the landing route, redirecting to Home when already signed in.
 * @returns The rendered landing screen, or null while redirecting a signed-in user.
 */
export default function Screen(): React.JSX.Element | null {
    const router = useRouter();

    useEffect(() => {
        if (tokenStore.get() != null) {
            router.replace("/home");
        }
    }, []);

    if (tokenStore.get() != null) {
        return null;
    }

    return <LandingScreen />;
}
