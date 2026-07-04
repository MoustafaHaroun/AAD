import { SignIn, type SignInParams } from "@/application/usecases";
import type { AuthToken } from "@/domain/entities";
import { useMutation } from "@tanstack/react-query";

const signIn = new SignIn();

export function useSignIn() {
    return useMutation<AuthToken, Error, SignInParams>({
        mutationFn: (params) => signIn.execute(params),
    });
}
