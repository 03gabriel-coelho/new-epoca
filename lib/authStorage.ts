import { AuthUser } from '../types';

const USERS_STORAGE_KEY = 'epoca_b2b_users';
const SESSION_STORAGE_KEY = 'epoca_b2b_session';

const safeWindow = () => (typeof window !== 'undefined' ? window : null);

export const getStoredUsers = (): AuthUser[] => {
  const browserWindow = safeWindow();
  if (!browserWindow) {
    return [];
  }

  try {
    const raw = browserWindow.localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser[]) : [];
  } catch {
    return [];
  }
};

export const saveStoredUsers = (users: AuthUser[]) => {
  const browserWindow = safeWindow();
  if (!browserWindow) {
    return;
  }

  browserWindow.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const getStoredSession = (): AuthUser | null => {
  const browserWindow = safeWindow();
  if (!browserWindow) {
    return null;
  }

  try {
    const raw = browserWindow.localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

export const saveStoredSession = (user: AuthUser | null) => {
  const browserWindow = safeWindow();
  if (!browserWindow) {
    return;
  }

  if (!user) {
    browserWindow.localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  browserWindow.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
};

export const registerStoredUser = (user: AuthUser) => {
  const users = getStoredUsers();
  const normalizedCnpj = user.cnpj.replace(/\D/g, '');
  const normalizedEmail = user.email.trim().toLowerCase();

  const alreadyExists = users.some((storedUser) => {
    const sameCnpj = storedUser.cnpj.replace(/\D/g, '') === normalizedCnpj;
    const sameEmail = storedUser.email.trim().toLowerCase() === normalizedEmail;
    return sameCnpj || sameEmail;
  });

  if (alreadyExists) {
    throw new Error('Já existe uma empresa cadastrada com este CNPJ ou email.');
  }

  const nextUsers = [...users, user];
  saveStoredUsers(nextUsers);
  saveStoredSession(user);
  return user;
};

export const loginStoredUser = (identifier: string, password: string) => {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const normalizedCnpj = identifier.replace(/\D/g, '');

  const user = getStoredUsers().find((storedUser) => {
    const matchesEmail = storedUser.email.trim().toLowerCase() === normalizedIdentifier;
    const matchesCnpj = storedUser.cnpj.replace(/\D/g, '') === normalizedCnpj;
    return (matchesEmail || matchesCnpj) && storedUser.password === password;
  });

  if (!user) {
    throw new Error('Credenciais inválidas. Use um cadastro salvo nesta demonstração.');
  }

  saveStoredSession(user);
  return user;
};
