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
    connectId?: string;
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
    connectId?: string;
    token?: string;
    refreshToken?: string;
}

export interface ILogOutResponse { }

export interface IVerifyTokeRequest {
    token: string;
}

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

// Application-owned profile resource. Identity fields (email/role/isVerify)
// come from the auth store, not from here.
export interface IProfile {
    userId: number;
    year: number;
    readingGoal: number;
    displayName: string | null;
    notifyByEmail: boolean;
    avatarFileId: number | null;
    avatarUrl: string | null;
    avatarSrc: string | null;
}

export interface IUpdateProfileRequest {
    readingGoal?: number;
    displayName?: string | null;
    avatarFileId?: number | null;
    notifyByEmail?: boolean;
}
