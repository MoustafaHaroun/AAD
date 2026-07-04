import { CreateUser } from "@/application/usecases";
import type { User, CreateUserBody } from "@/domain/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createUser = new CreateUser();

export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation<User, Error, CreateUserBody>({
        mutationFn: (body) => createUser.execute(body),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["users.get.all"] });
        },
    });
}
