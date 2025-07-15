import React, { useState } from 'react';
import wordsDataRaw from '../data/words.json';

// 修正类型声明，支持动态主题和场景
type Word = { word: string; chinese: string; example: string; pos?: string; collocations?: string; collocations_cn?: string; example_cn?: string };
type WordsData = {
  [theme: string]: {
    [scene: string]: Word[];
  };
};
const wordsData: WordsData = wordsDataRaw as any;

const themes = [
  { name: '咖啡馆篇', count: 62 },
  { name: '商场购物', count: 75 },
  { name: '交通出行', count: 92 },
  { name: '餐厅饮食', count: 50 },
  { name: '天气季节', count: 63 },
  { name: '身体生病', count: 66 },
  { name: '食物食材', count: 69 },
  { name: '化妆护肤', count: 56 },
  { name: '办公职场', count: 65 },
  { name: '情绪心情', count: 57 },
  { name: '旅游观光', count: 52 },
  { name: '家庭生活', count: 57 },
  { name: '银行金融', count: 57 },
  { name: '租房搬家', count: 53 },
  { name: '网络社交', count: 52 },
  { name: '文化假期', count: 50 },
  { name: '健身房篇', count: 54 },
  { name: '便利店篇', count: 28 },
  { name: '洗衣店篇', count: 60 },
  { name: '外卖快递', count: 57 },
  { name: '家电维修', count: 62 },
  { name: '俄语四级', count: 66 },
  { name: '更多主题持续更新中', count: 1 },
];

const themeScenes: Record<string, string[]> = {
  '咖啡馆篇': ['点单', '结账', '饮品', '甜点', '服务', '座位', '交流'],
  '商场购物': ['服装', '电子产品', '付款', '试衣', '退换货', '导购'],
  '交通出行': ['公交', '地铁', '打车', '购票', '问路', '站台', '时间'],
  '餐厅饮食': ['点菜', '饮料', '结账', '预订', '服务', '投诉'],
  '天气季节': ['晴天', '雨天', '雪天', '温度', '季节', '穿衣建议'],
  '身体生病': ['症状', '挂号', '药品', '看病', '急救', '保险'],
  '食物食材': ['蔬菜', '水果', '肉类', '调料', '主食', '饮品'],
  '化妆护肤': ['护肤', '彩妆', '卸妆', '购买', '咨询', '试用'],
  '办公职场': ['会议', '邮件', '请假', '加班', '升职', '同事'],
  '情绪心情': ['开心', '难过', '生气', '紧张', '放松', '激动'],
  '旅游观光': ['景点', '门票', '导游', '住宿', '交通', '纪念品'],
  '家庭生活': ['家务', '亲子', '聚会', '购物', '装修', '邻里'],
  '银行金融': ['存款', '取款', '转账', '开户', '理财', '贷款'],
  '租房搬家': ['看房', '签约', '搬家', '租金', '押金', '维修'],
  '网络社交': ['聊天', '发帖', '点赞', '评论', '加好友', '分享'],
  '文化假期': ['节日', '习俗', '活动', '聚会', '礼物', '祝福'],
  '健身房篇': ['器械', '课程', '教练', '会员', '锻炼', '饮食'],
  '便利店篇': ['购物', '付款', '饮料', '零食', '服务', '营业时间'],
  '洗衣店篇': ['洗衣', '干洗', '取衣', '送衣', '价格', '服务'],
  '外卖快递': ['下单', '配送', '取件', '投诉', '评价', '支付'],
  '家电维修': ['报修', '预约', '上门', '配件', '费用', '保修'],
  '俄语四级': ['词汇', '语法', '阅读', '听力', '写作', '翻译'],
  '更多主题持续更新中': ['其它'],
};

const modes = ['全部', '未标注', '认识', '不认识', '模糊'];
const studyModes = ['默认', '乱一', '乱二', '学习模式', '列表模式'];

