import mongoose from 'mongoose';
import { connectDB } from './utils/db.js';
import { successResponse, errorResponse, corsResponse } from './utils/response.js';

/**
 * 健康检查
 * GET /api/health
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
    // 尝试连接数据库
    await connectDB();

    // 检查数据库连接状态
    const dbStatus = mongoose.connection.readyState === 1 ? '已连接' : '未连接';

    return successResponse(
      {
        status: 'ok',
        message: '俄语学习网站API运行中',
        database: dbStatus,
        timestamp: new Date().toISOString(),
        platform: 'Netlify Functions'
      },
      '健康检查成功'
    );
  } catch (error) {
    console.error('健康检查失败:', error);
    return errorResponse('健康检查失败', 500, error);
  }
}

