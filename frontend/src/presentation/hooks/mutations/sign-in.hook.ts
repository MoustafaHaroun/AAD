import { SignIn, type SignInParams } from "@/application/usecases";
import type { AuthToken } from "@/domain/entities";
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

const signIn = new SignIn();

/**
 * Sign in, then clear the query cache so the new session doesn't read stale data.
 * @returns The mutation for signing in.
 */
export function useSignIn(): UseMutationResult<AuthToken, Error, SignInParams> {
    const queryClient = useQueryClient();

    return useMutation<AuthToken, Error, SignInParams>({
        mutationFn: async params => signIn.execute(params),
        // Drop any cached data from a previous session on this device before
        // The new session's screens start reading from the query cache.
        onSuccess: () => { queryClient.clear(); },
    });
}
