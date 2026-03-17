import { Stack } from "expo-router";
import * as React from "react";
import { View, Pressable } from "react-native";
import { SCREEN_OPTIONS } from "@/presentation/styles/screen-options";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Button } from "@/presentation/components/primitives/rnreusables/ui/button";
import { Plus } from "lucide-react-native";
import ListingItem from "@/presentation/components/domain/items/listing-item";
import { useGetListingsByUser } from "@/presentation/hooks";
import { useRouter } from "expo-router";

/**
 * Render the ListingsScreen component.
 * @returns The ListingsScreen component.
 */
export default function ListingsScreen(): React.JSX.Element {
    const router = useRouter();
    const { data } = useGetListingsByUser("Tim Timmerman");

    return (
        <>
            <Stack.Screen options={SCREEN_OPTIONS} />

            <View className="flex flex-col p-4 h-full">
                <View className="flex flex-wrap flex-row -m-1">
                    {data != null &&
                        data.map(listing => (<Pressable
                                key={listing.id}
                                className="w-1/2 p-1"
                                onPress={() => { router.push(`listings/${listing.id}`); }}
                            >
                                <ListingItem
key={listing.id}
                          listing={listing}
                      />
                            </Pressable>),)}
                </View>

                <View className="absolute p-4 bottom-0 right-0">
                    <Button
                        className="shadow-lg! shadow-black h-12 w-12"
                        onPress={() => { router.push("/create-listing"); }}
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
