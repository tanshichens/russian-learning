import { connectDB } from './utils/db.js';
import { successResponse, errorResponse, corsResponse } from './utils/response.js';
import Device from './models/Device.js';

/**
 * 设备登出
 * POST /api/devices/logout
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
    const { username, deviceId } = JSON.parse(event.body);

    // 验证必填字段
    if (!username || !deviceId) {
      return errorResponse('缺少必要参数', 400);
    }

    // 查找设备
    const device = await Device.findOne({ username, deviceId });

    if (device) {
      device.isActive = false;
      await device.save();
    }

    return successResponse(null, '设备已登出');
  } catch (error) {
    console.error('设备登出失败:', error);
    return errorResponse('设备登出失败', 500, error);
  }
}

