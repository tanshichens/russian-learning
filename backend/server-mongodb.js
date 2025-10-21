import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import RegistrationRequest from './models/RegistrationRequest.js';
import Device from './models/Device.js';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

// Railway环境检测
const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT;
const isRailway = process.env.RAILWAY_ENVIRONMENT;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 连接MongoDB
const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      console.error('❌ 错误：未找到 MONGODB_URI 环境变量');
      console.log('请在 .env 文件中设置 MONGODB_URI');
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB 数据库连接成功');
    
    // 初始化管理员账号
    await initializeAdminAccount();
    
  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error.message);
    console.log('请检查：');
    console.log('1. MONGODB_URI 是否正确');
    console.log('2. 数据库服务是否正常运行');
    console.log('3. 网络连接是否正常');
    process.exit(1);
  }
};

// 初始化管理员账号
const initializeAdminAccount = async () => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    
    if (!adminExists) {
      const admin = new User({
        username: 'admin',
        password: 'admin000',
        displayName: '系统管理员',
        role: '管理员',
        note: '系统初始管理员账号'
      });
      
      await admin.save();
      console.log('✅ 管理员账号初始化成功');
      console.log('   用户名: admin');
      console.log('   密码: admin000');
      console.log('   ⚠️ 请及时修改默认密码！');
    }
  } catch (error) {
    console.error('⚠️ 管理员账号初始化失败:', error.message);
  }
};

// ==================== 用户管理API ====================

// 获取所有用户
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取用户列表失败', error: error.message });
  }
});

// 添加用户
app.post('/api/users', async (req, res) => {
  try {
    const { username, password, displayName, role, note } = req.body;
    
    // 验证必填字段
    if (!username || !password) {
      return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
    }
    
    // 检查用户名是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: '用户名已存在' });
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
    
    res.json({ 
      success: true, 
      message: '用户添加成功',
      data: newUser.toSafeObject()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '添加用户失败', error: error.message });
  }
});

// 更新用户
app.put('/api/users/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const updateData = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }
    
    // 更新字段
    if (updateData.password) user.password = updateData.password;
    if (updateData.displayName !== undefined) user.displayName = updateData.displayName;
    if (updateData.role) user.role = updateData.role;
    if (updateData.note !== undefined) user.note = updateData.note;
    if (updateData.expiresAt !== undefined) user.expiresAt = updateData.expiresAt;
    
    await user.save();
    
    res.json({ 
      success: true, 
      message: '用户更新成功',
      data: user.toSafeObject()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '更新用户失败', error: error.message });
  }
});

// 删除用户
app.delete('/api/users/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    if (username === 'admin') {
      return res.status(403).json({ success: false, message: '不能删除管理员账号' });
    }
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }
    
    // 软删除：标记为不活跃
    user.isActive = false;
    await user.save();
    
    // 同时清除该用户的设备记录
    await Device.deleteMany({ username });
    
    res.json({ success: true, message: '用户删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除用户失败', error: error.message });
  }
});

// 验证用户凭证
app.post('/api/auth/validate', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
    }
    
    const user = await User.findOne({ username, isActive: true });
    
    if (!user) {
      return res.json({ success: false, message: '用户名或密码错误' });
    }
    
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.json({ success: false, message: '用户名或密码错误' });
    }
    
    // 更新最后登录时间
    user.lastLoginAt = new Date();
    await user.save();
    
    res.json({ 
      success: true, 
      user: user.toSafeObject()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '验证失败', error: error.message });
  }
});

// ==================== 注册申请API ====================

// 获取所有注册申请
app.get('/api/registration-requests', async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    
    const requests = await RegistrationRequest.find(query)
      .sort({ submittedAt: -1 });
    
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取注册申请失败', error: error.message });
  }
});

// 提交注册申请
app.post('/api/registration-requests', async (req, res) => {
  try {
    const { username, password, displayName, contactInfo, reason } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
    }
    
    // 检查是否已有待审批申请
    const pendingRequest = await RegistrationRequest.findOne({ 
      username, 
      status: 'pending' 
    });
    
    if (pendingRequest) {
      return res.status(400).json({ success: false, message: '该用户名已在审核中，请勿重复申请' });
    }
    
    // 检查用户名是否已被使用
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: '该用户名已被使用' });
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
    
    res.json({ 
      success: true, 
      message: '注册申请已提交，请等待管理员审批',
      data: newRequest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '提交申请失败', error: error.message });
  }
});

// 批准申请
app.post('/api/registration-requests/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { adminUsername } = req.body;
    
    const request = await RegistrationRequest.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: '申请不存在' });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: '该申请已被处理' });
    }
    
    // 创建用户
    const newUser = new User({
      username: request.username,
      password: request.password,
      displayName: request.displayName,
      role: '普通用户',
      note: request.reason || '用户注册'
    });
    
    await newUser.save();
    
    // 更新申请状态
    request.status = 'approved';
    request.processedAt = new Date();
    request.processedBy = adminUsername;
    await request.save();
    
    res.json({ 
      success: true, 
      message: '申请已批准，用户已创建',
      data: newUser.toSafeObject()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '批准申请失败', error: error.message });
  }
});

