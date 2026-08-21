import * as React from "react";
import { Image, View } from "react-native";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";

const INITIAL_COLORS = ["#38362E", "#F28D1B", "#4C6B54", "#5B4B8A", "#B23A48", "#2E6E8E"];

/**
 *
 * @param seed
 */
function colorFor(seed: string): string {
    let hash = 0;

    for (let i = 0; i < seed.length; i++) {
        hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
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
 * A circular user avatar — the user's photo if set, otherwise a colored
 * circle with their initials (color derived deterministically from their id).
 * @param root0
 * @param root0.id
 * @param root0.firstname
 * @param root0.surname
 * @param root0.avatar
 * @param root0.size
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
