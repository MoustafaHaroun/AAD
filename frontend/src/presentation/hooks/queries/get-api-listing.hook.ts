import { GetApiListing } from "@/application/usecases";
import type { ApiListing } from "@/domain/entities";
import { useQuery } from "@tanstack/react-query";

const getApiListing = new GetApiListing();

export function useGetApiListing(id: string) {
    return useQuery<ApiListing, Error>({
        queryKey: ["api-listings.get", id],
        queryFn: () => getApiListing.execute({ id }),
        enabled: id != null,
    });
}
