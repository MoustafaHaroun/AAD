class TokenStore {
    private token: string | null = null;

    set(token: string | null): void {
        this.token = token;
    }

    get(): string | null {
        return this.token;
    }

    clear(): void {
        this.token = null;
    }
}

export const tokenStore = new TokenStore();
