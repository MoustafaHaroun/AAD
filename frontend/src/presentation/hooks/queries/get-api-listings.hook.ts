import { GetApiListings } from "@/application/usecases";
import type { ApiListing } from "@/domain/entities";
import { useQuery } from "@tanstack/react-query";

const getApiListings = new GetApiListings();

export function useGetApiListings() {
    return useQuery<ApiListing[], Error>({
        queryKey: ["api-listings.get"],
        queryFn: () => getApiListings.execute(),
    });
}
