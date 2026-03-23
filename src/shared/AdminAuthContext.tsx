import type { Dispatch, ReactNode } from 'react';
import { createContext, useReducer, useEffect } from 'react';

export interface AdminUser {
  id: string | number;
  username: string;
  email?: string;
  role?: string;
}

export interface AdminAuthAction {
  type: 'SET_ADMIN_USER' | 'LOGOUT_ADMIN';
  payload?: AdminUser | null;
}

export const AdminUserContext = createContext<AdminUser | null>(null);
export const AdminDispatchContext = createContext<Dispatch<AdminAuthAction> | null>(null);

export const adminUserReducer = (state: AdminUser | null, action: AdminAuthAction): AdminUser | null => {
  switch (action.type) {
    case 'SET_ADMIN_USER':
      return action.payload || null;
    case 'LOGOUT_ADMIN':
      return null;
    default:
      return state;
  }
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [adminUser, dispatch] = useReducer(adminUserReducer, null);

  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin_user');
    const adminToken = localStorage.getItem('admin_token');
    if (savedAdmin && adminToken) {
      try {
        dispatch({ type: 'SET_ADMIN_USER', payload: JSON.parse(savedAdmin) });
      } catch (e) {
        console.error("Failed to parse admin user from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('admin_user', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_token');
    }
  }, [adminUser]);

  return (
    <AdminUserContext.Provider value={adminUser}>
      <AdminDispatchContext.Provider value={dispatch}>
        {children}
      </AdminDispatchContext.Provider>
    </AdminUserContext.Provider>
  );
};
