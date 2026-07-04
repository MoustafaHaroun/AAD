import { Stack } from "expo-router";
import * as React from "react";
import { View, Pressable, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { SCREEN_OPTIONS } from "@/presentation/styles/screen-options";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Button } from "@/presentation/components/primitives/rnreusables/ui/button";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { Plus } from "lucide-react-native";
import ListingItem from "@/presentation/components/domain/items/listing-item";
import { useGetApiListings } from "@/presentation/hooks";
import { useRouter } from "expo-router";

export default function ListingsScreen(): React.JSX.Element {
    const router = useRouter();
    const { data, isFetching, isLoading, error, refetch } = useGetApiListings();

    return (
        <>
            <Stack.Screen options={SCREEN_OPTIONS} />

            <View className="flex-1">
                <ScrollView
                    contentContainerStyle={{ padding: 16, flexGrow: 1 }}
                    refreshControl={
                        <RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} />
                    }
                >
                    {isLoading && (
                        <View className="flex-1 items-center justify-center">
                            <ActivityIndicator />
                        </View>
                    )}

                    {error != null && (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-destructive text-sm text-center">{error.message}</Text>
                        </View>
                    )}

                    {Array.isArray(data) && data.length === 0 && (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-muted-foreground">No listings yet.</Text>
                        </View>
                    )}

                    <View className="flex flex-wrap flex-row -m-1">
                        {Array.isArray(data) &&
                            data.map(listing => (
                                <Pressable
                                    key={listing.id}
                                    className="w-1/2 p-1"
                                    onPress={() => { router.push(`/listings/${listing.id}`); }}
                                >
                                    <ListingItem listing={listing} />
                                </Pressable>
                            ))}
                    </View>
                </ScrollView>

                <View className="absolute p-4 bottom-0 right-0">
                    <Button
                        className="shadow-lg! shadow-black h-12 w-12"
                        onPress={() => { router.push("/listings/new"); }}
                    >
                        <Icon
                            as={Plus}
                            className="text-primary-foreground size-5"
                        />
                    </Button>
                </View>
            </View>
        </>
    );
}
