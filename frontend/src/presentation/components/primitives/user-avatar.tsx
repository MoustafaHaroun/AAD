import * as React from "react";
import { Image, View } from "react-native";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";

const INITIAL_COLORS = ["#38362E", "#F28D1B", "#4C6B54", "#5B4B8A", "#B23A48", "#2E6E8E"];

/**
 * Derive a deterministic color for a given seed string.
 * @param seed - The string to derive the color from (typically a user id).
 * @returns A hex color from the fixed initials-color palette.
 */
function colorFor(seed: string): string {
    let hash = 0;

    for (let i = 0; i < seed.length; i++) {
        hash = ((hash * 31) + seed.charCodeAt(i)) >>> 0;
    }

    return INITIAL_COLORS[hash % INITIAL_COLORS.length];
}

interface UserAvatarProps {
    readonly id: string,
    readonly firstname: string,
    readonly surname: string,
    readonly avatar?: string | null,
    readonly size?: number,
}

/**
 * Render a circular user avatar — the user's photo if set, otherwise a colored circle with their initials.
 * @param props - The props.
 * @param props.id - The user's id, used to derive a deterministic fallback color.
 * @param props.firstname - The user's first name, used for the fallback initial.
 * @param props.surname - The user's surname, used for the fallback initial.
 * @param props.avatar - The user's photo URI, if set.
 * @param props.size - The avatar's diameter in pixels.
 * @returns The rendered avatar.
 */
export function UserAvatar({ id, firstname, surname, avatar, size = 48 }: UserAvatarProps): React.JSX.Element {
    if (avatar != null) {
        return (
            <Image
                source={{ uri: avatar }}
                style={{ borderRadius: size / 2, height: size, width: size }}
            />
        );
    }

    const initials = `${firstname.charAt(0)}${surname.charAt(0)}`.toUpperCase();

    return (
        <View
            className="items-center justify-center"
            style={{ backgroundColor: colorFor(id), borderRadius: size / 2, height: size, width: size }}
        >
            <Text
                className="font-noto-bold text-white"
                style={{ fontSize: size * 0.4 }}
            >
                {initials}
            </Text>
        </View>
    );
}
