import fs from 'fs';
import path from 'path';
import https from 'https';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 华为云 OBS 配置
const config = {
  accessKeyId: process.env.HUAWEI_ACCESS_KEY_ID || 'your-access-key-id',
  secretAccessKey: process.env.HUAWEI_SECRET_ACCESS_KEY || 'your-secret-access-key',
  server: process.env.HUAWEI_OBS_SERVER || 'obs.cn-north-4.myhuaweicloud.com',
  bucket: process.env.HUAWEI_OBS_BUCKET || 'your-bucket-name',
  region: process.env.HUAWEI_OBS_REGION || 'cn-north-4'
};

// 生成签名
function generateSignature(method, canonicalizedResource, headers, timestamp) {
  const stringToSign = method + '\n' +
    (headers['content-md5'] || '') + '\n' +
    (headers['content-type'] || '') + '\n' +
    timestamp + '\n' +
    Object.keys(headers)
      .filter(key => key.startsWith('x-obs-'))
      .sort()
      .map(key => key + ':' + headers[key])
      .join('\n') + '\n' +
    canonicalizedResource;

  const signature = crypto.createHmac('sha1', config.secretAccessKey)
    .update(stringToSign)
    .digest('base64');

  return signature;
}

// 上传文件到 OBS
function uploadFile(fileContent, objectKey, contentType) {
  return new Promise((resolve, reject) => {
    const contentMd5 = crypto.createHash('md5').update(fileContent).digest('base64');
    const timestamp = new Date().toUTCString();
    
    const headers = {
      'Content-Type': contentType,
      'Content-MD5': contentMd5,
      'Date': timestamp,
      'Host': config.bucket + '.' + config.server,
      'x-obs-website-redirect-location': '/index.html'
    };

    const canonicalizedResource = '/' + config.bucket + '/' + objectKey;
    const signature = generateSignature('PUT', canonicalizedResource, headers, timestamp);
    
    headers['Authorization'] = 'OBS ' + config.accessKeyId + ':' + signature;

    const options = {
      hostname: config.server,
      port: 443,
      path: '/' + objectKey,
      method: 'PUT',
      headers: headers
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✅ SPA路由配置成功: ${objectKey}`);
          resolve();
        } else {
          console.error(`❌ SPA路由配置失败: ${objectKey}`, res.statusCode, data);
          reject(new Error(`配置失败: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (err) => {
      console.error(`❌ 请求错误: ${objectKey}`, err.message);
      reject(err);
    });

    req.write(fileContent);
    req.end();
  });
}

// 创建SPA路由重定向文件
async function createSPARedirects() {
  console.log('🚀 开始配置华为云 OBS SPA路由...');
  
  const redirects = [
    '/words',
    '/listening', 
    '/downloads'
  ];

  // 为每个路由创建重定向
  for (const redirect of redirects) {
    try {
      // 创建重定向文件内容（空的HTML文件，但会被重定向）
      const emptyHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <meta http-equiv="refresh" content="0; url=/index.html">
</head>
<body>
  <script>
    window.location.href = '/index.html' + window.location.hash;
  </script>
</body>
</html>`;
      
      await uploadFile(
        Buffer.from(emptyHtml, 'utf8'),
        redirect,
        'text/html; charset=utf-8'
      );
      
      // 为子路径创建重定向
      await uploadFile(
        Buffer.from(emptyHtml, 'utf8'),
        redirect + '/',
        'text/html; charset=utf-8'
      );
      
    } catch (error) {
      console.error(`配置路由失败: ${redirect}`, error.message);
    }
  }
  
  console.log('🎉 SPA路由配置完成！');
  console.log('💡 提示：如果仍然有问题，请在华为云OBS控制台手动配置静态网站托管规则');
}

// 运行配置
createSPARedirects();
