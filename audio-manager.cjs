const fs = require('fs');
const path = require('path');

// 音频文件管理工具
class AudioManager {
  constructor() {
    this.audioDir = path.join(__dirname, 'public', 'audio');
    this.sourceDir = 'C:\\Users\\47015\\Desktop\\俄语单词音频';
  }

  // 复制音频文件
  async copyAudioFiles() {
    try {
      // 确保目标目录存在
      if (!fs.existsSync(this.audioDir)) {
        fs.mkdirSync(this.audioDir, { recursive: true });
      }

      // 扫描源目录中的所有音频文件
      const audioFiles = this.scanAudioFiles(this.sourceDir);
      
      console.log(`找到 ${audioFiles.length} 个音频文件`);
      
      // 复制文件
      for (const file of audioFiles) {
        const fileName = path.basename(file);
        const targetPath = path.join(this.audioDir, fileName);
        
        fs.copyFileSync(file, targetPath);
        console.log(`✅ 复制: ${fileName}`);
      }
      
      console.log('🎉 音频文件复制完成！');
      
    } catch (error) {
      console.error('❌ 复制音频文件失败:', error.message);
    }
  }

  // 扫描音频文件
  scanAudioFiles(dir) {
    const audioFiles = [];
    
    if (!fs.existsSync(dir)) {
      console.warn(`⚠️ 源目录不存在: ${dir}`);
      return audioFiles;
    }

    const scanDirectory = (currentDir) => {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else if (item.toLowerCase().endsWith('.mp3')) {
          audioFiles.push(fullPath);
        }
      }
    };

    scanDirectory(dir);
    return audioFiles;
  }

  // 生成音频文件映射
  generateAudioMapping() {
    const audioFiles = fs.readdirSync(this.audioDir)
      .filter(file => file.toLowerCase().endsWith('.mp3'))
      .sort((a, b) => {
        // 按文件名中的数字排序
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      });

    const mapping = {};
    audioFiles.forEach((file, index) => {
      const wordIndex = index + 1;
      mapping[wordIndex] = file;
    });

    return mapping;
  }

  // 显示音频文件统计
  showStats() {
    const audioFiles = fs.readdirSync(this.audioDir)
      .filter(file => file.toLowerCase().endsWith('.mp3'));
    
    console.log(`📊 音频文件统计:`);
    console.log(`- 总文件数: ${audioFiles.length}`);
    console.log(`- 文件大小: ${this.getTotalSize()} MB`);
    console.log(`- 文件列表:`);
    
    audioFiles.forEach((file, index) => {
      const filePath = path.join(this.audioDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      console.log(`  ${index + 1}. ${file} (${sizeKB} KB)`);
    });
  }

  // 计算总大小
  getTotalSize() {
    const audioFiles = fs.readdirSync(this.audioDir)
      .filter(file => file.toLowerCase().endsWith('.mp3'));
    
    let totalSize = 0;
    audioFiles.forEach(file => {
      const filePath = path.join(this.audioDir, file);
      const stats = fs.statSync(filePath);
      totalSize += stats.size;
    });
    
    return (totalSize / (1024 * 1024)).toFixed(2);
  }
}

// 使用示例
const audioManager = new AudioManager();

// 如果直接运行此脚本
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'copy':
      audioManager.copyAudioFiles();
      break;
    case 'stats':
      audioManager.showStats();
      break;
    case 'mapping':
      console.log(audioManager.generateAudioMapping());
      break;
    default:
      console.log('使用方法:');
      console.log('  node audio-manager.js copy   - 复制音频文件');
      console.log('  node audio-manager.js stats  - 显示统计信息');
      console.log('  node audio-manager.js mapping - 生成文件映射');
  }
}

module.exports = AudioManager; 