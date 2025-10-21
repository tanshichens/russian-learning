import { connectDB } from './utils/db.js';
import { successResponse, errorResponse, corsResponse } from './utils/response.js';
import User from './models/User.js';

/**
 * 获取所有用户列表
 * GET /api/users
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

    // 查询所有活跃用户
    const users = await User.find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 });

    return successResponse(users, '获取用户列表成功');
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return errorResponse('获取用户列表失败', 500, error);
  }
}

