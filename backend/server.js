import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Railway环境检测
const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT;
const isRailway = process.env.RAILWAY_ENVIRONMENT;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 数据文件路径
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const REQUESTS_FILE = path.join(DATA_DIR, 'requests.json');
const DEVICES_FILE = path.join(DATA_DIR, 'devices.json');

// 确保数据目录和文件存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 初始化数据文件
const initDataFile = (filePath, defaultData) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
};

// 初始化默认数据
initDataFile(USERS_FILE, [
  {
    username: 'user1',
    password: 'password123',
    displayName: '用户1',
    role: '普通用户',
    note: '测试账号',
    createdAt: '2025-01-01'
  },
  {
    username: 'user2',
    password: 'password456',
    displayName: '用户2',
    role: '普通用户',
    note: '测试账号',
    createdAt: '2025-01-01'
  },
  {
    username: 'user3',
    password: 'password789',
    displayName: '用户3',
    role: '普通用户',
    note: '测试账号',
    createdAt: '2025-01-01'
  },
  {
    username: 'admin',
    password: 'admin000',
    displayName: '管理员',
    role: '管理员',
    note: '系统管理员',
    createdAt: '2025-01-01'
  }
]);

initDataFile(REQUESTS_FILE, []);
initDataFile(DEVICES_FILE, {});

// 读取数据
const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`读取文件失败: ${filePath}`, error);
    return null;
  }
};

// 写入数据
const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`写入文件失败: ${filePath}`, error);
    return false;
  }
};

// ==================== 用户管理API ====================

// 获取所有用户
app.get('/api/users', (req, res) => {
  const users = readData(USERS_FILE);
  res.json({ success: true, data: users });
});

// 添加用户
app.post('/api/users', (req, res) => {
  const users = readData(USERS_FILE);
  const newUser = req.body;
  
  // 检查用户名是否已存在
  if (users.some(u => u.username === newUser.username)) {
    return res.json({ success: false, message: '用户名已存在' });
  }
  
  users.push({
    ...newUser,
    createdAt: newUser.createdAt || new Date().toISOString().split('T')[0]
  });
  
  writeData(USERS_FILE, users);
  res.json({ success: true, message: '用户添加成功' });
});

// 更新用户
app.put('/api/users/:username', (req, res) => {
  const users = readData(USERS_FILE);
  const { username } = req.params;
  const updatedData = req.body;
  
  const index = users.findIndex(u => u.username === username);
  if (index === -1) {
    return res.json({ success: false, message: '用户不存在' });
  }
  
  users[index] = { ...users[index], ...updatedData };
  writeData(USERS_FILE, users);
  res.json({ success: true, message: '用户更新成功' });
});

// 删除用户
app.delete('/api/users/:username', (req, res) => {
  const users = readData(USERS_FILE);
  const { username } = req.params;
  
  if (username === 'admin') {
    return res.json({ success: false, message: '不能删除管理员账号' });
  }
  
  const filteredUsers = users.filter(u => u.username !== username);
  writeData(USERS_FILE, filteredUsers);
  
  // 同时清除该用户的设备记录
  const devices = readData(DEVICES_FILE);
  if (devices[username]) {
    delete devices[username];
    writeData(DEVICES_FILE, devices);
  }
  
  res.json({ success: true, message: '用户删除成功' });
});

// 验证用户凭证
app.post('/api/auth/validate', (req, res) => {
  const { username, password } = req.body;
  const users = readData(USERS_FILE);
  
  const user = users.find(u => u.username === username && u.password === password);
  res.json({ success: !!user, user: user || null });
});

// ==================== 注册申请API ====================

// 获取所有注册申请
app.get('/api/registration-requests', (req, res) => {
  const requests = readData(REQUESTS_FILE);
  res.json({ success: true, data: requests });
});

// 提交注册申请
app.post('/api/registration-requests', (req, res) => {
  const requests = readData(REQUESTS_FILE);
  const { username, password, displayName, contactInfo, reason } = req.body;
  
  // 检查是否已有待审批申请
  if (requests.some(r => r.username === username && r.status === 'pending')) {
    return res.json({ success: false, message: '该用户名已在审核中，请勿重复申请' });
  }
  
  // 检查是否已被批准使用
  if (requests.some(r => r.username === username && r.status === 'approved')) {
    return res.json({ success: false, message: '该用户名已被使用' });
  }
  
  const newRequest = {
    id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    username,
    password,
    displayName,
    contactInfo,
    reason,
    status: 'pending',
    submittedAt: new Date().toISOString()
  };
  
  requests.push(newRequest);
  writeData(REQUESTS_FILE, requests);
  res.json({ success: true, message: '注册申请已提交，请等待管理员审批' });
});

