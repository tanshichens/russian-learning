# SPA路由刷新问题解决方案

## 问题描述
在单页应用(SPA)中，当用户在非根路径（如 `/words`、`/listening`、`/downloads`）刷新页面时，会出现"页面已丢失"的错误。这是因为服务器尝试寻找对应的物理文件，但这些路径只存在于客户端路由中。

## 解决方案

### 1. Netlify部署
已配置以下文件确保SPA路由正常工作：

#### `netlify.toml`
```toml
# SPA路由重定向 - 确保所有路由都指向index.html
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### `public/_redirects`
```
/*    /index.html   200
```

### 2. 华为云OBS部署
已配置以下文件确保SPA路由正常工作：

#### 自动重定向文件
在`public/`目录下创建了以下重定向文件：
- `words.html` - 重定向到 `/index.html`
- `listening.html` - 重定向到 `/index.html`  
- `downloads.html` - 重定向到 `/index.html`

#### 部署脚本增强
`deploy-obs.js` 已更新，会自动创建SPA重定向文件。

## 使用方法

### Netlify部署
```bash
npm run build
# 然后将dist文件夹部署到Netlify
```

### 华为云OBS部署
```bash
# 使用增强的部署脚本（推荐）
npm run deploy:obs-spa

# 或使用原有脚本
npm run deploy:obs
```

## 工作原理

1. **Netlify**: 使用`_redirects`文件和`netlify.toml`配置，将所有非静态资源的请求重定向到`index.html`
2. **华为云OBS**: 为每个SPA路由创建对应的HTML文件，这些文件会自动重定向到主应用
3. **React Router**: 在客户端接管路由，显示正确的页面内容

## 测试方法

1. 部署应用后，访问以下URL：
   - `https://your-domain.com/words`
   - `https://your-domain.com/listening`
   - `https://your-domain.com/downloads`

2. 在每个页面按F5刷新，应该能正常显示当前页面而不是"页面已丢失"错误

## 注意事项

- 确保服务器支持HTML5 History API
- 静态资源（CSS、JS、图片等）应该正常加载
- 如果仍有问题，检查服务器配置是否正确应用了重定向规则

## 故障排除

如果刷新后仍然出现404错误：

1. **Netlify**: 检查`netlify.toml`和`_redirects`文件是否正确部署
2. **华为云OBS**: 确保重定向HTML文件已正确上传
3. **其他服务器**: 需要手动配置服务器重定向规则，将所有非静态资源请求重定向到`index.html`
