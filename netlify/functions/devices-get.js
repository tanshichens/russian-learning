import { connectDB } from './utils/db.js';
import { successResponse, errorResponse, corsResponse } from './utils/response.js';
import Device from './models/Device.js';

/**
 * 获取用户的设备列表
 * GET /api/devices/:username
 */
export async function handler(event) {
  // 处理 CORS 预检请求
  if (event.httpMethod === 'OPTIONS') {
    return corsResponse();
  }

  // 只允许 GET 请求
  if (event.httpMethod !== 'GET') {
    return errorResponse('方法不允许', 405);
  }

  try {
    // 连接数据库
    await connectDB();

    // 从路径中获取用户名
    const username = event.path.split('/').pop();

    // 查询该用户的所有活跃设备
    const devices = await Device.find({ username, isActive: true })
      .sort({ loginTime: -1 });

    return successResponse(devices, '获取设备列表成功');
  } catch (error) {
    console.error('获取设备列表失败:', error);
    return errorResponse('获取设备列表失败', 500, error);
  }
}

