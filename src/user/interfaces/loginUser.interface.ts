
export interface ILoginUser {
    email: string;
    password: string;
}

export interface Tokens {
    idToken: string;
    accessToken: string;
    refreshToken: string;
}
