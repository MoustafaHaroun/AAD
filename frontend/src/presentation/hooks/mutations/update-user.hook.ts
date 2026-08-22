import { UpdateUser, type UpdateUserParams } from "@/application/usecases";
import type { User } from "@/domain/entities";
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

const updateUser = new UpdateUser();

/**
 * Update a user, then invalidate cached users.
 * @returns The mutation for updating a user.
 */
export function useUpdateUser(): UseMutationResult<User, Error, UpdateUserParams> {
    const queryClient = useQueryClient();

    return useMutation<User, Error, UpdateUserParams>({
        mutationFn: async params => updateUser.execute(params),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: ["users.get.all"] });
            await queryClient.invalidateQueries({ queryKey: ["users.get", variables.id] });
        },
    });
}
