# MongoDB 版本完整部署指南

## 🎯 部署架构

```
┌─────────────────────────────────────────────────────────────┐
│                        完整架构图                            │
└─────────────────────────────────────────────────────────────┘

    用户浏览器
        ↓
┌──────────────┐
│   前端网站    │  (Netlify / Railway / 华为云OBS)
│  React应用   │
└──────────────┘
        ↓ API调用
┌──────────────┐
│   后端API    │  (Railway)
│ Node.js服务  │
└──────────────┘
        ↓ 数据库连接
┌──────────────┐
│ MongoDB Atlas│  (MongoDB云服务)
│   数据库     │
└──────────────┘
```

---

## 📋 部署检查清单

在开始之前，确保你已完成：

- [ ] 已注册 MongoDB Atlas 账号
- [ ] 已创建 MongoDB 免费集群
- [ ] 已获取数据库连接字符串
- [ ] 已注册 Railway 账号
- [ ] 已将代码推送到 GitHub

---

## 第一步：部署后端到 Railway（使用 MongoDB）

### 1.1 准备后端代码

确认你的 `backend/package.json` 已更新：

```json
{
  "scripts": {
    "start": "node server-mongodb.js",
    "start:json": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2",
    "mongoose": "^8.0.0",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.3.1"
  }
}
```

### 1.2 推送代码到 GitHub

```bash
# 在项目根目录
git add .
git commit -m "添加MongoDB数据库支持"
git push
```

### 1.3 创建 Railway 项目

1. 访问：https://railway.app/new
2. 点击 **"Login with GitHub"**
3. 授权 Railway 访问你的 GitHub

### 1.4 部署后端服务

#### 选择仓库

1. 点击 **"Deploy from GitHub repo"**
2. 选择 `russian-learning` 仓库
3. 点击 **"Deploy Now"**

#### 配置后端服务

1. **配置根目录**
   ```
   设置 → Root Directory → backend
   ```

2. **添加环境变量**
   
   点击 **"Variables"** 标签，添加以下变量：

   | 变量名 | 值 | 说明 |
   |--------|-----|------|
   | `MONGODB_URI` | `mongodb+srv://...` | 你的MongoDB连接字符串 |
   | `NODE_ENV` | `production` | 生产环境标识 |
   | `PORT` | (留空) | Railway自动分配 |

   **获取 MongoDB 连接字符串：**
   
   ```
   mongodb+srv://用户名:密码@集群地址/russian-learning?retryWrites=true&w=majority
   ```
   
   ⚠️ **重要提示：**
   - 替换 `<password>` 为真实密码
   - 确保添加了数据库名 `/russian-learning`
   - 特殊字符需要URL编码

3. **生成公网域名**
   ```
   设置 → Networking → Generate Domain
   ```
   
   你会得到类似：
   ```
   russian-learning-backend-production.up.railway.app
   ```
   
   **⭐ 复制并保存这个域名！**

4. **等待部署完成**
   - 点击 **"Deployments"**
   - 等待状态变为 ✅ **SUCCESS**
   - 大约需要 2-3 分钟

### 1.5 验证后端部署

在浏览器访问：

```
https://你的后端域名.up.railway.app/api/health
```

**成功响应：**
```json
{
  "status": "ok",
  "message": "俄语学习网站API运行中",
  "database": "已连接",
  "timestamp": "2025-10-19T10:30:00.000Z"
}
```

**检查数据库状态：**
```
https://你的后端域名.up.railway.app/api/db-status
```

**成功响应：**
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

✅ 看到以上响应说明后端部署成功！

---

## 第二步：配置前端连接后端

### 2.1 更新前端 API 配置

前端已经配置好了 API 连接，只需设置环境变量。

### 2.2 选择前端部署方式

你有三种选择：

#### 选项A：部署到 Railway（推荐，最简单）
#### 选项B：部署到 Netlify（适合静态网站）
#### 选项C：部署到华为云 OBS（你已经在用）

---

### 📍 选项A：部署前端到 Railway

#### A.1 在同一个 Railway 项目中添加前端服务

1. 回到 Railway 项目主页
2. 点击 **"+ New"**
3. 选择 **"GitHub Repo"**
4. 再次选择 `russian-learning` 仓库

#### A.2 配置前端服务

