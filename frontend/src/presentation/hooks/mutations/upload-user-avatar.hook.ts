import { UploadUserAvatar, type UploadUserAvatarParams } from "@/application/usecases";
import type { User } from "@/domain/entities";
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

const uploadUserAvatar = new UploadUserAvatar();

/**
 * Upload a user's avatar, then invalidate the cached user.
 * @returns The mutation for uploading a user avatar.
 */
export function useUploadUserAvatar(): UseMutationResult<User, Error, UploadUserAvatarParams> {
    const queryClient = useQueryClient();

    return useMutation<User, Error, UploadUserAvatarParams>({
        mutationFn: async params => uploadUserAvatar.execute(params),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: ["users.get", variables.id] });
        },
    });
}
