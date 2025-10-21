import { connectDB } from './utils/db.js';
import { successResponse, errorResponse, corsResponse } from './utils/response.js';
import RegistrationRequest from './models/RegistrationRequest.js';
import User from './models/User.js';

/**
 * 删除注册申请记录
 * DELETE /api/registration-requests/:id
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

    // 解析请求体
    const { id } = JSON.parse(event.body || '{}');

    // 查找申请
    const request = await RegistrationRequest.findById(id);
    if (!request) {
      return errorResponse('申请不存在', 404);
    }

    // 如果是已批准的申请，同时删除用户账号
    if (request.status === 'approved') {
      await User.findOneAndUpdate(
        { username: request.username },
        { isActive: false }
      );
    }

    // 删除申请记录
    await RegistrationRequest.findByIdAndDelete(id);

    return successResponse(null, '申请记录已删除');
  } catch (error) {
    console.error('删除申请失败:', error);
    return errorResponse('删除申请失败', 500, error);
  }
}

