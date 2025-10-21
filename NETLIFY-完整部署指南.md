# Netlify 完整部署指南（含 MongoDB 用户管理）

## 🎉 一站式解决方案

使用 **Netlify + MongoDB Atlas** 实现完整的用户管理系统，无需 Railway 等第三方后端服务！

---

## 📋 目录

1. [准备 MongoDB Atlas 数据库](#第1步准备-mongodb-atlas-数据库)
2. [部署到 Netlify](#第2步部署到-netlify)
3. [配置环境变量](#第3步配置环境变量)
4. [初始化管理员账号](#第4步初始化管理员账号)
5. [测试系统](#第5步测试系统)

---

## 第1步：准备 MongoDB Atlas 数据库

### 1.1 注册并创建集群

访问：https://www.mongodb.com/cloud/atlas/register

- 用 Google 账号注册最快
- 选择 **AWS** + **新加坡** (ap-southeast-1)
- 集群名：`russian-learning`
- 点击 **Create Cluster**（免费）

### 1.2 创建数据库用户

1. 进入 **Database Access**
2. 点击 **Add New Database User**
3. 用户名：`russianlearning`
4. 密码：点击自动生成，**立即复制保存！**
5. 权限：`Read and write to any database`

### 1.3 配置网络访问

1. 进入 **Network Access**
2. 点击 **Add IP Address**
3. 选择：**Allow Access from Anywhere** (0.0.0.0/0)
4. 点击 **Confirm**

### 1.4 获取连接字符串

1. 回到 **Database** 页面
2. 点击 **Connect** → **Drivers**
3. 复制连接字符串
4. 替换 `<password>` 为真实密码
5. 在末尾添加数据库名：`/russian-learning`

**最终格式：**
```
mongodb+srv://russianlearning:你的密码@russian-learning.xxxxx.mongodb.net/russian-learning?retryWrites=true&w=majority
```

✅ **保存这个连接字符串！后面会用到**

---

## 第2步：部署到 Netlify

### 2.1 推送代码到 GitHub

确保你的代码已经推送到 GitHub：

```bash
git add .
git commit -m "添加 Netlify Functions 支持"
git push
```

### 2.2 连接 Netlify

1. 访问：https://app.netlify.com/
2. 用 GitHub 账号登录
3. 点击 **Add new site** → **Import an existing project**
4. 选择 **GitHub**
5. 找到并选择 `russian-learning` 仓库

### 2.3 配置构建设置

Netlify 会自动检测配置，确认以下设置：

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Functions directory:** `netlify/functions` （自动检测）

### 2.4 点击部署

点击 **Deploy site**，等待首次部署完成（约 2-3 分钟）

---

## 第3步：配置环境变量

### 3.1 添加 MongoDB 连接字符串

1. 在 Netlify 项目页面，进入 **Site configuration** → **Environment variables**
2. 点击 **Add a variable** → **Add a single variable**
3. 添加：
   - **Key:** `MONGODB_URI`
   - **Value:** 你在第1步获得的 MongoDB 连接字符串
   - **Scopes:** 选择所有（Production, Deploy previews, Branch deploys）
4. 点击 **Create variable**

### 3.2 触发重新部署

1. 进入 **Deploys** 页面
2. 点击 **Trigger deploy** → **Deploy site**
3. 等待部署完成（约 2 分钟）

---

## 第4步：初始化管理员账号

### 4.1 获取你的网站地址

部署完成后，Netlify 会提供一个域名，格式类似：
```
https://your-site-name.netlify.app
```

### 4.2 初始化管理员

访问以下地址（用 POST 请求）：
```
https://your-site-name.netlify.app/api/init-admin
```

**方式一：使用浏览器开发者工具**

1. 打开你的网站
2. 按 F12 打开开发者工具
3. 切换到 **Console** 标签
4. 粘贴以下代码并回车：

```javascript
fetch('/api/init-admin', { method: 'POST' })
  .then(res => res.json())
  .then(data => console.log(data));
```

**方式二：使用 curl（如果有命令行工具）**

```bash
curl -X POST https://your-site-name.netlify.app/api/init-admin
```

看到成功消息后，管理员账号就创建好了：
- **用户名：** `admin`
- **密码：** `admin000`

⚠️ **重要：登录后立即修改默认密码！**

---

## 第5步：测试系统

### 5.1 测试健康检查

访问：`https://your-site-name.netlify.app/api/health`

应该看到：
```json
{
  "success": true,
  "message": "健康检查成功",
  "data": {
    "status": "ok",
    "database": "已连接",
    "platform": "Netlify Functions"
  }
}
```

### 5.2 测试数据库状态

访问：`https://your-site-name.netlify.app/api/db-status`

应该看到：
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

### 5.3 测试登录

1. 访问你的网站首页
2. 点击登录
3. 输入：
   - 用户名：`admin`
   - 密码：`admin000`
4. ✅ 登录成功！

### 5.4 测试用户注册

1. 点击"申请账号"
2. 填写信息并提交
3. 用管理员账号登录
4. 进入"用户管理"页面
5. 查看并批准新申请
6. ✅ 新用户可以登录了！

---

## 🎊 完成！你现在拥有：

✅ **完整的前端网站**（部署在 Netlify）  
✅ **Serverless 后端 API**（Netlify Functions）  
✅ **MongoDB 数据库**（Atlas 云数据库）  
✅ **用户管理系统**（注册、登录、设备管理）  
✅ **完全免费**（在免费额度内）

---

## 📊 架构说明

```
用户浏览器
    ↓
Netlify CDN (前端静态文件)
    ↓
Netlify Functions (API)
    ↓
MongoDB Atlas (数据库)
```

**优势：**
- ✅ 一站式管理（只需要 Netlify）
- ✅ 自动扩展（serverless）
- ✅ 全球 CDN 加速
- ✅ 免费 HTTPS
- ✅ 自动部署（Git push 即部署）

---

## 🔧 高级配置

### 绑定自定义域名

1. 进入 **Site configuration** → **Domain management**
2. 点击 **Add custom domain**
3. 输入你的域名
4. 按照提示配置 DNS

### 查看 Functions 日志

1. 进入 **Functions** 页面
2. 点击具体的 Function
3. 查看 **Function log**

### 监控使用情况

1. 进入 **Analytics** 页面
2. 查看访问量、带宽等数据
3. 进入 **Usage** 查看 Functions 调用次数

**Netlify 免费额度：**
- Functions 调用：125,000 次/月
- Functions 运行时间：100 小时/月
- 带宽：100 GB/月

对于个人项目完全足够！

---

## ⚠️ 注意事项

### 1. 修改管理员密码

登录后立即修改默认密码 `admin000`！

### 2. 定期备份数据

- 进入 MongoDB Atlas
- 点击 **Browse Collections**
- 选择数据后点击 **Export**

### 3. 监控函数性能

Netlify Functions 有冷启动延迟（首次调用约 1-2 秒），这是正常的。

### 4. 环境变量安全

- ❌ 不要将 `MONGODB_URI` 提交到 Git
- ✅ 只在 Netlify 控制面板中配置
- ✅ 使用 `.env.example` 文件作为模板

---

## 🆘 故障排查

### 问题：Functions 调用失败

**检查：**
1. 查看 Netlify Functions 日志
2. 确认 `MONGODB_URI` 环境变量已设置
3. 确认 MongoDB 网络访问允许 0.0.0.0/0

### 问题：数据库连接失败

**检查：**
1. MongoDB 连接字符串是否正确
2. 密码是否包含特殊字符（需要 URL 编码）
3. 是否添加了数据库名 `/russian-learning`

### 问题：登录失败

**检查：**
1. 是否已初始化管理员账号
2. 查看 `/api/db-status` 确认数据库连接
3. 查看浏览器控制台错误信息

### 问题：部署后修改没生效

**解决：**
1. 清除浏览器缓存
2. 在 Netlify 触发重新部署
3. 使用隐私模式测试

---

## 📚 API 路由说明

### 用户管理
- `GET /api/users` - 获取用户列表
- `POST /api/users` - 添加用户
- `PUT /api/users/:username` - 更新用户
- `DELETE /api/users/:username` - 删除用户

### 认证
- `POST /api/auth/validate` - 验证用户凭证

### 注册申请
- `GET /api/registration-requests` - 获取申请列表
- `POST /api/registration-requests` - 提交申请
- `POST /api/registration-requests/:id/approve` - 批准申请
- `POST /api/registration-requests/:id/reject` - 拒绝申请
- `DELETE /api/registration-requests/:id` - 删除申请

### 设备管理
- `GET /api/devices/:username` - 获取设备列表
- `POST /api/devices/login` - 记录设备登录
- `POST /api/devices/logout` - 设备登出
- `POST /api/devices/kick` - 踢出设备

### 系统
- `GET /api/health` - 健康检查
- `GET /api/db-status` - 数据库状态
- `POST /api/init-admin` - 初始化管理员

---

## 💡 下一步

现在你可以：

1. ✅ 自定义前端界面
2. ✅ 添加更多功能
3. ✅ 绑定自定义域名
4. ✅ 配置自动备份
5. ✅ 监控网站性能

**享受你的 Netlify 全栈应用吧！** 🎊

---

**总耗时：** 约 15 分钟  
**难度：** ⭐⭐⭐ (中等)  
**费用：** 完全免费  
**稳定性：** ⭐⭐⭐⭐⭐ (生产级)  
**维护成本：** ⭐ (极低)

---

## 🆚 对比其他方案

| 特性 | Netlify 方案 | Railway 方案 | 纯静态方案 |
|------|------------|-------------|-----------|
| 前端部署 | ✅ Netlify | ✅ 任意 | ✅ 任意 |
| 后端部署 | ✅ Functions | ⚠️ Railway | ❌ 无 |
| 数据库 | ✅ MongoDB | ✅ MongoDB | ❌ 无 |
| 管理复杂度 | ✅ 低 | ⚠️ 中 | ✅ 低 |
| 冷启动 | ⚠️ 1-2秒 | ✅ 无 | - |
| 免费额度 | ✅ 慷慨 | ⚠️ 有限 | ✅ 充足 |
| 用户管理 | ✅ 完整 | ✅ 完整 | ❌ 无 |

**推荐：** Netlify 方案是最佳平衡！

