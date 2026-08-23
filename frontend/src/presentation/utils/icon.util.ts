import { StyleSheet, type StyleProp, type TextStyle } from "react-native";

export interface FigmaIconProps {
    readonly size?: number,
    readonly color?: string,
    readonly style?: StyleProp<TextStyle>,
}

/**
 * Resolve an icon's color, preferring an explicit prop over one baked into a style object.
 * @param color - An explicit color override, if given.
 * @param style - A style that may itself carry a `color`.
 * @returns The resolved color, falling back to the design system's default.
 */
export function resolveIconColor(color: string | undefined, style: StyleProp<TextStyle> | undefined): string {
    return color ?? StyleSheet.flatten(style)?.color?.toString() ?? "#1B1B1B";
}
