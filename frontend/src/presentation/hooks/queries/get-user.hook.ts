import { GetUser } from "@/application/usecases";
import type { User } from "@/domain/entities";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

const getUser = new GetUser();

/**
 * Fetch a single user by id.
 * @param id - The user id.
 * @returns The query for the user.
 */
export function useGetUser(id: string): UseQueryResult<User> {
    return useQuery<User>({
        queryKey: ["users.get", id],
        queryFn: async () => getUser.execute({ id }),
        enabled: id != null,
    });
}
