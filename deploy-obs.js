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

// 构建目录路径
const distPath = path.join(__dirname, 'dist');

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
function uploadFile(filePath, objectKey) {
  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(filePath);
    const contentMd5 = crypto.createHash('md5').update(fileContent).digest('base64');
    const timestamp = new Date().toUTCString();
    
    const headers = {
      'Content-Type': getContentType(filePath),
      'Content-MD5': contentMd5,
      'Date': timestamp,
      'Host': config.bucket + '.' + config.server
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
          console.log(`✅ 上传成功: ${objectKey}`);
          resolve();
        } else {
          console.error(`❌ 上传失败: ${objectKey}`, res.statusCode, data);
          reject(new Error(`上传失败: ${res.statusCode}`));
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

// 获取文件 MIME 类型
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// 递归上传目录
async function uploadDirectory(dirPath, prefix = '') {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await uploadDirectory(filePath, prefix + file + '/');
    } else {
      const objectKey = prefix + file;
      try {
        await uploadFile(filePath, objectKey);
      } catch (error) {
        console.error(`上传文件失败: ${objectKey}`, error.message);
      }
    }
  }
}

// 主函数
async function deploy() {
  console.log('🚀 开始部署到华为云 OBS...');
  console.log(`📦 桶名称: ${config.bucket}`);
  console.log(`🌍 区域: ${config.region}`);
  
  if (!fs.existsSync(distPath)) {
    console.error('❌ dist 目录不存在，请先运行 npm run build');
    process.exit(1);
  }

  try {
    await uploadDirectory(distPath);
    console.log('🎉 部署完成！');
    console.log(`🌐 您的网站地址: https://${config.bucket}.${config.server.replace('obs.', '')}`);
  } catch (error) {
    console.error('❌ 部署失败:', error.message);
    process.exit(1);
  }
}

// 运行部署
deploy(); 