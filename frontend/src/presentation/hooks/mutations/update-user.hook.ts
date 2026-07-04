import { UpdateUser, type UpdateUserParams } from "@/application/usecases";
import type { User } from "@/domain/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateUser = new UpdateUser();

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation<User, Error, UpdateUserParams>({
        mutationFn: (params) => updateUser.execute(params),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: ["users.get.all"] });
            await queryClient.invalidateQueries({ queryKey: ["users.get", variables.id] });
        },
    });
}
