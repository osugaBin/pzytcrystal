import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, Star, Gem, Zap } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: '八字运势分析',
      description: '基于传统八字命理，精准分析您的五行平衡和运势走向',
    },
    {
      icon: <Gem className="w-8 h-8" />,
      title: '智能水晶推荐',
      description: '结合AI智能分析，为您推荐最适合的水晶组合',
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: '个性化疗愈方案',
      description: '根据您的身体和心理状态，制定独特的水晶疗愈计划',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: '专业指导建议',
      description: '提供详细的佩带方法和生活建议，最大化疗愈效果',
    },
  ];

  const handleStartPrediction = () => {
    if (isAuthenticated) {
      navigate('/prediction');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: 'url(/images/mystical_purple_amethyst_healing_crystal_background.jpg)'
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Brand Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-purple-100 to-yellow-200">
                PZYT
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-purple-200 mt-2">
                水晶运势疗愈
              </p>
            </motion.div>

            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-xl md:text-2xl text-purple-100 mb-6 max-w-3xl mx-auto">
                探索心灵深处的能量，让水晶的神奇力量引导您走向更好的未来
              </h2>
              
              {isAuthenticated && user && (
                <div className="mb-6 p-4 bg-purple-800/30 rounded-lg border border-purple-600/30">
                  <p className="text-purple-200">
                    欢迎回来，{user.full_name || user.email}！
                  </p>
                  <p className="text-purple-300 text-sm">
                    您还有 {user.prediction_count} 次预测机会
                  </p>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartPrediction}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              >
                {isAuthenticated ? '开始预测' : '立即体验'}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              为什么选择PZYT？
            </h3>
            <p className="text-purple-200 text-lg max-w-2xl mx-auto">
              我们结合传统東方智慧与现代AI技术，为您提供最精准的水晶疗愈方案
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-purple-300 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h4 className="text-white font-semibold text-lg mb-2">
                  {feature.title}
                </h4>
                <p className="text-purple-200 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              开启您的水晶疗愈之旅
            </h3>
            <p className="text-purple-200 text-lg mb-8">
              立即获取个性化的八字分析和水晶推荐，让古老智慧指引现代生活
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartPrediction}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isAuthenticated ? '开始预测' : '免费注册'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/crystals')}
                className="px-8 py-3 bg-transparent border-2 border-purple-400 text-purple-200 font-semibold rounded-full hover:bg-purple-400 hover:text-white transition-all duration-300"
              >
                浏览水晶
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;