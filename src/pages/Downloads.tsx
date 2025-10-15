import React from 'react';

const Downloads: React.FC = () => {
  return (
    <div className="words-bg-wrap">
      {/* 顶部大背景和标题 */}
      <div className="downloads-hero">
        <div className="words-hero-content">
          <h1>A1-C2高频词下载</h1>
        </div>
      </div>

      {/* 分类卡片 */}
      <div className="words-card">
        {/* 扩展学习资源区域 */}
        <div className="learning-resources" style={{ marginTop: '-50px' }}>
          <div className="resource-card" style={{ marginTop: '-100px' }}>
            <div className="resource-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
            </div>
            
            <div className="resource-content">
              <h3>俄语学习资料库</h3>
              <p>访问我们的在线学习资料库，获取更多俄语学习资源、练习材料和学习指南</p>
              
              <div className="resource-features">
                <span className="feature-tag">📖 学习资料</span>
                <span className="feature-tag">🎯 练习题库</span>
                <span className="feature-tag">📝 学习指南</span>
                <span className="feature-tag">💡 学习技巧</span>
              </div>
            </div>
            
            <div className="resource-action">
              <a 
                href="https://pan.baidu.com/s/1pPK05YN24OIC25ZTkXgnmA?pwd=1234" 
                target="_blank" 
                rel="noopener noreferrer"
                className="resource-link"
              >
                <span>立即访问</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7"></path>
                  <path d="M7 7h10v10"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Downloads; 