import { connectDB } from './utils/db.js';
import { successResponse, errorResponse, corsResponse } from './utils/response.js';
import User from './models/User.js';

/**
 * 更新用户信息
 * PUT /api/users/:username
 */
export async function handler(event) {
  // 处理 CORS 预检请求
  if (event.httpMethod === 'OPTIONS') {
    return corsResponse();
  }

  // 只允许 PUT 请求
  if (event.httpMethod !== 'PUT') {
    return errorResponse('方法不允许', 405);
  }

  try {
    // 连接数据库
    await connectDB();

    // 从路径中获取用户名
    const username = event.path.split('/').pop();
    
    // 解析更新数据
    const updateData = JSON.parse(event.body);

    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return errorResponse('用户不存在', 404);
    }

    // 更新字段
    if (updateData.password) user.password = updateData.password;
    if (updateData.displayName !== undefined) user.displayName = updateData.displayName;
    if (updateData.role) user.role = updateData.role;
    if (updateData.note !== undefined) user.note = updateData.note;
    if (updateData.expiresAt !== undefined) user.expiresAt = updateData.expiresAt;

    await user.save();

    return successResponse(user.toSafeObject(), '用户更新成功');
  } catch (error) {
    console.error('更新用户失败:', error);
    return errorResponse('更新用户失败', 500, error);
  }
}

