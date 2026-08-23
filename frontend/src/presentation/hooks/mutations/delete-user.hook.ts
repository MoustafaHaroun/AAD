import { DeleteUser, type DeleteUserParams } from "@/application/usecases";
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

const deleteUser = new DeleteUser();

/**
 * Delete a user, then invalidate cached users.
 * @returns The mutation for deleting a user.
 */
export function useDeleteUser(): UseMutationResult<void, Error, DeleteUserParams> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async params => deleteUser.execute(params),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: ["users.get.all"] });
            queryClient.removeQueries({ queryKey: ["users.get", variables.id] });
        },
    });
}
