import { connectDB } from './utils/db.js';
import { successResponse, errorResponse, corsResponse } from './utils/response.js';
import Device from './models/Device.js';

/**
 * 记录设备登录
 * POST /api/devices/login
 */
export async function handler(event) {
  // 处理 CORS 预检请求
  if (event.httpMethod === 'OPTIONS') {
    return corsResponse();
  }

  // 只允许 POST 请求
  if (event.httpMethod !== 'POST') {
    return errorResponse('方法不允许', 405);
  }

  try {
    // 连接数据库
    await connectDB();

    // 解析请求体
    const { username, deviceId, deviceType, deviceInfo, ipAddress } = JSON.parse(event.body);

    // 验证必填字段
    if (!username || !deviceId) {
      return errorResponse('缺少必要参数', 400);
    }

    // 查找或创建设备记录
    let device = await Device.findOne({ username, deviceId });

    if (device) {
      // 更新现有设备
      device.loginTime = new Date();
      device.lastActiveTime = new Date();
      device.deviceType = deviceType || device.deviceType;
      device.deviceInfo = deviceInfo || device.deviceInfo;
      device.ipAddress = ipAddress || device.ipAddress;
      device.isActive = true;
    } else {
      // 创建新设备
      device = new Device({
        username,
        deviceId,
        deviceType: deviceType || '未知',
        deviceInfo,
        ipAddress
      });
    }

    await device.save();

    // 获取该用户的所有活跃设备
    const userDevices = await Device.find({ username, isActive: true });

    return successResponse({ devices: userDevices }, '设备登录记录成功');
  } catch (error) {
    console.error('记录设备登录失败:', error);
    return errorResponse('记录设备登录失败', 500, error);
  }
}

