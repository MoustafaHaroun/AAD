import { RemoveUserAvatar, type RemoveUserAvatarParams } from "@/application/usecases";
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

const removeUserAvatar = new RemoveUserAvatar();

/**
 * Remove a user's avatar, then invalidate the cached user.
 * @returns The mutation for removing a user avatar.
 */
export function useRemoveUserAvatar(): UseMutationResult<void, Error, RemoveUserAvatarParams> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async params => removeUserAvatar.execute(params),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: ["users.get", variables.id] });
        },
    });
}
