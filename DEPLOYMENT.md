# 🚀 俄语学习网站部署指南

## 📋 部署前准备

您的项目已经构建完成，`dist` 文件夹包含了所有需要部署的文件。

## 🌐 推荐部署方案

### 方案一：Vercel（最推荐）

**优点：**
- ✅ 完全免费
- ✅ 自动部署
- ✅ 全球 CDN 加速
- ✅ 支持自定义域名
- ✅ 部署简单快速

**部署步骤：**

1. **注册 Vercel 账号**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "Sign Up" 注册账号

2. **上传项目**
   - 登录后点击 "New Project"
   - 选择 "Upload" 选项
   - 将整个项目文件夹拖拽上传

3. **配置部署设置**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **连接自定义域名**
   - 在项目设置中找到 "Domains"
   - 添加您购买的域名
   - 按照提示配置 DNS 记录

### 方案二：Netlify

**步骤：**
1. 访问 [netlify.com](https://netlify.com)
2. 注册账号
3. 选择 "New site from Git" 或 "Deploy manually"
4. 如果手动部署，直接拖拽 `dist` 文件夹
5. 配置自定义域名

### 方案三：GitHub Pages

**步骤：**
1. 将项目上传到 GitHub
2. 在仓库设置中启用 GitHub Pages
3. 选择 `gh-pages` 分支作为源
4. 配置自定义域名

## 🔧 DNS 配置

无论选择哪种部署方案，您都需要配置 DNS 记录：

### 常见 DNS 配置：
- **A 记录**: 指向部署平台的 IP 地址
- **CNAME 记录**: 指向部署平台的域名
- **TXT 记录**: 用于域名验证

### 各平台 DNS 配置：
- **Vercel**: 通常需要添加 A 记录或 CNAME 记录
- **Netlify**: 需要添加 CNAME 记录
- **GitHub Pages**: 需要添加 CNAME 记录

## 📱 测试部署

部署完成后，请测试以下功能：
- ✅ 首页正常加载
- ✅ 四个功能模块链接正常
- ✅ 响应式设计在不同设备上正常显示
- ✅ 图片和图标正常显示

## 🛠️ 故障排除

### 常见问题：
1. **构建失败**: 检查 Node.js 版本和依赖安装
2. **页面空白**: 检查路由配置和构建输出
3. **图片不显示**: 检查图片路径和文件是否存在
4. **域名无法访问**: 检查 DNS 配置和生效时间

### 获取帮助：
- 查看部署平台的官方文档
- 检查浏览器控制台错误信息
- 确认所有依赖都已正确安装

## 🎉 部署完成

部署成功后，您的俄语学习网站就可以通过您购买的域名访问了！

**下一步建议：**
- 添加网站图标 (favicon)
- 配置 SEO 元标签
- 添加 Google Analytics 统计
- 设置 HTTPS 证书（大多数平台自动提供） 