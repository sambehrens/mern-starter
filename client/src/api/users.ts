import { User } from '../types';
import axios, { AxiosResponse } from 'axios';

export async function getUser(userId: string): Promise<AxiosResponse<User>> {
  return axios.get('/api/users', { params: { id: userId } });
}

export interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  password2: string;
}

export async function createUser(params: CreateUserParams) {
  return await axios.post('/api/users', params);
}
