# 后端API部署指南

## 📋 功能说明

后端API实现了跨设备数据同步功能，解决了localStorage只能在同一浏览器使用的限制。

### 主要功能
- ✅ 用户账号管理（增删改查）
- ✅ 注册申请管理（提交、审批、拒绝）
- ✅ 设备登录管理（记录、限制）
- ✅ 数据持久化（JSON文件存储）
- ✅ 跨设备实时同步

## 🚀 快速开始

### 1. 安装依赖

进入backend目录并安装依赖：

```bash
cd backend
npm install
```

### 2. 启动后端服务器

```bash
npm start
```

或使用开发模式（自动重启）：

```bash
npm run dev
```

### 3. 验证服务运行

打开浏览器访问：
```
http://localhost:3001/api/health
```

应该看到：
```json
{
  "status": "ok",
  "message": "俄语学习网站API运行中",
  "timestamp": "2025-01-15T12:00:00.000Z"
}
```

### 4. 配置前端连接

在前端项目根目录创建 `.env` 文件：

```env
VITE_API_URL=http://localhost:3001/api
```

### 5. 启动前端

```bash
cd ..
npm run dev
```

## 📁 项目结构

```
backend/
├── package.json          # 后端依赖配置
├── server.js            # 主服务器文件
├── env.example          # 环境变量示例
└── data/                # 数据存储目录（自动创建）
    ├── users.json       # 用户账号数据
    ├── requests.json    # 注册申请数据
    └── devices.json     # 设备登录记录
```

## 🔌 API接口文档

### 用户管理接口

#### 获取所有用户
```
GET /api/users
```

响应：
```json
{
  "success": true,
  "data": [
    {
      "username": "user1",
      "password": "password123",
      "displayName": "用户1",
      "role": "普通用户",
      "createdAt": "2025-01-01"
    }
  ]
}
```

#### 添加用户
```
POST /api/users
Content-Type: application/json

{
  "username": "newuser",
  "password": "newpass123",
  "displayName": "新用户",
  "role": "普通用户"
}
```

#### 更新用户
```
PUT /api/users/:username
Content-Type: application/json

{
  "password": "newpassword",
  "displayName": "更新后的名字"
}
```

#### 删除用户
```
DELETE /api/users/:username
```

#### 验证用户凭证
```
POST /api/auth/validate
Content-Type: application/json

{
  "username": "user1",
  "password": "password123"
}
```

### 注册申请接口

#### 获取所有申请
```
GET /api/registration-requests
```

#### 提交申请
```
POST /api/registration-requests
Content-Type: application/json

{
  "username": "zhangsan",
  "password": "zhang123",
  "displayName": "张三"
}
```

#### 批准申请
```
POST /api/registration-requests/:id/approve
Content-Type: application/json

{
  "adminUsername": "admin"
}
```

#### 拒绝申请
```
POST /api/registration-requests/:id/reject
Content-Type: application/json

{
  "adminUsername": "admin",
  "reason": "不符合要求"
}
```

#### 删除申请
```
DELETE /api/registration-requests/:id
```

### 设备管理接口

#### 记录设备登录
```
POST /api/devices/login
Content-Type: application/json

{
  "username": "user1",
  "deviceId": "device_xxx",
  "deviceType": "mobile"
}
```

#### 获取用户设备列表
```
GET /api/devices/:username
```

#### 设备登出
```
POST /api/devices/logout
Content-Type: application/json

{
  "username": "user1",
  "deviceId": "device_xxx"
}
```

## 🌐 部署到生产环境

### 方案1：部署到云服务器

#### 使用PM2保持运行
```bash
# 安装PM2
npm install -g pm2

# 启动服务
cd backend
pm2 start server.js --name russian-learning-api

# 设置开机自启
pm2 startup
pm2 save
```

