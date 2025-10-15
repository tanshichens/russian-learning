import React from 'react';
import { Link } from 'react-router-dom';
// 引入SVG图标
import BookIcon from '../assets/icon-book.svg';
import DownloadIcon from '../assets/icon-download.svg';

const Home: React.FC = () => (
  <div className="home-container">
    {/* 背景图片部分 */}
    <section className="background-image"></section>
    
    <main>
      {/* 两个主题板块 */}
      <section className="sections">
        <div className="section">
          <img src={BookIcon} alt="单词库" className="section-img" />
          <h3>单词库</h3>
          <p>按A1-C2主题划分的高频词汇库。</p>
          <Link to="/words" className="btn">进入</Link>
        </div>
        <div className="section">
          <img src={DownloadIcon} alt="A1-C2高频词下载" className="section-img" />
          <h3>A1-C2高频词下载</h3>
          <p>已为打印设置好格式 下载即可学习</p>
          <Link to="/downloads" className="btn">下载高频词</Link>
        </div>
      </section>
    </main>
  </div>
);

export default Home; 