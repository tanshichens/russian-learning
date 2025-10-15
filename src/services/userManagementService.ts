/**
 * 用户管理服务
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

const STORAGE_KEY = 'user_accounts_db';
const USE_API = true; // 是否使用API，设为false可回退到localStorage

/**
 * 获取所有用户账号
 */
export const getAllAccounts = async (): Promise<UserAccount[]> => {
  if (USE_API) {
    const result = await userAPI.getAll();
    return result.success ? result.data : [];
  }
  
  // 回退到localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // 如果没有存储，使用默认账号
  const defaultAccounts: UserAccount[] = [
    {
      username: 'user1',
      password: 'password123',
      displayName: '用户1',
      role: '普通用户',
      note: '测试账号',
      createdAt: '2025-01-01'
    },
    {
      username: 'user2',
      password: 'password456',
      displayName: '用户2',
      role: '普通用户',
      note: '测试账号',
      createdAt: '2025-01-01'
    },
    {
      username: 'user3',
      password: 'password789',
      displayName: '用户3',
      role: '普通用户',
      note: '测试账号',
      createdAt: '2025-01-01'
    },
    {
      username: 'admin',
      password: 'admin000',
      displayName: '管理员',
      role: '管理员',
      note: '系统管理员',
      createdAt: '2025-01-01'
    }
  ];
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAccounts));
  return defaultAccounts;
};

/**
 * 保存用户账号列表
 */
export const saveAccounts = (accounts: UserAccount[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
};

/**
 * 添加新用户
 */
export const addUser = async (user: UserAccount): Promise<{ success: boolean; message: string }> => {
  const accounts = await getAllAccounts();
  
  // 检查用户名是否已存在
  if (accounts.some(u => u.username === user.username)) {
    return { success: false, message: '用户名已存在' };
  }
  
  // 添加创建时间
  const newUser = {
    ...user,
    createdAt: user.createdAt || new Date().toISOString().split('T')[0]
  };
  
  accounts.push(newUser);
  saveAccounts(accounts);
  
  return { success: true, message: '用户添加成功' };
};

/**
 * 更新用户信息
 */
export const updateUser = async (username: string, updatedUser: Partial<UserAccount>): Promise<{ success: boolean; message: string }> => {
  const accounts = await getAllAccounts();
  const index = accounts.findIndex(u => u.username === username);
  
  if (index === -1) {
    return { success: false, message: '用户不存在' };
  }
  
  // 如果要修改用户名，检查新用户名是否已存在
  if (updatedUser.username && updatedUser.username !== username) {
    if (accounts.some(u => u.username === updatedUser.username)) {
      return { success: false, message: '新用户名已存在' };
    }
  }
  
  accounts[index] = { ...accounts[index], ...updatedUser };
  saveAccounts(accounts);
  
  return { success: true, message: '用户更新成功' };
};

/**
 * 删除用户
 */
export const deleteUser = async (username: string): Promise<{ success: boolean; message: string }> => {
  const accounts = await getAllAccounts();
  
  // 防止删除管理员账号
  if (username === 'admin') {
    return { success: false, message: '不能删除管理员账号' };
  }
  
  const filteredAccounts = accounts.filter(u => u.username !== username);
  
  if (filteredAccounts.length === accounts.length) {
    return { success: false, message: '用户不存在' };
  }
  
  saveAccounts(filteredAccounts);
  
  // 清除该用户的设备登录记录
  localStorage.removeItem(`devices_${username}`);
  
  return { success: true, message: '用户删除成功' };
};

/**
 * 验证账号密码
 */
export const validateCredentials = async (username: string, password: string): Promise<boolean> => {
  const accounts = await getAllAccounts();
  const user = accounts.find(u => u.username === username);
  return user ? user.password === password : false;
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

/**
 * 导出账号列表（CSV格式）
 */
export const exportAccountsAsCSV = async (): Promise<string> => {
  const accounts = await getAllAccounts();
  const header = '用户名,密码,显示名称,角色,备注,创建时间\n';
  const rows = accounts.map(u => 
    `${u.username},${u.password},${u.displayName || ''},${u.role || ''},${u.note || ''},${u.createdAt || ''}`
  ).join('\n');
  
  return header + rows;
};

