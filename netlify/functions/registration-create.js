import { connectDB } from './utils/db.js';
import { successResponse, errorResponse, corsResponse } from './utils/response.js';
import RegistrationRequest from './models/RegistrationRequest.js';
import User from './models/User.js';

/**
 * 提交注册申请
 * POST /api/registration-requests
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
    const { username, password, displayName, contactInfo, reason } = JSON.parse(event.body);

    // 验证必填字段
    if (!username || !password) {
      return errorResponse('用户名和密码不能为空', 400);
    }

    // 检查是否已有待审批申请
    const pendingRequest = await RegistrationRequest.findOne({
      username,
      status: 'pending'
    });

    if (pendingRequest) {
      return errorResponse('该用户名已在审核中，请勿重复申请', 400);
    }

    // 检查用户名是否已被使用
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return errorResponse('该用户名已被使用', 400);
    }

    // 创建新申请
    const newRequest = new RegistrationRequest({
      username,
      password,
      displayName,
      contactInfo,
      reason
    });

    await newRequest.save();

    return successResponse(newRequest, '注册申请已提交，请等待管理员审批', 201);
  } catch (error) {
    console.error('提交申请失败:', error);
    return errorResponse('提交申请失败', 500, error);
  }
}

