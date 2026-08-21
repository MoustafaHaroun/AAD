import LandingScreen from "@/presentation/screens/landing.screen";
import * as React from "react";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { tokenStore } from "@/infrastructure/api";

/**
 *
 */
export default function Screen() {
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
