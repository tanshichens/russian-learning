# 🚂 Railway 部署指南 - 5分钟完成

## ✨ 为什么选择Railway

- ✅ **5分钟部署** - 最快最简单
- ✅ **免费$5/月** - 足够使用
- ✅ **自动HTTPS** - 安全加密
- ✅ **全球访问** - 世界任何地方都能用
- ✅ **零配置** - 自动检测并部署
- ✅ **内置数据库** - PostgreSQL免费

## 📋 部署前准备

### 1. 创建GitHub账号（如果没有）
访问：https://github.com/signup

### 2. 创建Railway账号
访问：https://railway.app
点击"Start a New Project"
用GitHub登录

## 🚀 部署步骤（5分钟）

### 第1步：推送代码到GitHub（2分钟）

打开项目根目录的终端：

```bash
# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "准备部署到Railway"

# 在GitHub创建新仓库
# 访问 https://github.com/new
# 仓库名：russian-learning
# 设为Private（私有）
# 不要勾选任何初始化选项
# 创建仓库

# 添加远程仓库（替换成你的用户名）
git remote add origin https://github.com/你的用户名/russian-learning.git

# 推送代码
git branch -M main
git push -u origin main
```

### 第2步：部署后端API（2分钟）

#### 2.1 在Railway创建新项目

1. 访问 https://railway.app/new
2. 点击 "Deploy from GitHub repo"
3. 授权Railway访问你的GitHub
4. 选择 `russian-learning` 仓库
5. 点击 "Deploy Now"

#### 2.2 配置后端服务

Railway会自动检测到这是一个Node.js项目。

**配置Root Directory（重要！）**：
1. 点击你的服务
2. 进入 "Settings"
3. 找到 "Root Directory"
4. 输入：`backend`
5. 保存

**配置环境变量**：
1. 进入 "Variables" 标签
2. 添加以下变量：
   ```
   NODE_ENV=production
   PORT=3001
   ```

#### 2.3 部署并获取域名

1. Railway自动开始部署
2. 等待1-2分钟
3. 点击 "Settings" → "Generate Domain"
4. 会得到类似：`russian-learning-api.up.railway.app`
5. **记下这个地址！**

### 第3步：部署前端（1分钟）

#### 3.1 在同一项目添加前端服务

1. 在项目主页点击 "+ New"
2. 选择 "GitHub Repo"
3. 选择同一个 `russian-learning` 仓库
4. 这次不配置Root Directory（使用根目录）

#### 3.2 配置前端环境变量

1. 进入前端服务的 "Variables"
2. 添加：
   ```
   VITE_API_URL=https://你的后端域名.up.railway.app/api
   ```
   （把"你的后端域名"替换成第2步获得的域名）

#### 3.3 配置构建命令

1. 进入 "Settings"
2. 找到 "Build Command"
3. 输入：`npm install && npm run build`
4. 找到 "Start Command"  
5. 输入：`npx serve dist -s -p $PORT`
6. 保存

#### 3.4 获取前端域名

1. 点击 "Settings" → "Generate Domain"
2. 会得到类似：`russian-learning.up.railway.app`
3. **这就是你的网站地址！**

### 第4步：测试部署（1分钟）

1. 访问你的前端域名：`https://russian-learning.up.railway.app`
2. 点击"申请账号"
3. 填写测试信息并提交
4. 用admin登录
5. 查看用户管理
6. 应该能看到刚才的申请！✅

## 🎉 部署完成！

现在你有了：
- ✅ 全球可访问的网站：`https://你的项目.up.railway.app`
- ✅ 后端API：`https://你的项目-api.up.railway.app`
- ✅ 24小时在线
- ✅ 自动HTTPS加密
- ✅ 任何人都能申请账号
- ✅ 你在任何设备都能管理

## 📱 使用方式

### 用户访问
```
https://russian-learning.up.railway.app
```

### 分享给用户
把网址发给你的学生，他们就能：
1. 访问网站
2. 申请账号
3. 等待你审批
4. 登录使用

