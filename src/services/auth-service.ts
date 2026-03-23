import { api } from './client';
import { endpoints } from './endpoints';

export type LoginPayload = {
  username: string;
  password: string;
};

export type RegisterPayload = Record<string, unknown> | FormData;

export const authService = {
  login(payload: LoginPayload) {
    return api.post(endpoints.login, payload);
  },
  register(payload: RegisterPayload) {
    return api.post(endpoints.register, payload);
  },
};

export default authService;
