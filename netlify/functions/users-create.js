import { connectDB } from './utils/db.js';
import { successResponse, errorResponse, corsResponse } from './utils/response.js';
import User from './models/User.js';

/**
 * 添加新用户
 * POST /api/users
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
    const { username, password, displayName, role, note } = JSON.parse(event.body);

    // 验证必填字段
    if (!username || !password) {
      return errorResponse('用户名和密码不能为空', 400);
    }

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return errorResponse('用户名已存在', 400);
    }

    // 创建新用户
    const newUser = new User({
      username,
      password,
      displayName,
      role: role || '普通用户',
      note
    });

    await newUser.save();

    return successResponse(newUser.toSafeObject(), '用户添加成功', 201);
  } catch (error) {
    console.error('添加用户失败:', error);
    return errorResponse('添加用户失败', 500, error);
  }
}

