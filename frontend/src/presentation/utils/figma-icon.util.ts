import { StyleSheet, type StyleProp, type TextStyle } from "react-native";

export interface FigmaIconProps {
    readonly size?: number,
    readonly color?: string,
    readonly style?: StyleProp<TextStyle>,
}

/**
 *
 * @param color
 * @param style
 */
export function resolveIconColor(color: string | undefined, style: StyleProp<TextStyle> | undefined): string {
    return color ?? StyleSheet.flatten(style)?.color?.toString() ?? "#1B1B1B";
}
