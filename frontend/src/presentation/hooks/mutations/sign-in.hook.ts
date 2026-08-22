import { SignIn, type SignInParams } from "@/application/usecases";
import type { AuthToken } from "@/domain/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const signIn = new SignIn();

/**
 *
 */
export function useSignIn() {
    const queryClient = useQueryClient();

    return useMutation<AuthToken, Error, SignInParams>({
        mutationFn: async params => signIn.execute(params),
        // Drop any cached data from a previous session on this device before
        // The new session's screens start reading from the query cache.
        onSuccess: () => { queryClient.clear(); },
    });
}
