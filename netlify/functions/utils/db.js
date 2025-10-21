import mongoose from 'mongoose';

let cachedConnection = null;

/**
 * 连接到 MongoDB 数据库（支持连接复用）
 */
export async function connectDB() {
  // 如果已有连接，直接返回
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI 环境变量未设置');
    }

    // 连接配置
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
    };

    // 建立连接
    cachedConnection = await mongoose.connect(MONGODB_URI, options);
    
    console.log('✅ MongoDB 连接成功');
    
    return cachedConnection;
  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error.message);
    throw error;
  }
}

/**
 * 关闭数据库连接
 */
export async function closeDB() {
  if (cachedConnection) {
    await mongoose.connection.close();
    cachedConnection = null;
  }
}