// 批准申请
app.post('/api/registration-requests/:id/approve', (req, res) => {
  const requests = readData(REQUESTS_FILE);
  const users = readData(USERS_FILE);
  const { id } = req.params;
  const { adminUsername } = req.body;
  
  const requestIndex = requests.findIndex(r => r.id === id);
  if (requestIndex === -1) {
    return res.json({ success: false, message: '申请不存在' });
  }
  
  const request = requests[requestIndex];
  
  // 添加用户到用户列表
  users.push({
    username: request.username,
    password: request.password,
    displayName: request.displayName,
    role: '普通用户',
    note: request.reason || '用户注册',
    createdAt: new Date().toISOString().split('T')[0]
  });
  
  // 更新申请状态
  requests[requestIndex] = {
    ...request,
    status: 'approved',
    processedAt: new Date().toISOString(),
    processedBy: adminUsername
  };
  
  writeData(USERS_FILE, users);
  writeData(REQUESTS_FILE, requests);
  
  res.json({ success: true, message: '申请已批准，用户已创建' });
});

// 拒绝申请
app.post('/api/registration-requests/:id/reject', (req, res) => {
  const requests = readData(REQUESTS_FILE);
  const users = readData(USERS_FILE);
  const { id } = req.params;
  const { adminUsername, reason } = req.body;
  
  const requestIndex = requests.findIndex(r => r.id === id);
  if (requestIndex === -1) {
    return res.json({ success: false, message: '申请不存在' });
  }
  
  const request = requests[requestIndex];
  
  // 如果是已批准的用户，从用户列表中删除
  if (request.status === 'approved') {
    const filteredUsers = users.filter(u => u.username !== request.username);
    writeData(USERS_FILE, filteredUsers);
  }
  
  // 更新申请状态
  requests[requestIndex] = {
    ...request,
    status: 'rejected',
    processedAt: new Date().toISOString(),
    processedBy: adminUsername,
    rejectionReason: reason || '未通过审核'
  };
  
  writeData(REQUESTS_FILE, requests);
  res.json({ success: true, message: '申请已拒绝' });
});

// 删除申请记录
app.delete('/api/registration-requests/:id', (req, res) => {
  const requests = readData(REQUESTS_FILE);
  const users = readData(USERS_FILE);
  const { id } = req.params;
  
  const request = requests.find(r => r.id === id);
  
  // 如果是已批准的用户，同时删除用户账号
  if (request && request.status === 'approved') {
    const filteredUsers = users.filter(u => u.username !== request.username);
    writeData(USERS_FILE, filteredUsers);
  }
  
  const filteredRequests = requests.filter(r => r.id !== id);
  writeData(REQUESTS_FILE, filteredRequests);
  res.json({ success: true, message: '申请记录已删除' });
});

// ==================== 设备管理API ====================

// 记录设备登录
app.post('/api/devices/login', (req, res) => {
  const devices = readData(DEVICES_FILE);
  const { username, deviceId, deviceType } = req.body;
  
  if (!devices[username]) {
    devices[username] = [];
  }
  
  const deviceInfo = {
    id: deviceId,
    type: deviceType,
    loginTime: Date.now()
  };
  
  // 更新或添加设备
  const existingIndex = devices[username].findIndex(d => d.id === deviceId);
  if (existingIndex !== -1) {
    devices[username][existingIndex] = deviceInfo;
  } else {
    devices[username].push(deviceInfo);
  }
  
  writeData(DEVICES_FILE, devices);
  res.json({ success: true, devices: devices[username] });
});

// 获取用户的设备列表
app.get('/api/devices/:username', (req, res) => {
  const devices = readData(DEVICES_FILE);
  const { username } = req.params;
  
  res.json({ success: true, data: devices[username] || [] });
});

// 设备登出
app.post('/api/devices/logout', (req, res) => {
  const devices = readData(DEVICES_FILE);
  const { username, deviceId } = req.body;
  
  if (devices[username]) {
    devices[username] = devices[username].filter(d => d.id !== deviceId);
    writeData(DEVICES_FILE, devices);
  }
  
  res.json({ success: true });
});

// ==================== 健康检查 ====================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '俄语学习网站API运行中',
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════╗
║   俄语学习网站 API 服务器已启动       ║
║                                        ║
║   环境: ${isRailway ? 'Railway Cloud' : isProduction ? 'Production' : 'Development'}
║   端口: ${PORT}                        ║
║   地址: ${isRailway ? 'Railway提供的域名' : `http://localhost:${PORT}`}
║                                        ║
║   数据存储位置: ${DATA_DIR}            ║
╚════════════════════════════════════════╝
  `);
});

