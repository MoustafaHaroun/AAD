import { GetAllUsers } from "@/application/usecases";
import type { User } from "@/domain/entities";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

const getAllUsers = new GetAllUsers();

/**
 * Fetch all users.
 * @returns The query for all users.
 */
export function useGetAllUsers(): UseQueryResult<User[]> {
    return useQuery<User[]>({
        queryKey: ["users.get.all"],
        queryFn: async () => getAllUsers.execute(),
    });
}
