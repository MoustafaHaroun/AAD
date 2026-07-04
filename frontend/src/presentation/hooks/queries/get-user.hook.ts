import { GetUser } from "@/application/usecases";
import type { User } from "@/domain/entities";
import { useQuery } from "@tanstack/react-query";

const getUser = new GetUser();

export function useGetUser(id: string) {
    return useQuery<User, Error>({
        queryKey: ["users.get", id],
        queryFn: () => getUser.execute({ id }),
        enabled: id != null,
    });
}