// 拒绝申请
app.post('/api/registration-requests/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { adminUsername, reason } = req.body;
    
    const request = await RegistrationRequest.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: '申请不存在' });
    }
    
    // 更新申请状态
    request.status = 'rejected';
    request.processedAt = new Date();
    request.processedBy = adminUsername;
    request.rejectionReason = reason || '未通过审核';
    await request.save();
    
    res.json({ success: true, message: '申请已拒绝' });
  } catch (error) {
    res.status(500).json({ success: false, message: '拒绝申请失败', error: error.message });
  }
});

// 删除申请记录
app.delete('/api/registration-requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const request = await RegistrationRequest.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: '申请不存在' });
    }
    
    // 如果是已批准的申请，同时删除用户账号
    if (request.status === 'approved') {
      await User.findOneAndUpdate(
        { username: request.username },
        { isActive: false }
      );
    }
    
    await RegistrationRequest.findByIdAndDelete(id);
    
    res.json({ success: true, message: '申请记录已删除' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除申请失败', error: error.message });
  }
});

// ==================== 设备管理API ====================

// 记录设备登录
app.post('/api/devices/login', async (req, res) => {
  try {
    const { username, deviceId, deviceType, deviceInfo, ipAddress } = req.body;
    
    if (!username || !deviceId) {
      return res.status(400).json({ success: false, message: '缺少必要参数' });
    }
    
    // 查找或创建设备记录
    let device = await Device.findOne({ username, deviceId });
    
    if (device) {
      // 更新现有设备
      device.loginTime = new Date();
      device.lastActiveTime = new Date();
      device.deviceType = deviceType || device.deviceType;
      device.deviceInfo = deviceInfo || device.deviceInfo;
      device.ipAddress = ipAddress || device.ipAddress;
      device.isActive = true;
    } else {
      // 创建新设备
      device = new Device({
        username,
        deviceId,
        deviceType: deviceType || '未知',
        deviceInfo,
        ipAddress
      });
    }
    
    await device.save();
    
    // 获取该用户的所有活跃设备
    const userDevices = await Device.find({ username, isActive: true });
    
    res.json({ 
      success: true, 
      devices: userDevices
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '记录设备登录失败', error: error.message });
  }
});

// 获取用户的设备列表
app.get('/api/devices/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const devices = await Device.find({ username, isActive: true })
      .sort({ loginTime: -1 });
    
    res.json({ success: true, data: devices });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取设备列表失败', error: error.message });
  }
});

// 设备登出
app.post('/api/devices/logout', async (req, res) => {
  try {
    const { username, deviceId } = req.body;
    
    if (!username || !deviceId) {
      return res.status(400).json({ success: false, message: '缺少必要参数' });
    }
    
    const device = await Device.findOne({ username, deviceId });
    
    if (device) {
      device.isActive = false;
      await device.save();
    }
    
    res.json({ success: true, message: '设备已登出' });
  } catch (error) {
    res.status(500).json({ success: false, message: '设备登出失败', error: error.message });
  }
});

// 踢出设备（管理员功能）
app.post('/api/devices/kick', async (req, res) => {
  try {
    const { username, deviceId } = req.body;
    
    if (!username || !deviceId) {
      return res.status(400).json({ success: false, message: '缺少必要参数' });
    }
    
    await Device.findOneAndUpdate(
      { username, deviceId },
      { isActive: false }
    );
    
    res.json({ success: true, message: '设备已被踢出' });
  } catch (error) {
    res.status(500).json({ success: false, message: '踢出设备失败', error: error.message });
  }
});

// ==================== 健康检查 ====================

app.get('/api/health', async (req, res) => {
  try {
    // 检查数据库连接状态
    const dbStatus = mongoose.connection.readyState === 1 ? '已连接' : '未连接';
    
    res.json({ 
      status: 'ok', 
      message: '俄语学习网站API运行中',
      database: dbStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

// 数据库状态检查
app.get('/api/db-status', async (req, res) => {
  try {
    const userCount = await User.countDocuments({ isActive: true });
    const requestCount = await RegistrationRequest.countDocuments({ status: 'pending' });
    const deviceCount = await Device.countDocuments({ isActive: true });
    
    res.json({
      success: true,
      data: {
        connected: mongoose.connection.readyState === 1,
        database: mongoose.connection.name,
        collections: {
          users: userCount,
          pendingRequests: requestCount,
          activeDevices: deviceCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: '获取数据库状态失败',
      error: error.message 
    });
  }
});

// 启动服务器
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔════════════════════════════════════════╗
║   俄语学习网站 API 服务器已启动       ║
║                                        ║
║   环境: ${isRailway ? 'Railway Cloud' : isProduction ? 'Production' : 'Development'}
║   端口: ${PORT}                        ║
║   地址: ${isRailway ? 'Railway提供的域名' : `http://localhost:${PORT}`}
║                                        ║
║   数据库: MongoDB Atlas               ║
║   状态: ✅ 已连接                     ║
╚════════════════════════════════════════╝
    `);
  });
};

startServer();

