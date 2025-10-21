import { connectDB } from './utils/db.js';
import { successResponse, errorResponse, corsResponse } from './utils/response.js';
import User from './models/User.js';

/**
 * 验证用户凭证
 * POST /api/auth/validate
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
    const { username, password } = JSON.parse(event.body);

    // 验证必填字段
    if (!username || !password) {
      return errorResponse('用户名和密码不能为空', 400);
    }

    // 查找用户
    const user = await User.findOne({ username, isActive: true });

    if (!user) {
      return successResponse(null, '用户名或密码错误');
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return successResponse(null, '用户名或密码错误');
    }

    // 更新最后登录时间
    user.lastLoginAt = new Date();
    await user.save();

    return successResponse({ user: user.toSafeObject() }, '验证成功');
  } catch (error) {
    console.error('验证失败:', error);
    return errorResponse('验证失败', 500, error);
  }
}