1. **设置环境变量**
   
   点击 **"Variables"**，添加：
   
   ```
   VITE_API_URL=https://你的后端域名.up.railway.app/api
   ```
   
   ⚠️ 注意：
   - 替换为你在步骤1.4中获得的后端域名
   - 必须以 `/api` 结尾
   - 使用 `https://` 不是 `http://`

2. **配置构建命令**
   
   在 **"Settings"** 中：
   
   ```
   Build Command: npm install && npm run build
   Start Command: npx serve dist -s -p $PORT
   ```

3. **生成前端域名**
   ```
   Settings → Networking → Generate Domain
   ```
   
   你会得到：
   ```
   russian-learning-production.up.railway.app
   ```

4. **等待部署**
   - 大约 3-5 分钟
   - 状态变为 ✅ **SUCCESS**

#### A.3 测试前端

访问你的前端域名：
```
https://russian-learning-production.up.railway.app
```

测试功能：
- [ ] 网站正常显示
- [ ] 可以访问首页
- [ ] 可以点击"申请账号"
- [ ] 可以用 `admin` / `admin000` 登录
- [ ] 登录后可以看到"用户管理"

✅ 全部通过说明部署成功！

---

### 📍 选项B：部署前端到 Netlify

#### B.1 在 Netlify 创建新站点

1. 访问：https://app.netlify.com/
2. 点击 **"Add new site"** → **"Import an existing project"**
3. 选择 **"GitHub"**
4. 选择 `russian-learning` 仓库

#### B.2 配置构建设置

```
Build command:    npm run build
Publish directory: dist
```

#### B.3 添加环境变量

在 **Site settings → Environment variables** 中添加：

```
VITE_API_URL = https://你的后端域名.railway.app/api
```

#### B.4 部署

1. 点击 **"Deploy site"**
2. 等待构建完成（2-3分钟）
3. 获得你的 Netlify 域名

---

### 📍 选项C：部署前端到华为云 OBS

#### C.1 配置 API 地址

在项目根目录创建 `.env.production` 文件：

```env
VITE_API_URL=https://你的后端域名.railway.app/api
```

#### C.2 构建项目

```bash
npm run build
```

#### C.3 部署到 OBS

使用你现有的部署脚本：

```bash
npm run deploy:obs-spa
```

或手动上传 `dist` 文件夹到 OBS。

---

## 第三步：测试完整系统

### 3.1 测试用户注册流程

1. **访问网站首页**

2. **点击"单词库"**（会跳转到登录页）

3. **点击"立即申请账号"**

4. **填写注册表单：**
   ```
   用户名：testuser
   密码：test123456
   显示名称：测试用户
   联系方式：test@example.com
   申请原因：测试注册功能
   ```

5. **提交申请**
   
   应该看到：✅ "注册申请已提交，请等待管理员审批"

### 3.2 测试管理员审批

1. **使用管理员登录：**
   ```
   用户名：admin
   密码：admin000
   ```

2. **点击"用户管理"**

3. **在"注册申请"标签页中：**
   - 看到 testuser 的申请
   - 点击 ✅ "批准"
   - 确认批准

4. **在"用户列表"标签页中：**
   - 确认 testuser 已出现在用户列表中

### 3.3 测试新用户登录

1. **退出管理员账号**

2. **使用新账号登录：**
   ```
   用户名：testuser
   密码：test123456
   ```

3. **确认功能：**
   - [ ] 可以访问单词库
   - [ ] 可以访问下载页面
   - [ ] 可以看到自己的用户信息

### 3.4 测试设备限制

1. **在第一个设备上登录 testuser**
2. **在第二个设备上登录 testuser**（应该成功）
3. **在第三个设备上尝试登录 testuser**
   
   应该看到：❌ "您的账号已在2个设备上登录，请先退出其他设备"

---

## 🎉 完成！

恭喜！你已经成功部署了完整的系统！

### ✅ 你现在拥有：

```
┌─────────────────────────────────────────┐
│         你的完整系统架构                 │
├─────────────────────────────────────────┤
│                                         │
│  前端网站：                              │
│  https://你的前端域名                    │
│                                         │
│  后端API：                               │
│  https://你的后端域名.railway.app       │
│                                         │
│  数据库：                                │
│  MongoDB Atlas（云端）                  │
│                                         │
│  功能：                                 │
│  ✅ 用户注册审批                         │
│  ✅ 用户登录认证                         │
│  ✅ 密码加密存储                         │
│  ✅ 设备限制（2个设备）                  │
│  ✅ 用户管理界面                         │
│  ✅ 数据永久保存                         │
│  ✅ 全球访问                             │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔧 后续维护

### 更新代码

当你修改代码后：

```bash
# 1. 提交到Git
git add .
git commit -m "更新说明"
git push

