# 后端 MongoDB 版本使用指南

## 🚀 快速启动

### 1. 安装依赖

```bash
npm install
```

这会安装：
- `express` - Web框架
- `mongoose` - MongoDB驱动
- `bcryptjs` - 密码加密
- `dotenv` - 环境变量
- `cors` - 跨域支持
- `body-parser` - 请求解析

### 2. 配置环境变量

复制示例文件：
```bash
# Windows
copy env.mongodb.example .env

# Mac/Linux
cp env.mongodb.example .env
```

编辑 `.env` 文件：
```env
MONGODB_URI=mongodb+srv://你的用户名:你的密码@你的集群.mongodb.net/russian-learning?retryWrites=true&w=majority
NODE_ENV=development
PORT=3001
```

### 3. 测试数据库连接

```bash
npm run test:db
```

**成功输出：**
```
✅ MongoDB 连接成功！

📊 数据库信息：
   数据库名：russian-learning
   集合数量：0
   现有集合：暂无（首次连接）

🎉 测试完成！你的 MongoDB 配置正确！
```

### 4. 启动服务器

```bash
npm start
```

**成功输出：**
```
╔════════════════════════════════════════╗
║   俄语学习网站 API 服务器已启动       ║
║                                        ║
║   环境: Development                    ║
║   端口: 3001                           ║
║   地址: http://localhost:3001          ║
║                                        ║
║   数据库: MongoDB Atlas               ║
║   状态: ✅ 已连接                     ║
╚════════════════════════════════════════╝
✅ MongoDB 数据库连接成功
✅ 管理员账号初始化成功
   用户名: admin
   密码: admin000
   ⚠️ 请及时修改默认密码！
```

---

## 📡 API 端点

### 健康检查

**GET** `/api/health`

响应：
```json
{
  "status": "ok",
  "message": "俄语学习网站API运行中",
  "database": "已连接",
  "timestamp": "2025-10-19T10:30:00.000Z"
}
```

### 数据库状态

**GET** `/api/db-status`

响应：
```json
{
  "success": true,
  "data": {
    "connected": true,
    "database": "russian-learning",
    "collections": {
      "users": 1,
      "pendingRequests": 0,
      "activeDevices": 0
    }
  }
}
```

### 用户管理

- **GET** `/api/users` - 获取所有用户
- **POST** `/api/users` - 添加用户
- **PUT** `/api/users/:username` - 更新用户
- **DELETE** `/api/users/:username` - 删除用户
- **POST** `/api/auth/validate` - 验证用户凭证

### 注册申请

- **GET** `/api/registration-requests` - 获取所有申请
- **POST** `/api/registration-requests` - 提交申请
- **POST** `/api/registration-requests/:id/approve` - 批准申请
- **POST** `/api/registration-requests/:id/reject` - 拒绝申请
- **DELETE** `/api/registration-requests/:id` - 删除申请

### 设备管理

- **POST** `/api/devices/login` - 记录设备登录
- **GET** `/api/devices/:username` - 获取用户设备
- **POST** `/api/devices/logout` - 设备登出
- **POST** `/api/devices/kick` - 踢出设备

---

## 🔧 开发命令

```bash
# 启动服务器（MongoDB版本）
npm start

# 启动服务器（JSON文件版本）
npm run start:json

# 开发模式（自动重启）
npm run dev

# 测试数据库连接
npm run test:db
```

---

## 🗄️ 数据模型

### User（用户）
- `username` - 用户名（唯一，必填）
- `password` - 密码（加密存储，必填）
- `displayName` - 显示名称
- `role` - 角色（普通用户/学生/教师/管理员）
- `note` - 备注
- `isActive` - 是否活跃
- `lastLoginAt` - 最后登录时间
- `createdAt` - 创建时间
- `updatedAt` - 更新时间

### RegistrationRequest（注册申请）
- `username` - 申请的用户名
- `password` - 密码
- `displayName` - 显示名称
- `contactInfo` - 联系方式
- `reason` - 申请原因
- `status` - 状态（pending/approved/rejected）
- `submittedAt` - 提交时间
- `processedAt` - 处理时间
- `processedBy` - 处理人

### Device（设备）
- `username` - 用户名
- `deviceId` - 设备ID
- `deviceType` - 设备类型（手机/平板/电脑）
- `loginTime` - 登录时间
- `lastActiveTime` - 最后活跃时间
- `isActive` - 是否活跃

---

## 🔐 安全特性

### 密码加密
使用 bcrypt 加密密码：
- Salt rounds: 10
- 自动在保存前加密
- 无法解密，只能验证

### 环境变量
敏感信息存储在 `.env` 文件中：
- 不会提交到 Git
- 每个环境独立配置

### 软删除
删除用户时：
- 不是真正删除记录
- 只是标记为 `isActive: false`
- 可以恢复

---

## 📝 使用示例

### 添加用户

```javascript
POST /api/users
Content-Type: application/json

{
  "username": "student1",
  "password": "password123",
  "displayName": "学生1",
  "role": "学生",
  "note": "2025春季班"
}
```

### 验证登录

```javascript
POST /api/auth/validate
Content-Type: application/json

{
  "username": "admin",
  "password": "admin000"
}
```

响应：
```json
{
  "success": true,
  "user": {
    "username": "admin",
    "displayName": "系统管理员",
    "role": "管理员",
    "lastLoginAt": "2025-10-19T10:30:00.000Z"
  }
}
```

---

## 🐛 故障排查

### 问题1：连接失败

**错误信息：**
```
MongoServerError: bad auth
```

**解决：**
- 检查用户名和密码是否正确
- 确认密码中的特殊字符已URL编码
- 验证数据库用户是否创建成功

### 问题2：超时

**错误信息：**
```
MongooseError: Operation timed out
```

**解决：**
- 检查网络访问是否配置（0.0.0.0/0）
- 确认集群是否正常运行
- 检查防火墙设置

### 问题3：数据库未找到

**错误信息：**
```
MongooseError: Database not found
```

**解决：**
- 确认 MONGODB_URI 中包含数据库名
- 格式应为：`...mongodb.net/russian-learning?...`

---

## 📚 相关文档

- [MongoDB 配置指南](../MONGODB-SETUP-GUIDE.md)
- [完整部署教程](../MONGODB-DEPLOYMENT-GUIDE.md)
- [快速开始指南](../MONGODB-快速开始.md)

---

## 💡 提示

1. **首次启动**会自动创建管理员账号
2. **密码修改**后会自动重新加密
3. **设备限制**默认为2个设备
4. **数据备份**建议每周一次

---

**需要帮助？** 查看完整文档或联系支持！

