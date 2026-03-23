export type Visibility = 'PRIVATE' | 'PUBLIC' | 'FRIENDS';

export const VISIBILITY_LIST: Visibility[] = [
    'PRIVATE',
    'FRIENDS',
    'PUBLIC',
];

export const VISIBILITY_LABEL: Record<Visibility, string> = {
    PRIVATE: 'Riêng tư',
    FRIENDS: 'Bạn bè',
    PUBLIC: 'Công khai',
};

export type FriendRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry' | null;
export type SortType = 'time' | 'location' | 'emotion';

export interface User {
    id: number;
    username: string;
    email?: string;
    displayName?: string;
    avatar?: string;
    bio?: string;
    level?: number;
    xp?: number;
    scanRadius?: number;
    token?: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserBasic {
    id?: number;
    displayName?: string;
    username?: string;
    avatar?: string;
    violationCount?: number;
}

export type UserAction =
    | { type: 'SET_USER'; payload: User }
    | { type: 'LOGOUT' };

export type VoiceType = 'STANDARD' | 'HIDDEN_AR';

export interface VoicePin {
    id: number;
    audioUrl: string;
    content?: string;
    transcription?: string;
    imageUrl?: string;
    latitude: number;
    longitude: number;
    address?: string;
    visibility: Visibility;
    isAnonymous: boolean;
    type: VoiceType;
    unlockRadius: number;
    emotionLabel?: string;
    emotionScore?: number;
    stickerUrl?: string;
    deviceModel?: string;
    osVersion?: string;
    listensCount: number;
    reactionsCount: number;
    commentsCount: number;
    duration?: number;
    userId?: number;
    user?: UserBasic;
    createdAt: string;
    updatedAt?: string;
}
