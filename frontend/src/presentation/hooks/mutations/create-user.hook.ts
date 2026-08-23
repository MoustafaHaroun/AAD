import { CreateUser } from "@/application/usecases";
import type { User, CreateUserBody } from "@/domain/entities";
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

const createUser = new CreateUser();

/**
 * Register a new user, then invalidate the cached user list.
 * @returns The mutation for creating a user.
 */
export function useCreateUser(): UseMutationResult<User, Error, CreateUserBody> {
    const queryClient = useQueryClient();

    return useMutation<User, Error, CreateUserBody>({
        mutationFn: async body => createUser.execute(body),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["users.get.all"] });
        },
    });
}
