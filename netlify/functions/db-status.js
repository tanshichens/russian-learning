import mongoose from 'mongoose';
import { connectDB } from './utils/db.js';
import { successResponse, errorResponse, corsResponse } from './utils/response.js';
import User from './models/User.js';
import RegistrationRequest from './models/RegistrationRequest.js';
import Device from './models/Device.js';

/**
 * 数据库状态检查
 * GET /api/db-status
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

    // 统计数据
    const userCount = await User.countDocuments({ isActive: true });
    const requestCount = await RegistrationRequest.countDocuments({ status: 'pending' });
    const deviceCount = await Device.countDocuments({ isActive: true });

    return successResponse({
      connected: mongoose.connection.readyState === 1,
      database: mongoose.connection.name,
      collections: {
        users: userCount,
        pendingRequests: requestCount,
        activeDevices: deviceCount
      }
    }, '数据库状态查询成功');
  } catch (error) {
    console.error('获取数据库状态失败:', error);
    return errorResponse('获取数据库状态失败', 500, error);
  }
}

