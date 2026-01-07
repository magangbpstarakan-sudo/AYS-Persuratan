
import { UserAccount, UserRole } from '../types';

const USERS_KEY = 'ays_users_data_v1';

const DEFAULT_ADMIN: UserAccount = {
  id: 'admin-master',
  name: 'Hasan Dhika',
  username: 'dhikajan',
  password: 'Hasandhika09*',
  role: UserRole.ADMIN,
  createdAt: new Date().toISOString()
};

export const getUsers = (): UserAccount[] => {
  const data = localStorage.getItem(USERS_KEY);
  if (!data) {
    localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_ADMIN]));
    return [DEFAULT_ADMIN];
  }
  return JSON.parse(data);
};

export const saveUser = (user: UserAccount) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const deleteUser = (id: string) => {
  const users = getUsers().filter(u => u.id !== id);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getCurrentUser = (): UserAccount | null => {
  const auth = localStorage.getItem('admin_auth_user');
  return auth ? JSON.parse(auth) : null;
};
