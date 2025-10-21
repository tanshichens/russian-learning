# ✅ Netlify 部署检查清单

## 📋 快速检查 - 打印此页面对照操作

---

## 第一步：MongoDB Atlas（5 分钟）

### □ 1.1 注册账号
- [ ] 访问 https://www.mongodb.com/cloud/atlas/register
- [ ] 使用 Google 账号注册（推荐）
- [ ] 登录成功

### □ 1.2 创建集群
- [ ] 选择 **M0 FREE**（免费）
- [ ] Cloud Provider: **AWS**
- [ ] Region: **Singapore (ap-southeast-1)**
- [ ] Cluster Name: **russian-learning**
- [ ] 点击 **Create Cluster**
- [ ] 等待集群创建完成（1-3 分钟）

### □ 1.3 创建数据库用户
- [ ] 进入 **Security** → **Database Access**
- [ ] 点击 **ADD NEW DATABASE USER**
- [ ] Username: **russianlearning**
- [ ] 点击 **Autogenerate Secure Password**
- [ ] 💾 **复制并保存密码！**（写在下面）
  ```
  我的 MongoDB 密码：____________________
  ```
- [ ] 权限: **Read and write to any database**
- [ ] 点击 **Add User**

### □ 1.4 配置网络访问
- [ ] 进入 **Security** → **Network Access**
- [ ] 点击 **ADD IP ADDRESS**
- [ ] 点击 **ALLOW ACCESS FROM ANYWHERE**
- [ ] 确认填入 `0.0.0.0/0`
- [ ] 点击 **Confirm**
- [ ] 等待 Status 变为 **Active**

### □ 1.5 获取连接字符串
- [ ] 进入 **Database** 页面
- [ ] 点击 **Connect** 按钮
- [ ] 选择 **Connect your application**
- [ ] Driver: **Node.js**
- [ ] 点击 **Copy** 复制连接字符串
- [ ] 在记事本中修改：
  - [ ] 替换 `<password>` 为真实密码
  - [ ] 在 `.mongodb.net/` 后添加 `russian-learning`
- [ ] 💾 **最终连接字符串：**（写在下面）
  ```
  mongodb+srv://russianlearning:____________@___________.mongodb.net/russian-learning?retryWrites=true&w=majority
  ```

---

## 第二步：推送代码到 GitHub（3 分钟）

### □ 2.1 打开命令行
- [ ] 进入项目目录
  ```bash
  cd C:\Users\47015\Desktop\russian-learning
  ```

### □ 2.2 提交代码
- [ ] 添加所有文件
  ```bash
  git add .
  ```
- [ ] 提交到本地
  ```bash
  git commit -m "添加 Netlify Functions 支持"
  ```
- [ ] 推送到 GitHub
  ```bash
  git push origin main
  ```
- [ ] 看到 "successfully pushed"

### □ 2.3 验证推送
- [ ] 打开 GitHub 仓库页面
- [ ] 刷新，看到 `netlify/` 文件夹
- [ ] 看到新的提交记录

---

## 第三步：Netlify 部署（5 分钟）

### □ 3.1 登录 Netlify
- [ ] 访问 https://app.netlify.com/
- [ ] 点击 **Log in with GitHub**
- [ ] 授权 Netlify 访问 GitHub

### □ 3.2 导入项目
- [ ] 点击 **Add new site** → **Import an existing project**
- [ ] 选择 **GitHub**
- [ ] 搜索并选择 **russian-learning** 仓库

### □ 3.3 配置构建
- [ ] 确认配置自动检测正确：
  - [ ] Branch: `main` 或 `master`
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `dist`
  - [ ] Functions directory: `netlify/functions`
- [ ] 点击 **Deploy** 按钮

### □ 3.4 等待部署
- [ ] 看到 "Site deploy in progress"
- [ ] 等待 2-3 分钟
- [ ] 看到 **Published** 状态
- [ ] 💾 **复制网站 URL：**（写在下面）
  ```
  我的网站地址：https://____________.netlify.app
  ```

---

## 第四步：配置环境变量（3 分钟）

### □ 4.1 进入设置
- [ ] 点击 **Site settings** 或 **Site configuration**
- [ ] 点击左侧 **Environment variables**

### □ 4.2 添加变量
- [ ] 点击 **Add a variable** → **Add a single variable**
- [ ] Key: 输入 `MONGODB_URI`（全大写）
- [ ] Value: 粘贴完整的 MongoDB 连接字符串
- [ ] Scopes: 勾选所有三项
  - [ ] Production
  - [ ] Deploy previews
  - [ ] Branch deploys
- [ ] 点击 **Create variable**
- [ ] 确认变量出现在列表中

