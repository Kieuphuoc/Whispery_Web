import type { User, UserAction } from '@/types';
import { createContext, useReducer, useEffect } from 'react';
import type { Dispatch, ReactNode } from 'react';

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, dispatch] = useReducer(userReducer, null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
            }
        }
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    return (
        <MyUserContext.Provider value={user}>
            <MyDispatchContext.Provider value={dispatch}>
                {children}
            </MyDispatchContext.Provider>
        </MyUserContext.Provider>
    );
};
