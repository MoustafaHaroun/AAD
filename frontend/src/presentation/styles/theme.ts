import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native";

/**
 * Raw hex values for the Trade² brand palette, for APIs (e.g. React Navigation's
 * `headerStyle`) that can't consume NativeWind classes or CSS variables.
 */
export const BRAND_COLORS = {
    primary: "#F7DF6E",
    prim: "#FCC010",
    sec: "#F28D1B",
    primdesat: "#EBE0AD",
    forehued: "#38362E",
    surfhued: "#EDEBE3",
    black: "#1B1B1B",
};

export const THEME = {
    light: {
        background: "hsl(0 0% 100%)",
        foreground: "hsl(0 0% 3.9%)",
        card: "hsl(0 0% 100%)",
        cardForeground: "hsl(0 0% 3.9%)",
        popover: "hsl(0 0% 100%)",
        popoverForeground: "hsl(0 0% 3.9%)",
        primary: "hsl(49.5 89.5% 70.0%)",
        primaryForeground: "hsl(0 0% 10.6%)",
        secondary: "hsl(0 0% 96.1%)",
        secondaryForeground: "hsl(0 0% 9%)",
        muted: "hsl(0 0% 96.1%)",
        mutedForeground: "hsl(0 0% 45.1%)",
        accent: "hsl(0 0% 96.1%)",
        accentForeground: "hsl(0 0% 9%)",
        destructive: "hsl(0 84.2% 60.2%)",
        border: "hsl(0 0% 89.8%)",
        input: "hsl(0 0% 89.8%)",
        ring: "hsl(0 0% 63%)",
        radius: "0.625rem",
        chart1: "hsl(12 76% 61%)",
        chart2: "hsl(173 58% 39%)",
        chart3: "hsl(197 37% 24%)",
        chart4: "hsl(43 74% 66%)",
        chart5: "hsl(27 87% 67%)",
        // Trade² brand tokens
        prim: "hsl(44.7 97.5% 52.5%)",
        sec: "hsl(31.8 89.2% 52.7%)",
        primdesat: "hsl(49.4 60.8% 80.0%)",
        forehued: "hsl(48.0 9.8% 20.0%)",
        surfhued: "hsl(48.0 21.7% 91.0%)",
    },
    dark: {
        background: "hsl(0 0% 3.9%)",
        foreground: "hsl(0 0% 98%)",
        card: "hsl(0 0% 3.9%)",
        cardForeground: "hsl(0 0% 98%)",
        popover: "hsl(0 0% 3.9%)",
        popoverForeground: "hsl(0 0% 98%)",
        primary: "hsl(0 0% 98%)",
        primaryForeground: "hsl(0 0% 9%)",
        secondary: "hsl(0 0% 14.9%)",
        secondaryForeground: "hsl(0 0% 98%)",
        muted: "hsl(0 0% 14.9%)",
        mutedForeground: "hsl(0 0% 63.9%)",
        accent: "hsl(0 0% 14.9%)",
        accentForeground: "hsl(0 0% 98%)",
        destructive: "hsl(0 70.9% 59.4%)",
        border: "hsl(0 0% 14.9%)",
        input: "hsl(0 0% 14.9%)",
        ring: "hsl(300 0% 45%)",
        radius: "0.625rem",
        chart1: "hsl(220 70% 50%)",
        chart2: "hsl(160 60% 45%)",
        chart3: "hsl(30 80% 55%)",
        chart4: "hsl(280 65% 60%)",
        chart5: "hsl(340 75% 55%)",
    },
};

export const NAV_THEME: Record<"light" | "dark", Theme> = {
    light: {
        ...DefaultTheme,
        colors: {
            background: THEME.light.background,
            border: THEME.light.border,
            card: THEME.light.card,
            notification: THEME.light.destructive,
            primary: THEME.light.primary,
            text: THEME.light.foreground,
        },
    },
    dark: {
        ...DarkTheme,
        colors: {
            background: THEME.dark.background,
            border: THEME.dark.border,
            card: THEME.dark.card,
            notification: THEME.dark.destructive,
            primary: THEME.dark.primary,
            text: THEME.dark.foreground,
        },
    },
};
