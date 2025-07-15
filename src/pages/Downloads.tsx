import React from 'react';

const examLevels = [
  { level: 'A1', name: 'A1真题' },
  { level: 'A2', name: 'A2真题' },
  { level: 'B1', name: 'B1真题' },
  { level: 'B2', name: 'B2真题' },
  { level: 'C1', name: 'C1真题' },
  { level: 'C2', name: 'C2真题' },
];

const Downloads: React.FC = () => {
  const handleDownload = (level: string) => {
    // 这里可以添加实际的下载逻辑
    console.log(`下载${level}真题`);
    alert(`${level}真题下载功能开发中...`);
  };

  return (
    <div className="downloads-bg-wrap">
      {/* 顶部大背景和标题 */}
      <div className="downloads-hero">
        <div className="downloads-hero-content">
          <h1>真题下载</h1>
        </div>
      </div>
      
      {/* 真题卡片区域 */}
      <div className="downloads-card">
        <div className="downloads-grid">
          {examLevels.map(exam => (
            <div key={exam.level} className="download-item">
              <h3>{exam.name}</h3>
              <button 
                className="download-btn"
                onClick={() => handleDownload(exam.level)}
              >
                下载
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Downloads; 