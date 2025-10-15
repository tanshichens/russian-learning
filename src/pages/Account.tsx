import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface Device {
  type: DeviceType;
  id: string;
  loginTime: number;
}

const Account: React.FC = () => {
  const { username } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    if (username) {
      const devicesKey = `devices_${username}`;
      const devicesJson = localStorage.getItem(devicesKey);
      const deviceList: Device[] = devicesJson ? JSON.parse(devicesJson) : [];
      setDevices(deviceList);
    }
  }, [username]);

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'desktop':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        );
      case 'tablet':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
          </svg>
        );
      case 'mobile':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="7" y="2" width="10" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
          </svg>
        );
    }
  };

  const getDeviceLabel = (type: DeviceType) => {
    switch (type) {
      case 'desktop': return '电脑端';
      case 'tablet': return '平板端';
      case 'mobile': return '手机端';
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN');
  };

  return (
    <div className="account-page">
      <div className="account-container">
        <h2>账号信息</h2>
        
        <div className="account-info-card">
          <div className="info-row">
            <span className="info-label">用户名</span>
            <span className="info-value">{username}</span>
          </div>
          <div className="info-row">
            <span className="info-label">设备限制</span>
            <span className="info-value">最多2个设备</span>
          </div>
        </div>

        <h3>当前登录设备 ({devices.length}/2)</h3>
        
        <div className="devices-list">
          {devices.map((device) => (
            <div key={device.id} className="device-card">
              <div className="device-icon">
                {getDeviceIcon(device.type)}
              </div>
              <div className="device-info">
                <h4>{getDeviceLabel(device.type)}</h4>
                <p className="device-time">登录时间：{formatTime(device.loginTime)}</p>
                <p className="device-id">设备ID：{device.id.slice(0, 20)}...</p>
              </div>
            </div>
          ))}
          
          {devices.length === 0 && (
            <p className="no-devices">暂无登录设备</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;

