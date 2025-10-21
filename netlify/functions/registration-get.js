import { connectDB } from './utils/db.js';
import { successResponse, errorResponse, corsResponse } from './utils/response.js';
import RegistrationRequest from './models/RegistrationRequest.js';

/**
 * 获取注册申请列表
 * GET /api/registration-requests?status=pending
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

    // 获取查询参数
    const { status } = event.queryStringParameters || {};
    const query = status ? { status } : {};

    // 查询注册申请
    const requests = await RegistrationRequest.find(query)
      .sort({ submittedAt: -1 });

    return successResponse(requests, '获取注册申请成功');
  } catch (error) {
    console.error('获取注册申请失败:', error);
    return errorResponse('获取注册申请失败', 500, error);
  }
}

