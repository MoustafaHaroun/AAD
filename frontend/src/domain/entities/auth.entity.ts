export interface AuthToken {
    token: string,
}

export interface JwtPayload {
    sub: string,
    email: string,
    role: string,
}
