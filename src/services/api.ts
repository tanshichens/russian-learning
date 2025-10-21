/**
 * API客户端服务
 * 用于与后端API通信
 */

import { API_BASE_URL } from './apiConfig';

// 通用请求函数
const request = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    return await response.json();
  } catch (error) {
    console.error('API请求失败:', error);
    return { success: false, message: '网络请求失败，请检查后端服务是否启动' };
  }
};

// ==================== 用户管理API ====================

export const userAPI = {
  // 获取所有用户
  getAll: () => request('/users'),
  
  // 添加用户
  add: (user: any) => request('/users', {
    method: 'POST',
    body: JSON.stringify(user),
  }),
  
  // 更新用户
  update: (username: string, data: any) => request(`/users/${username}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // 删除用户
  delete: (username: string) => request(`/users/${username}`, {
    method: 'DELETE',
  }),
  
  // 验证凭证
  validateCredentials: (username: string, password: string) => 
    request('/auth-validate', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
};

// ==================== 注册申请API ====================

export const registrationAPI = {
  // 获取所有申请
  getAll: () => request('/registration-get'),
  
  // 提交申请
  submit: (data: any) => request('/registration-create', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // 批准申请
  approve: (id: string, adminUsername: string) => 
    request(`/registration-approve`, {
      method: 'POST',
      body: JSON.stringify({ id, adminUsername }),
    }),
  
  // 拒绝申请
  reject: (id: string, adminUsername: string, reason?: string) => 
    request(`/registration-reject`, {
      method: 'POST',
      body: JSON.stringify({ id, adminUsername, reason }),
    }),
  
  // 删除申请
  delete: (id: string) => request(`/registration-delete`, {
    method: 'POST',
    body: JSON.stringify({ id }),
  }),
};

// ==================== 设备管理API ====================

export const deviceAPI = {
  // 记录设备登录
  login: (username: string, deviceId: string, deviceType: string) => 
    request('/devices/login', {
      method: 'POST',
      body: JSON.stringify({ username, deviceId, deviceType }),
    }),
  
  // 获取用户设备列表
  getDevices: (username: string) => request(`/devices/${username}`),
  
  // 设备登出
  logout: (username: string, deviceId: string) => 
    request('/devices/logout', {
      method: 'POST',
      body: JSON.stringify({ username, deviceId }),
    }),
};

// ==================== 健康检查 ====================

export const healthCheck = () => request('/health');

