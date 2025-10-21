import { connectDB } from './utils/db.js';
import { successResponse, errorResponse, corsResponse } from './utils/response.js';
import User from './models/User.js';
import Device from './models/Device.js';

/**
 * 删除用户（软删除）
 * DELETE /api/users/:username
 */
export async function handler(event) {
  // 处理 CORS 预检请求
  if (event.httpMethod === 'OPTIONS') {
    return corsResponse();
  }

  // 只允许 DELETE 请求
  if (event.httpMethod !== 'DELETE') {
    return errorResponse('方法不允许', 405);
  }

  try {
    // 连接数据库
    await connectDB();

    // 从路径中获取用户名
    const username = event.path.split('/').pop();

    // 不能删除管理员账号
    if (username === 'admin') {
      return errorResponse('不能删除管理员账号', 403);
    }

    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return errorResponse('用户不存在', 404);
    }

    // 软删除：标记为不活跃
    user.isActive = false;
    await user.save();

    // 同时清除该用户的设备记录
    await Device.deleteMany({ username });

    return successResponse(null, '用户删除成功');
  } catch (error) {
    console.error('删除用户失败:', error);
    return errorResponse('删除用户失败', 500, error);
  }
}