#### 使用Nginx反向代理
```nginx
server {
    listen 80;
    server_name api.your-domain.com;
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 方案2：部署到Vercel（Serverless）

创建 `backend/vercel.json`：
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

部署：
```bash
cd backend
vercel
```

### 方案3：部署到Heroku

创建 `backend/Procfile`：
```
web: node server.js
```

部署：
```bash
cd backend
heroku create russian-learning-api
git push heroku main
```

## 🔧 环境变量配置

### 开发环境
创建 `backend/.env` 文件：
```env
PORT=3001
CORS_ORIGIN=http://localhost:5173
DATA_STORAGE=json
```

### 生产环境
```env
PORT=3001
CORS_ORIGIN=https://your-domain.com
DATA_STORAGE=json
```

## 📊 数据存储

### 当前方案：JSON文件
- 优点：简单、无需数据库、易于备份
- 缺点：并发性能一般
- 适用：小规模应用（<1000用户）

### 升级方案：MongoDB
如需更高性能，可升级到MongoDB：

1. 安装mongoose：
```bash
npm install mongoose
```

2. 修改server.js使用MongoDB而非JSON文件

3. 配置环境变量：
```env
DATA_STORAGE=mongodb
MONGODB_URI=mongodb://localhost:27017/russian-learning
```

## 🔐 安全建议

### 生产环境必须做的事
1. ✅ 添加环境变量管理密钥
2. ✅ 使用HTTPS（Let's Encrypt免费证书）
3. ✅ 添加请求速率限制
4. ✅ 密码加密（bcrypt）
5. ✅ JWT token认证
6. ✅ 输入验证和清理
7. ✅ CORS配置限制来源

### 示例：添加速率限制
```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制100个请求
});

app.use('/api/', limiter);
```

## 🧪 测试API

使用curl测试：

```bash
# 健康检查
curl http://localhost:3001/api/health

# 获取用户列表
curl http://localhost:3001/api/users

# 提交注册申请
curl -X POST http://localhost:3001/api/registration-requests \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123","displayName":"测试用户"}'

# 获取申请列表
curl http://localhost:3001/api/registration-requests
```

## 📦 前端配置

### 开发环境
创建 `.env` 文件：
```env
VITE_API_URL=http://localhost:3001/api
```

### 生产环境
```env
VITE_API_URL=https://api.your-domain.com/api
```

## 🔄 数据迁移

### 从localStorage迁移到API

如果之前使用localStorage，可以导出数据：

```javascript
// 在浏览器控制台运行
const users = JSON.parse(localStorage.getItem('user_accounts_db'));
const requests = JSON.parse(localStorage.getItem('registration_requests'));
console.log('用户:', JSON.stringify(users, null, 2));
console.log('申请:', JSON.stringify(requests, null, 2));
```

然后将数据保存到：
- `backend/data/users.json`
- `backend/data/requests.json`

## 🎯 使用流程

### 开发环境
1. 启动后端：`cd backend && npm start`
2. 启动前端：`cd .. && npm run dev`
3. 访问：`http://localhost:5173`

### 生产环境
1. 部署后端到云服务器（获得API地址）
2. 配置前端 `VITE_API_URL`
3. 构建前端：`npm run build`
4. 部署前端到Netlify/Vercel/OBS

## ❓ 常见问题

### Q: 后端服务器如何保持运行？
A: 使用PM2或systemd等进程管理工具

### Q: 数据会丢失吗？
A: JSON文件会持久化保存，除非手动删除

### Q: 可以换成数据库吗？
A: 可以，修改server.js使用MongoDB或MySQL

### Q: 如何备份数据？
A: 定期复制 `backend/data/` 目录

### Q: API需要认证吗？
A: 当前版本未添加API认证，生产环境建议添加JWT

## 🎁 快速部署脚本

创建 `deploy.sh`：
```bash
#!/bin/bash

# 安装后端依赖
cd backend
npm install

# 启动后端
pm2 start server.js --name russian-api

# 返回前端
cd ..

# 构建前端
npm run build

# 部署前端（根据你的部署方式）
npm run deploy:obs

echo "部署完成！"
```

## 📞 技术支持

需要帮助？检查以下内容：
1. 后端是否正常运行：访问 `http://localhost:3001/api/health`
2. 前端API配置是否正确：检查 `.env` 文件
3. CORS是否配置正确：检查浏览器控制台
4. 数据文件是否存在：检查 `backend/data/` 目录

现在你有了完整的后端API系统，可以实现真正的跨设备同步！

