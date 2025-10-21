/**
 * API配置
 * 自动检测环境并配置正确的API地址
 */

// 获取API基础URL
export const getApiBaseUrl = (): string => {
  // 优先使用环境变量
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // 开发环境自动检测
  if (import.meta.env.DEV) {
    // 如果是通过IP访问的（如手机访问192.168.1.100:5173）
    // 则API也使用同样的IP
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:3001/api`;
    }
    
    // 否则使用localhost
    return 'http://localhost:3001/api';
  }
  
  // 生产环境（Netlify Functions）
  return 'https://storied-dragon-acce51.netlify.app/.netlify/functions';
};

export const API_BASE_URL = getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL);

