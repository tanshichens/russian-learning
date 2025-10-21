/**
 * MongoDB 连接测试脚本
 * 用于验证数据库配置是否正确
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('\n🔍 开始测试 MongoDB 连接...\n');

if (!MONGODB_URI) {
  console.error('❌ 错误：未找到 MONGODB_URI 环境变量');
  console.log('\n请检查：');
  console.log('1. 是否创建了 .env 文件');
  console.log('2. .env 文件中是否包含 MONGODB_URI');
  console.log('3. MONGODB_URI 格式是否正确\n');
  process.exit(1);
}

// 测试连接
const testConnection = async () => {
  try {
    console.log('📡 正在连接到 MongoDB Atlas...');
    console.log(`   URI: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}\n`);

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ MongoDB 连接成功！\n');

    // 获取数据库信息
    const dbName = mongoose.connection.db.databaseName;
    const collections = await mongoose.connection.db.listCollections().toArray();

    console.log('📊 数据库信息：');
    console.log(`   数据库名：${dbName}`);
    console.log(`   集合数量：${collections.length}`);
    
    if (collections.length > 0) {
      console.log('   现有集合：');
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    } else {
      console.log('   现有集合：暂无（首次连接）');
    }

    console.log('\n🎉 测试完成！你的 MongoDB 配置正确！\n');
    console.log('下一步：');
    console.log('1. 运行 npm start 启动服务器');
    console.log('2. 访问 http://localhost:3001/api/health 测试API');
    console.log('3. 使用 admin / admin000 登录测试\n');

  } catch (error) {
    console.error('❌ 连接失败：', error.message);
    console.log('\n可能的原因：');
    console.log('1. MONGODB_URI 格式不正确');
    console.log('2. 密码包含特殊字符未编码');
    console.log('3. 网络访问未配置（需要添加 0.0.0.0/0）');
    console.log('4. 数据库用户不存在或密码错误');
    console.log('5. 集群未创建成功或正在初始化\n');
    console.log('请查看 MONGODB-SETUP-GUIDE.md 获取帮助\n');
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

testConnection();