# 2. Railway会自动重新部署
# 无需手动操作，等待几分钟即可
```

### 查看日志

**Railway 日志：**
1. 登录 Railway
2. 选择项目
3. 点击 "Deployments"
4. 查看最新部署的日志

### 监控数据库

**MongoDB Atlas：**
1. 登录 MongoDB Atlas
2. 点击 "Metrics"
3. 查看：
   - 连接数
   - 存储使用量
   - 查询性能

### 备份数据

**定期备份（推荐每周一次）：**

1. 登录 MongoDB Atlas
2. 点击 "Browse Collections"
3. 导出重要集合：
   - users（用户数据）
   - registrationrequests（注册申请）
4. 保存到本地

---

## ⚠️ 重要安全提示

### 1. 修改默认管理员密码

⚠️ **首要任务！**

```
登录后端API：
POST /api/users/admin
Body: {
  "password": "新的强密码"
}
```

或在用户管理界面修改。

### 2. 保护环境变量

❌ **绝对不要：**
- 将 `.env` 文件提交到 Git
- 在公开场合分享数据库连接字符串
- 使用简单的数据库密码

✅ **应该做：**
- `.env` 已在 `.gitignore` 中
- 使用强密码（至少12位，包含大小写字母、数字、特殊字符）
- 定期更换密码

### 3. 监控访问

定期检查：
- Railway 日志中的异常请求
- MongoDB Atlas 的连接日志
- 用户注册申请是否异常

---

## 🐛 故障排查

### 问题1：前端无法连接后端

**症状：**
- 登录失败
- 注册失败
- 显示"网络请求失败"

**检查：**
1. 后端是否正常运行
   ```
   访问：https://后端域名/api/health
   ```

2. 前端环境变量是否正确
   ```
   确认：VITE_API_URL 是否正确
   ```

3. CORS是否配置
   ```
   后端已配置cors()，应该不会有问题
   ```

### 问题2：数据库连接失败

**症状：**
- Railway 日志显示"MongoDB 连接失败"
- API 返回 500 错误

**检查：**
1. MongoDB Atlas 集群是否正常运行
2. `MONGODB_URI` 是否正确
3. 密码特殊字符是否正确编码
4. 网络访问是否允许（0.0.0.0/0）
5. 数据库用户是否存在

### 问题3：Railway 部署失败

**症状：**
- 部署状态显示 ❌ FAILED

**检查：**
1. 查看部署日志
2. 检查 `package.json` 是否正确
3. 检查环境变量是否设置
4. 确认 Root Directory 设置（后端应为 `backend`）

### 问题4：登录后立即退出

**症状：**
- 登录成功但刷新页面后又退出了

**原因：**
- 本地存储被清除
- 或者是浏览器的隐私模式

**解决：**
- 使用普通浏览器模式
- 不要清除浏览器缓存

---

## 📞 获取帮助

### 文档资源

- [MongoDB Atlas 文档](./MONGODB-SETUP-GUIDE.md)
- [后端 API 文档](./BACKEND-API-SETUP.md)
- [账号管理指南](./ACCOUNT-MANAGEMENT.md)

### 在线资源

- [Railway 文档](https://docs.railway.app/)
- [MongoDB Atlas 文档](https://www.mongodb.com/docs/atlas/)
- [Vite 环境变量](https://vitejs.dev/guide/env-and-mode.html)

---

## 🎓 从这里继续

你已经完成了基础部署，接下来可以：

1. **添加更多功能**
   - 用户个人资料编辑
   - 学习进度追踪
   - 在线考试系统

2. **优化性能**
   - 添加缓存
   - 优化数据库查询
   - 使用CDN加速

3. **增强安全**
   - 添加JWT认证
   - 实现登录验证码
   - 添加操作日志

4. **改善用户体验**
   - 添加邮件通知
   - 实现找回密码
   - 添加移动App

---

**创建时间：** 2025-10-19  
**适用版本：** MongoDB版本  
**作者：** AI Assistant  
**项目：** 俄语学习网站

