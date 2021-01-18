import axios, { AxiosResponse } from 'axios';

export function setAuthToken(token?: string) {
  if (token) {
    // Apply authorization token to every request if logged in
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common['Authorization'];
  }
}

export interface LoginUserParams {
  email: string;
  password: string;
}

export async function loginUser(params: LoginUserParams): Promise<AxiosResponse<{ token: string }>> {
  return await axios.post('/api/users/login', params);
}

export async function refreshAuthToken() {
  return await axios.get('/api/users/refresh-token');
}

export interface SendUserResetPasswordEmailParams {
  email: string;
  url: string;
}

export async function sendUserResetPasswordEmail(params: SendUserResetPasswordEmailParams) {
  return await axios.post('/api/reset-password/email', params);
}

export interface VerifyResetPasswordTokenParams {
  token: string;
}

export async function verifyResetPasswordToken(params: VerifyResetPasswordTokenParams)  {
  return await axios.post('/api/reset-password/verify');
}

export interface SetNewUserPasswordParams {
  token: string;
  password: string;
  password2: string;
}

export async function setNewUserPassword(params: SetNewUserPasswordParams) {
  return await axios.post('/api/reset-password/set-password')
}
