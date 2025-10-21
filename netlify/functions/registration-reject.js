import { connectDB } from './utils/db.js';
import { successResponse, errorResponse, corsResponse } from './utils/response.js';
import RegistrationRequest from './models/RegistrationRequest.js';

/**
 * 拒绝注册申请
 * POST /api/registration-requests/:id/reject
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
    const id = pathParts[pathParts.length - 2]; // /api/registration-requests/:id/reject

    // 解析请求体
    const { adminUsername, reason } = JSON.parse(event.body || '{}');

    // 查找申请
    const request = await RegistrationRequest.findById(id);
    if (!request) {
      return errorResponse('申请不存在', 404);
    }

    // 更新申请状态
    request.status = 'rejected';
    request.processedAt = new Date();
    request.processedBy = adminUsername;
    request.rejectionReason = reason || '未通过审核';
    await request.save();

    return successResponse(null, '申请已拒绝');
  } catch (error) {
    console.error('拒绝申请失败:', error);
    return errorResponse('拒绝申请失败', 500, error);
  }
}

