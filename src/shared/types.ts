export type Visibility = 'PRIVATE' | 'PUBLIC' | 'FRIENDS';

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

export type UserAction = { type: 'SET_USER'; payload: User } | { type: 'LOGOUT' };

export const VoiceType = {
  STANDARD: 'STANDARD',
  HIDDEN_AR: 'HIDDEN_AR',
} as const;

export type VoiceType = (typeof VoiceType)[keyof typeof VoiceType];

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

  listensCount: number;
  reactionsCount: number;
  commentsCount: number;
  duration?: number;

  userId?: number;
  createdAt: string;
  updatedAt?: string;
}

