import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => (
  <div className="home-container">
    {/* 背景图片部分 */}
    <section className="background-image"></section>
    
    <main>
      {/* 四个主题板块 */}
      <section className="sections">
        <div className="section">
          <img src="/src/assets/icon-wordlist.png" alt="单词库" className="section-img" />
          <h3>单词库</h3>
          <p>按主题划分的词汇库和JLPT词汇库。</p>
          <Link to="/words" className="btn">进入</Link>
        </div>
        <div className="section">
          <img src="/src/assets/icon-listening.png" alt="真题精听" className="section-img" />
          <h3>真题精听</h3>
          <p>真题听力训练，提升听力水平。</p>
          <Link to="/listening" className="btn">开始练习</Link>
        </div>
        <div className="section">
          <img src="/src/assets/icon-download.png" alt="真题下载" className="section-img" />
          <h3>真题下载</h3>
          <p>历年真题下载，备考更轻松。</p>
          <Link to="/downloads" className="btn">下载真题</Link>
        </div>
        <div className="section">
          <img src="/src/assets/icon-frequency.png" alt="高频词下载" className="section-img" />
          <h3>高频词下载</h3>
          <p>获取最常见的高频词汇，提升学习效率。</p>
          <Link to="/downloads" className="btn">下载高频词</Link>
        </div>
      </section>
    </main>
  </div>
);

export default Home; 