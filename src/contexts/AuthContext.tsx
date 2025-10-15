import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { validateCredentials } from '../services/userManagementServiceAPI';
import { getAllRequests } from '../services/registrationServiceAPI';

// 设备类型
type DeviceType = 'desktop' | 'tablet' | 'mobile';

// 认证上下文接口
interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  deviceInfo: { type: DeviceType; id: string } | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  checkDeviceLimit: () => boolean;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 获取设备类型
const getDeviceType = (): DeviceType => {
  const width = window.innerWidth;
  if (width <= 768) return 'mobile';
  if (width <= 1024) return 'tablet';
  return 'desktop';
};

// 生成设备唯一ID
const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
};

// 认证Provider组件
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<{ type: DeviceType; id: string } | null>(null);

  // 检查本地存储的登录状态
  useEffect(() => {
    const storedAuth = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');
    const storedDeviceInfo = localStorage.getItem('deviceInfo');
    
    if (storedAuth && storedUsername && storedDeviceInfo) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
      setDeviceInfo(JSON.parse(storedDeviceInfo));
    }
  }, []);

  // 检查设备限制
  const checkDeviceLimit = (): boolean => {
    const currentUsername = localStorage.getItem('username');
    if (!currentUsername) return true;

    const devicesKey = `devices_${currentUsername}`;
    const devicesJson = localStorage.getItem(devicesKey);
    const devices: { type: DeviceType; id: string; loginTime: number }[] = 
      devicesJson ? JSON.parse(devicesJson) : [];

    const currentDeviceId = getDeviceId();
    
    // 检查当前设备是否已登录
    const isCurrentDeviceLoggedIn = devices.some(d => d.id === currentDeviceId);
    
    // 如果当前设备已登录，允许
    if (isCurrentDeviceLoggedIn) return true;
    
    // 检查是否已有2个不同的设备登录
    const uniqueDevices = devices.filter((device, index, self) => 
      index === self.findIndex((d) => d.id === device.id)
    );
    
    return uniqueDevices.length < 2;
  };

  // 登录函数
  const login = async (inputUsername: string, inputPassword: string): Promise<{ success: boolean; message: string }> => {
    // 检查用户是否已被批准
    const allRequests = await getAllRequests();
    const userRequest = allRequests.find(r => r.username === inputUsername);
    
    // 如果用户在申请列表中但状态不是approved，禁止登录
    if (userRequest) {
      if (userRequest.status === 'pending') {
        return { success: false, message: '您的账号申请正在审批中，请耐心等待' };
      }
      if (userRequest.status === 'rejected') {
        return { success: false, message: '您的账号申请已被拒绝' };
      }
    }
    
    // 使用服务验证账号密码
    const isValid = await validateCredentials(inputUsername, inputPassword);
    if (!isValid) {
      return { success: false, message: '账号或密码错误，或账号不存在' };
    }

    // 检查设备限制
    const devicesKey = `devices_${inputUsername}`;
    const devicesJson = localStorage.getItem(devicesKey);
    const devices: { type: DeviceType; id: string; loginTime: number }[] = 
      devicesJson ? JSON.parse(devicesJson) : [];

    const currentDeviceType = getDeviceType();
    const currentDeviceId = getDeviceId();

    // 检查当前设备是否已登录
    const isCurrentDeviceLoggedIn = devices.some(d => d.id === currentDeviceId);
    
    if (!isCurrentDeviceLoggedIn) {
      // 获取不同的设备数量
      const uniqueDevices = devices.filter((device, index, self) => 
        index === self.findIndex((d) => d.id === device.id)
      );
      
      if (uniqueDevices.length >= 2) {
        return { 
          success: false, 
          message: '您的账号已在2个设备上登录，请先退出其他设备' 
        };
      }
    }

    // 添加当前设备到登录列表
    const newDevice = {
      type: currentDeviceType,
      id: currentDeviceId,
      loginTime: Date.now()
    };

    // 更新设备列表（如果当前设备已存在，更新时间；否则添加）
    const updatedDevices = isCurrentDeviceLoggedIn
      ? devices.map(d => d.id === currentDeviceId ? newDevice : d)
      : [...devices, newDevice];

    localStorage.setItem(devicesKey, JSON.stringify(updatedDevices));

    // 保存登录状态
    const authToken = `token_${Date.now()}`;
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('username', inputUsername);
    localStorage.setItem('deviceInfo', JSON.stringify(newDevice));

    setIsAuthenticated(true);
    setUsername(inputUsername);
    setDeviceInfo(newDevice);

    return { success: true, message: '登录成功' };
  };

  // 登出函数
  const logout = () => {
    const currentUsername = localStorage.getItem('username');
    const currentDeviceId = getDeviceId();

    if (currentUsername) {
      // 从设备列表中移除当前设备
      const devicesKey = `devices_${currentUsername}`;
      const devicesJson = localStorage.getItem(devicesKey);
      const devices: { type: DeviceType; id: string; loginTime: number }[] = 
        devicesJson ? JSON.parse(devicesJson) : [];
      
      const updatedDevices = devices.filter(d => d.id !== currentDeviceId);
      localStorage.setItem(devicesKey, JSON.stringify(updatedDevices));
    }

    // 清除本地存储
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('deviceInfo');

    setIsAuthenticated(false);
    setUsername(null);
    setDeviceInfo(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, deviceInfo, login, logout, checkDeviceLimit }}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义Hook用于使用认证上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

