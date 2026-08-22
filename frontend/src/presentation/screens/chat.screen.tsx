import { Stack, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Send } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { AppHeader } from "@/presentation/components/containers/app-header";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Input } from "@/presentation/components/primitives/rnreusables/ui/input";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { UserAvatar } from "@/presentation/components/primitives/user-avatar";
import { MessageBubble } from "@/presentation/components/domain/chat/message-bubble";
import { useCreateMessage, useCurrentUserId, useGetMessages, useGetUser, useNetworkStatus } from "@/presentation/hooks";
import { formatDateDivider } from "@/presentation/utils/format-timestamp.util";
import { cn } from "@/presentation/utils/cn.util";

/**
 *
 */
export default function ChatScreen(): React.JSX.Element {
    const { t } = useTranslation();
    const { userId } = useLocalSearchParams<{ userId: string }>();
    const currentUserId = useCurrentUserId();
    const { data: counterpart } = useGetUser(userId);
    const { data: messages } = useGetMessages();
    const { mutate: sendMessage, isPending } = useCreateMessage();
    const isOnline = useNetworkStatus();
    const [draft, setDraft] = useState("");

    const thread = useMemo(
        () => messages
            ?.filter(m => m.sender.id === userId || m.recipient.id === userId)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) ?? [],
        [messages, userId],
    );

    /**
     *
     */
    function onSend() {
        const content = draft.trim();

        if (content.length === 0 || isPending || !isOnline) { return; }

        sendMessage(
            { content, recipientId: userId },
            { onSuccess: () => { setDraft(""); } },
        );
    }

    let lastDateLabel: string | null = null;

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex-1 bg-background">
                <AppHeader />

                {counterpart != null &&
                    <View className="flex-row items-center gap-3 border-b border-border bg-background p-3">
                        <UserAvatar
                            avatar={counterpart.avatar}
                            firstname={counterpart.firstname}
                            id={counterpart.id}
                            surname={counterpart.surname}
                        />

                        <Text className="text-[20px] font-noto-bold text-black">
                            {counterpart.firstname} {counterpart.surname}
                        </Text>
                    </View>}

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <ScrollView
                        className="flex-1 bg-surfhued"
                        contentContainerStyle={{ gap: 8, padding: 16 }}
                    >
                        {thread.map(message => {
                            const dateLabel = formatDateDivider(message.createdAt);
                            const showDivider = dateLabel !== lastDateLabel;

                            lastDateLabel = dateLabel;

                            return (
                                <React.Fragment key={message.id}>
                                    {showDivider
                                        ? <Text className="my-2 text-center font-noto-bold text-[16px] text-black">
                                                {dateLabel}
                                            </Text>
                                        : null}

                                    <MessageBubble
                                        content={message.content}
                                        isOwn={message.sender.id === currentUserId}
                                    />
                                </React.Fragment>
                            );
                        })}

                        {thread.length === 0 &&
                            <Text className="mt-8 text-center text-muted-foreground">
                                {t("chats.sayHello")}
                            </Text>}
                    </ScrollView>

                    <View className="flex-row items-center gap-3 bg-background p-4">
                        <Input
                            className="h-14 flex-1 rounded-[10px] border-[1.5px] border-forehued px-[25px] font-noto-medium text-[16px] text-forehued"
                            onChangeText={setDraft}
                            onSubmitEditing={onSend}
                            placeholder={t("chats.sendMessage")}
                            returnKeyType="send"
                            value={draft}
                        />

                        <Pressable
                            accessibilityLabel={t("common.send")}
                            accessibilityRole="button"
                            className={cn("overflow-hidden rounded-[10px]", !isOnline && "opacity-50")}
                            disabled={!isOnline}
                            onPress={onSend}
                        >
                            <LinearGradient
                                colors={["#FCC010", "#F28D1B"]}
                                end={{ x: 1, y: 1 }}
                                start={{ x: 0, y: 0 }}
                                style={{ alignItems: "center", height: 56, justifyContent: "center", width: 56 }}
                            >
                                <Icon
                                    as={Send}
                                    className="size-6 text-black"
                                />
                            </LinearGradient>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </>
    );
}