export default function Words() {
  const [theme, setTheme] = useState(themes[0].name);
  // 移除场景筛选
  const [mode, setMode] = useState('全部');
  const [studyMode, setStudyMode] = useState('默认');

  // 当前主题下的全部单词（合并所有场景）
  let words: Word[] =
    wordsData[theme]
      ? ([] as Word[]).concat(...Object.values(wordsData[theme]))
      : [];
  // 去掉前三个单词（菜单、服务员、账单）
  words = words.slice(3);

  return (
    <div className="words-bg-wrap">
      {/* 顶部大背景和标题 */}
      <div className="words-hero">
        <div className="words-hero-content">
          <h1>俄语单词库</h1>
        </div>
      </div>
      {/* 分类卡片 */}
      <div className="words-card">
        <div className="words-row">
          <span className="words-label">主题：</span>
          <div className="words-theme-list">
            {themes.map(t => (
              <button
                key={t.name}
                className={theme === t.name ? 'words-theme-btn active' : 'words-theme-btn'}
                onClick={() => { setTheme(t.name); }}
              >
                {t.name} <span style={{color:'#bbb',fontSize:'0.95em'}}>({t.count})</span>
              </button>
            ))}
          </div>
        </div>
        <div className="words-row words-mode-row">
          <div className="words-mode-list">
            {modes.map(m => (
              <button
                key={m}
                className={mode === m ? 'words-mode-btn active' : 'words-mode-btn'}
                onClick={() => setMode(m)}
              >{m}</button>
            ))}
          </div>
          <div className="words-study-mode-list">
            {studyModes.map(sm => (
              <button
                key={sm}
                className={studyMode === sm ? 'words-study-btn active' : 'words-study-btn'}
                onClick={() => setStudyMode(sm)}
              >{sm}</button>
            ))}
            <button className="words-func-btn">听写</button>
            <button className="words-func-btn">🔊</button>
            <button className="words-func-btn">👁️</button>
          </div>
        </div>
      </div>
      {/* 单词列表展示区 */}
      <div className="words-list-area">
        {words.length === 0 ? (
          <div className="words-empty">
            <div className="words-empty-img"></div>
            <div style={{color:'#bbb',fontSize:'1.1rem',marginTop:'1rem'}}>暂无单词，敬请期待</div>
          </div>
        ) : (
          <div className="words-list">
            {words.map((w, idx) => (
              <div className="word-item" key={w.word + idx}>
                <button
                  className="word-audio-btn"
                  title="播放发音"
                  onClick={e => {
                    e.stopPropagation();
                    const audio = new Audio(`/static/audio/${w.word.toLowerCase()}.mp3`);
                    audio.play();
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 9.5V12.5H7.5L12 17V5L7.5 9.5H4Z" fill="#7b8cff"/>
                    <path d="M14.5 7C15.3284 7.82843 15.8284 9.17157 15.8284 10.5C15.8284 11.8284 15.3284 13.1716 14.5 14" stroke="#7b8cff" stroke-width="1.3" stroke-linecap="round"/>
                    <path d="M16.5 5C17.8807 6.38071 18.8284 8.38071 18.8284 10.5C18.8284 12.6193 17.8807 14.6193 16.5 16" stroke="#7b8cff" stroke-width="1.3" stroke-linecap="round"/>
                    <path d="M18.5 3C20.432 4.932 21.8284 7.88071 21.8284 10.5C21.8284 13.1193 20.432 16.068 18.5 18" stroke="#7b8cff" stroke-width="1.3" stroke-linecap="round"/>
                  </svg>
                </button>
                <div className="word-main">
                  <span className="word-ru big">{w.word}</span>
                </div>
                <div className="word-zh-pos">
                  <span className="word-zh">{w.chinese}</span>
                  {w.pos && <span className="word-pos">{w.pos}</span>}
                </div>
                {w.collocations_cn && <div className="word-collocations-cn">常见搭配：{w.collocations_cn}</div>}
                {w.collocations && <div className="word-collocations">{w.collocations}</div>}
                <div className="word-example">例句：{w.example}</div>
                {w.example_cn && <div className="word-example-cn">{w.example_cn}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 