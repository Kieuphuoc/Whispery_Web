import { createContext, type Dispatch } from 'react';
import type { User, UserAction } from '@/shared/types';

export const MyUserContext = createContext<User | null>(null);
export const MyDispatchContext = createContext<Dispatch<UserAction> | null>(null);

export const userReducer = (state: User | null, action: UserAction): User | null => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload;
    case 'LOGOUT':
      return null;
    default:
      return state;
  }
};

