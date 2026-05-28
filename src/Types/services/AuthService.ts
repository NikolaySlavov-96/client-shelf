export interface IRegisterRequest {
    email: string;
    password: string;
    year: string;
}

export interface IRegisterResponse {
    userInfo: Record<string, unknown>;
    message: string;
    messageCode: string;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

// Identity claims returned by login. Profile data (year, goal, ...) is fetched
// separately from the /profile resource.
export interface IAuthUserInfo {
    _id: number;
    id: number;
    email: string;
    isVerify: boolean;
    accessToken: string;
    refreshToken: string;
    role: 'user' | 'support';
}

export interface ILoginResponse {
    userInfo: IAuthUserInfo;
    message: string;
    messageCode: string;
}

export interface ILogOutRequest {
    token?: string;
    refreshToken?: string;
}

export type ILogOutResponse = Record<string, never>;

export interface IVerifyTokenResponse {
    userInfo: Record<string, unknown>;
    message: string;
    messageCode: string;
}

export interface IMagicLinkRequest {
    email: string;
}

export interface IMagicLinkResponse {
    userInfo: Record<string, unknown>;
    message: string;
    messageCode: string;
}

export interface IVerifyMagicRequest {
    token: string;
}

export interface IVerifyMagicResponse {
    userInfo: IAuthUserInfo;
    message: string;
    messageCode: string;
}