### 你的管理
在任何设备（手机、电脑、平板）：
1. 访问网站
2. 用admin登录
3. 查看申请
4. 审批用户
5. 管理系统

## 🔧 高级配置（可选）

### 配置自定义域名

如果你有自己的域名（如 `study.yourdomain.com`）：

1. 在Railway项目的Settings中
2. 点击 "Custom Domain"
3. 输入你的域名
4. 在你的域名DNS设置中添加CNAME记录
5. 等待生效（几分钟到几小时）

### 添加PostgreSQL数据库

当数据量增大时，可以升级到PostgreSQL：

1. 在Railway项目点击 "+ New"
2. 选择 "Database" → "PostgreSQL"
3. 会自动创建数据库
4. 获取连接字符串
5. 修改后端代码使用PostgreSQL
6. 重新部署

## 💰 费用说明

Railway免费套餐：
- **$5免费额度/月**
- **500小时运行时间**
- **100GB流量**

**够用吗？**
- ✅ 小型项目（<100用户）：完全够用
- ✅ 中型项目（<500用户）：可能需要升级
- ✅ 大型项目：需要付费套餐

**如何省钱**：
- 数据存储用JSON文件（当前方案）
- 减少API调用
- 优化图片资源

## 🔄 更新网站

当你修改代码后：

```bash
# 1. 提交更改
git add .
git commit -m "更新说明"

# 2. 推送到GitHub
git push

# 3. Railway自动重新部署！
# 无需其他操作，1-2分钟后更新生效
```

## 📊 监控和日志

### 查看部署日志
1. 在Railway项目中点击服务
2. 进入 "Deployments"
3. 点击最新的部署
4. 查看构建和运行日志

### 查看运行状态
1. 进入 "Metrics"
2. 查看CPU、内存、网络使用情况

### 查看用量
1. 进入项目 "Usage"
2. 查看本月已使用的额度

## ⚠️ 常见问题

### Q: 部署失败怎么办？
A: 
1. 检查 "Deployments" 中的错误日志
2. 确认 Root Directory 设置正确
3. 确认 package.json 中有正确的scripts
4. 查看环境变量是否配置

### Q: 网站能访问但API不通？
A:
1. 检查后端服务是否运行
2. 访问 `https://后端域名.up.railway.app/api/health`
3. 检查前端的 VITE_API_URL 环境变量
4. 确认后端的CORS配置正确

### Q: 数据会丢失吗？
A:
- **当前方案**：使用JSON文件，重启会保留
- **建议**：数据重要时升级到PostgreSQL数据库

### Q: 超出免费额度怎么办？
A:
1. 查看Usage了解使用情况
2. 优化代码减少资源消耗
3. 升级到付费套餐（$5/月起）

### Q: 如何备份数据？
A:
1. Railway会自动备份
2. 也可以定期导出数据
3. 升级到数据库后自动备份

## 🎯 部署检查清单

部署前确认：
- [ ] 代码已推送到GitHub
- [ ] .gitignore包含敏感文件
- [ ] package.json有正确的scripts
- [ ] 环境变量已配置

部署后测试：
- [ ] 前端网站能访问
- [ ] 后端API能访问（/api/health）
- [ ] 能注册新用户
- [ ] 管理员能登录
- [ ] 能审批用户
- [ ] 审批后用户能登录

## 📞 需要帮助？

如果遇到问题：
1. 查看Railway的日志
2. 检查本指南的常见问题
3. 访问Railway文档：https://docs.railway.app
4. 告诉我具体错误信息

## 🎊 恭喜！

你的俄语学习网站现在：
- ✅ 全球可访问
- ✅ 24小时在线
- ✅ 自动备份
- ✅ 安全加密
- ✅ 免费使用

用户可以在世界任何地方访问和注册，你也可以在任何设备上管理！

**网站地址**：`https://你的项目.up.railway.app`

分享给你的学生，开始使用吧！🎉

