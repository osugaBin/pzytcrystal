import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const HomePage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleStartPrediction = () => {
    navigate('/predict');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* 英雄区域 */}
        <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* 品牌标识 */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 mb-4 tracking-wider">
              PZYT
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-yellow-400 mx-auto mb-6"></div>
            <h2 className="text-2xl md:text-4xl font-semibold text-white mb-4">
              水晶运势疗愈
            </h2>
            <p className="text-lg md:text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
              融合古老八字智慧与现代水晶疗愈，为您解读命运密码，开启人生新篇章
            </p>
          </div>

          {/* 核心服务介绍 */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 mt-16">
            <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📜</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">八字运势分析</h3>
                <p className="text-purple-200 leading-relaxed">
                  基于传统命理学，精准分析您的生辰八字，解读五行平衡与命运走向
                </p>
              </div>
            </div>

            <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">智能水晶推荐</h3>
                <p className="text-purple-200 leading-relaxed">
                  AI智能分析您的五行缺失，精准匹配最适合的水晶组合，助您调和能量
                </p>
              </div>
            </div>

            <div className={`transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🌟</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">个性化疗愈方案</h3>
                <p className="text-purple-200 leading-relaxed">
                  结合运势分析与水晶能量，为您定制专属的疗愈建议和人生指导
                </p>
              </div>
            </div>
          </div>

          {/* 行动号召区域 */}
          <div className={`transform transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/20 max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                开启您的专属运势之旅
              </h3>
              <p className="text-xl text-purple-200 mb-8 leading-relaxed">
                输入您的生辰信息，让古老智慧与现代科技为您揭示命运奥秘
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <div className="flex items-center text-green-400">
                  <span className="mr-2">✨</span>
                  <span>首次预测免费体验</span>
                </div>
                <div className="flex items-center text-yellow-400">
                  <span className="mr-2">🎯</span>
                  <span>AI智能精准分析</span>
                </div>
                <div className="flex items-center text-purple-300">
                  <span className="mr-2">💎</span>
                  <span>专属水晶推荐</span>
                </div>
              </div>

              <button
                onClick={handleStartPrediction}
                className="group relative inline-flex items-center justify-center px-12 py-4 text-xl font-semibold text-white transition-all duration-300 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 transform"
              >
                <span className="mr-3">开始预测运势</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                
                {/* 按钮光效 */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <p className="text-sm text-purple-300 mt-6">
                后续预测：支付5元获得2次预测机会
              </p>
            </div>
          </div>

          {/* 底部装饰 */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center space-x-4 text-purple-300">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-purple-400"></div>
              <span className="text-sm font-medium">PZYT • 专业运势分析</span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-purple-400"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部波浪装饰 */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-32 text-purple-900/50" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
        </svg>
      </div>
    </div>
  );
};

export default HomePage;