### □ 4.3 重新部署
- [ ] 点击 **Deploys** 标签
- [ ] 点击 **Trigger deploy** → **Deploy site**
- [ ] 等待部署完成（约 2 分钟）
- [ ] 看到 **Published** 状态

---

## 第五步：初始化管理员（2 分钟）

### □ 5.1 打开网站
- [ ] 访问你的 Netlify 网站
- [ ] 页面加载正常

### □ 5.2 初始化
- [ ] 按 **F12** 打开开发者工具
- [ ] 切换到 **Console** 标签
- [ ] 粘贴并执行：
  ```javascript
  fetch('/api/init-admin', { method: 'POST' })
    .then(res => res.json())
    .then(data => console.log(data));
  ```
- [ ] 看到成功响应：`success: true`
- [ ] 记录管理员信息：
  ```
  用户名：admin
  密码：admin000
  ```

---

## 第六步：功能测试（5 分钟）

### □ 6.1 测试健康检查
- [ ] 访问 `https://你的域名.netlify.app/api/health`
- [ ] 看到 JSON 响应
- [ ] 确认 `success: true`
- [ ] 确认 `database: "已连接"`

### □ 6.2 测试数据库状态
- [ ] 访问 `https://你的域名.netlify.app/api/db-status`
- [ ] 看到 `connected: true`
- [ ] 看到 `users: 1`

### □ 6.3 测试管理员登录
- [ ] 回到网站首页
- [ ] 点击 **登录**
- [ ] 输入：
  - [ ] 用户名：`admin`
  - [ ] 密码：`admin000`
- [ ] 点击登录按钮
- [ ] 成功登录，看到用户界面

### □ 6.4 测试用户注册
- [ ] 退出管理员账号
- [ ] 点击 **申请账号**
- [ ] 填写测试信息：
  - [ ] 用户名：`testuser`
  - [ ] 密码：`test123456`
  - [ ] 其他信息随意
- [ ] 提交申请
- [ ] 看到"等待审批"提示
- [ ] 重新用管理员登录
- [ ] 进入用户管理页面
- [ ] 看到待审批申请
- [ ] 批准申请
- [ ] 退出，用新账号登录测试
- [ ] 新账号登录成功

---

## ✅ 全部完成检查

### □ 核心功能
- [ ] ✅ MongoDB 数据库已连接
- [ ] ✅ Netlify Functions 正常运行
- [ ] ✅ 管理员账号可以登录
- [ ] ✅ 用户注册审批流程正常
- [ ] ✅ 所有 API 接口正常

### □ 重要信息已保存
- [ ] ✅ MongoDB 连接字符串
- [ ] ✅ MongoDB 密码
- [ ] ✅ Netlify 网站地址
- [ ] ✅ 管理员账号信息

---

## 🔐 安全提醒

### □ 立即修改管理员密码！
- [ ] 用 admin 登录
- [ ] 进入设置页面
- [ ] 修改密码为强密码
- [ ] 💾 保存新密码

### □ 定期备份数据
- [ ] 每周备份 MongoDB 数据
- [ ] 导出用户列表
- [ ] 保存在安全位置

---

## 🆘 故障排查快速指南

### 问题：数据库连接失败
**检查项：**
- [ ] MongoDB Atlas 集群状态是否 Active
- [ ] 网络访问是否包含 0.0.0.0/0
- [ ] 连接字符串是否正确
- [ ] 密码是否正确（特殊字符需要编码）
- [ ] Netlify 环境变量 MONGODB_URI 是否设置
- [ ] 是否重新部署了

### 问题：Functions 调用失败
**检查项：**
- [ ] 访问 Netlify Functions 日志查看错误
- [ ] 环境变量是否配置正确
- [ ] 是否触发了重新部署
- [ ] 查看浏览器控制台错误

### 问题：登录失败
**检查项：**
- [ ] 是否已初始化管理员
- [ ] 用户名密码是否正确（admin/admin000）
- [ ] 访问 /api/db-status 确认有用户
- [ ] 查看浏览器网络请求响应

---

## 📞 需要帮助？

### 查阅详细文档
- [ ] `NETLIFY-手把手部署教程.md` - 详细操作步骤
- [ ] `NETLIFY-完整部署指南.md` - 完整教程
- [ ] `netlify/README.md` - 技术文档

### 查看日志
- [ ] Netlify Functions 日志
- [ ] MongoDB Atlas Metrics
- [ ] 浏览器开发者工具 Console

---

## 🎉 部署完成！

当所有复选框都打勾后，说明部署完全成功！

**接下来：**
- ✅ 修改管理员密码
- ✅ 自定义网站功能
- ✅ 邀请用户使用
- ✅ 定期备份数据

**恭喜你完成部署！** 🎊

---

**打印此清单，操作时逐项打勾！**

