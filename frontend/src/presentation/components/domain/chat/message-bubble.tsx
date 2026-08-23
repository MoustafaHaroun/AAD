import * as React from "react";
import { View } from "react-native";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { cn } from "@/presentation/utils/cn.util";

interface MessageBubbleProps {
    readonly content: string,
    readonly isOwn: boolean,
}

/**
 * Render a single chat message bubble, aligned by whether the viewer sent it.
 * @param props - The props.
 * @param props.content - The message text.
 * @param props.isOwn - Whether the viewer is the sender, controlling alignment/color.
 * @returns The rendered bubble.
 */
export function MessageBubble({ content, isOwn }: MessageBubbleProps): React.JSX.Element {
    return (
        <View className={cn("max-w-[80%] rounded-[10px] px-4 py-3", isOwn ? "self-end bg-primdesat" : "self-start bg-white")}>
            <Text className="font-noto text-[16px] text-black">{content}</Text>
        </View>
    );
}
