import { GetAllUsers } from "@/application/usecases";
import type { User } from "@/domain/entities";
import { useQuery } from "@tanstack/react-query";

const getAllUsers = new GetAllUsers();

export function useGetAllUsers() {
    return useQuery<User[], Error>({
        queryKey: ["users.get.all"],
        queryFn: () => getAllUsers.execute(),
    });
}
