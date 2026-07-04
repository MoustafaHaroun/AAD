import { DeleteUser, type DeleteUserParams } from "@/application/usecases";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteUser = new DeleteUser();

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, DeleteUserParams>({
        mutationFn: (params) => deleteUser.execute(params),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: ["users.get.all"] });
            queryClient.removeQueries({ queryKey: ["users.get", variables.id] });
        },
    });
}
