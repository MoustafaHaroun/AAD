import { UploadUserAvatar, type UploadUserAvatarParams } from "@/application/usecases";
import type { User } from "@/domain/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const uploadUserAvatar = new UploadUserAvatar();

/**
 *
 */
export function useUploadUserAvatar() {
    const queryClient = useQueryClient();

    return useMutation<User, Error, UploadUserAvatarParams>({
        mutationFn: async params => uploadUserAvatar.execute(params),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: ["users.get", variables.id] });
        },
    });
}
