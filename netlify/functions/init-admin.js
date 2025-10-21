import { connectDB } from './utils/db.js';
import { successResponse, errorResponse, corsResponse } from './utils/response.js';
import User from './models/User.js';

/**
 * 初始化管理员账号（仅在没有管理员时执行）
 * POST /api/init-admin
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

    // 检查是否已有管理员
    const adminExists = await User.findOne({ username: 'admin' });

    if (adminExists) {
      return successResponse(null, '管理员账号已存在');
    }

    // 创建管理员账号
    const admin = new User({
      username: 'admin',
      password: 'admin000',
      displayName: '系统管理员',
      role: '管理员',
      note: '系统初始管理员账号'
    });

    await admin.save();

    return successResponse(
      admin.toSafeObject(),
      '管理员账号初始化成功。用户名: admin, 密码: admin000。请及时修改默认密码！',
      201
    );
  } catch (error) {
    console.error('初始化管理员账号失败:', error);
    return errorResponse('初始化管理员账号失败', 500, error);
  }
}

