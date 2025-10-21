import { connectDB } from './utils/db.js';
import { successResponse, errorResponse, corsResponse } from './utils/response.js';
import RegistrationRequest from './models/RegistrationRequest.js';
import User from './models/User.js';

/**
 * 批准注册申请
 * POST /api/registration-requests/:id/approve
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

    // 从路径中获取申请ID
    const pathParts = event.path.split('/');
    const id = pathParts[pathParts.length - 2]; // /api/registration-requests/:id/approve

    // 解析请求体
    const { adminUsername } = JSON.parse(event.body || '{}');

    // 查找申请
    const request = await RegistrationRequest.findById(id);
    if (!request) {
      return errorResponse('申请不存在', 404);
    }

    if (request.status !== 'pending') {
      return errorResponse('该申请已被处理', 400);
    }

    // 创建用户
    const newUser = new User({
      username: request.username,
      password: request.password,
      displayName: request.displayName,
      role: '普通用户',
      note: request.reason || '用户注册'
    });

    await newUser.save();

    // 更新申请状态
    request.status = 'approved';
    request.processedAt = new Date();
    request.processedBy = adminUsername;
    await request.save();

    return successResponse(newUser.toSafeObject(), '申请已批准，用户已创建');
  } catch (error) {
    console.error('批准申请失败:', error);
    return errorResponse('批准申请失败', 500, error);
  }
}

