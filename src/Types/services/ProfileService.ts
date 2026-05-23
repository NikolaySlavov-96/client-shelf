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
