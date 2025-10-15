/**
 * 用户管理服务（API版本）
 * 使用后端API管理用户账号
 */

import { userAPI } from './api';

export interface UserAccount {
  username: string;
  password: string;
  displayName?: string;
  role?: string;
  note?: string;
  createdAt?: string;
}

/**
 * 获取所有用户账号
 */
export const getAllAccounts = async (): Promise<UserAccount[]> => {
  const result = await userAPI.getAll();
  return result.success ? result.data : [];
};

/**
 * 添加新用户
 */
export const addUser = async (user: UserAccount): Promise<{ success: boolean; message: string }> => {
  return await userAPI.add(user);
};

/**
 * 更新用户信息
 */
export const updateUser = async (username: string, updatedUser: Partial<UserAccount>): Promise<{ success: boolean; message: string }> => {
  return await userAPI.update(username, updatedUser);
};

/**
 * 删除用户
 */
export const deleteUser = async (username: string): Promise<{ success: boolean; message: string }> => {
  return await userAPI.delete(username);
};

/**
 * 验证账号密码
 */
export const validateCredentials = async (username: string, password: string): Promise<boolean> => {
  const result = await userAPI.validateCredentials(username, password);
  return result.success && result.user !== null;
};

/**
 * 获取账号映射表
 */
export const getAccountsMap = async (): Promise<{ [key: string]: string }> => {
  const accounts = await getAllAccounts();
  const map: { [key: string]: string } = {};
  accounts.forEach(account => {
    map[account.username] = account.password;
  });
  return map;
};

