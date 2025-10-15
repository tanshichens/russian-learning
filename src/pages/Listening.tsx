import React, { useState, useRef } from 'react';

// 听力材料数据结构
interface ListeningMaterial {
  id: string;
  title: string;
  level: string;
  duration: string;
  description: string;
  audioUrl: string;
  transcript: string;
  translation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// 模拟听力材料数据
const listeningMaterials: ListeningMaterial[] = [
  {
    id: '1',
    title: '日常对话 - 购物',
    level: 'A1',
    duration: '2:30',
    description: '学习在商店购物的基本对话',
    audioUrl: '/audio/listening/shopping_dialogue.mp3',
    transcript: '— Здравствуйте! Что вы хотите купить?\n— Мне нужен хлеб и молоко.\n— Вот хлеб, а молоко в холодильнике.\n— Спасибо! Сколько это стоит?\n— Двадцать рублей.',
    translation: '— 您好！您想买什么？\n— 我需要面包和牛奶。\n— 这是面包，牛奶在冰箱里。\n— 谢谢！这要多少钱？\n— 二十卢布。',
    difficulty: 'easy'
  },
  {
    id: '2',
    title: '新闻播报 - 天气',
    level: 'A2',
    duration: '3:15',
    description: '天气预报新闻播报',
    audioUrl: '/audio/listening/weather_news.mp3',
    transcript: 'Сегодня в Москве ожидается переменная облачность. Температура воздуха составит от 15 до 20 градусов. Возможны кратковременные дожди во второй половине дня.',
    translation: '今天莫斯科预计有变化云量。气温将在15到20度之间。下午可能有短暂降雨。',
    difficulty: 'medium'
  },
  {
    id: '3',
    title: '学术讲座 - 俄罗斯历史',
    level: 'B1',
    duration: '5:45',
    description: '关于俄罗斯历史的学术讲座片段',
    audioUrl: '/audio/listening/history_lecture.mp3',
    transcript: 'Российская история богата событиями, которые повлияли на развитие не только нашей страны, но и всего мира. Особое место занимает период правления Петра Первого...',
    translation: '俄罗斯历史充满了不仅影响我们国家发展，也影响整个世界发展的事件。彼得大帝统治时期占据着特殊地位...',
    difficulty: 'hard'
  }
];

const Listening: React.FC = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<ListeningMaterial | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 播放/暂停音频
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // 音频时间更新
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // 音频加载完成
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // 音频结束
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // 格式化时间
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // 选择听力材料
  const selectMaterial = (material: ListeningMaterial) => {
    setSelectedMaterial(material);
    setShowTranscript(false);
    setShowTranslation(false);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // 获取难度颜色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#666';
    }
  };

  // 获取难度文本
  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return '未知';
    }
  };

  return (
    <div className="words-bg-wrap">
      {/* 顶部大背景和标题 */}
      <div className="words-hero">
        <div className="words-hero-content">
          <h1>跟着博主Vlog学口语听力</h1>
        </div>
      </div>

      {/* 分类卡片 */}
      <div className="words-card">
        <div className="listening-container">
          {/* 听力材料列表 */}
          <div className="listening-materials">
            <h2>听力材料</h2>
            <div className="materials-grid">
              {listeningMaterials.map((material) => (
                <div
                  key={material.id}
                  className={`material-card ${selectedMaterial?.id === material.id ? 'selected' : ''}`}
                  onClick={() => selectMaterial(material)}
                >
                  <div className="material-header">
                    <h3>{material.title}</h3>
                    <div className="material-badges">
                      <span className="level-badge">{material.level}</span>
                      <span 
                        className="difficulty-badge"
                        style={{ backgroundColor: getDifficultyColor(material.difficulty) }}
                      >
                        {getDifficultyText(material.difficulty)}
                      </span>
                    </div>
                  </div>
                  <p className="material-description">{material.description}</p>
                  <div className="material-meta">
                    <span className="duration">⏱️ {material.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 播放器区域 */}
          {selectedMaterial && (
            <div className="listening-player">
              <div className="player-header">
                <h3>{selectedMaterial.title}</h3>
                <div className="player-badges">
                  <span className="level-badge">{selectedMaterial.level}</span>
                  <span 
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(selectedMaterial.difficulty) }}
                  >
                    {getDifficultyText(selectedMaterial.difficulty)}
                  </span>
                </div>
              </div>

              {/* 音频播放器 */}
              <div className="audio-player">
                <audio
                  ref={audioRef}
                  src={selectedMaterial.audioUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={handleEnded}
                />
                
                <div className="player-controls">
                  <button 
                    className="play-button"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? '⏸️' : '▶️'}
                  </button>
                  
                  <div className="progress-container">
                    <div className="time-display">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 控制按钮 */}
              <div className="player-actions">
                <button 
                  className={`action-button ${showTranscript ? 'active' : ''}`}
                  onClick={() => setShowTranscript(!showTranscript)}
                >
                  📝 显示文本
                </button>
                <button 
                  className={`action-button ${showTranslation ? 'active' : ''}`}
                  onClick={() => setShowTranslation(!showTranslation)}
                >
                  🌐 显示翻译
                </button>
                <button className="action-button">
                  💾 下载音频
                </button>
              </div>

              {/* 文本显示区域 */}
              {(showTranscript || showTranslation) && (
                <div className="text-display">
                  {showTranscript && (
                    <div className="transcript-section">
                      <h4>原文</h4>
                      <div className="text-content">
                        {selectedMaterial.transcript.split('\n').map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {showTranslation && (
                    <div className="translation-section">
                      <h4>翻译</h4>
                      <div className="text-content">
                        {selectedMaterial.translation.split('\n').map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
);
};

export default Listening; 