import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star, Heart, Briefcase, DollarSign, Sparkles, Gem } from 'lucide-react';

const PredictionResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { prediction, remaining_predictions } = location.state || {};

  if (!prediction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <p className="text-xl mb-4">未找到预测结果</p>
          <button
            onClick={() => navigate('/prediction')}
            className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            重新预测
          </button>
        </div>
      </div>
    );
  }

  const { bazi_result, fortune_analysis, crystal_recommendations, silicon_flow_analysis } = prediction;

  const getFortuneIcon = (type) => {
    switch (type) {
      case 'career': return <Briefcase className="w-5 h-5" />;
      case 'wealth': return <DollarSign className="w-5 h-5" />;
      case 'health': return <Heart className="w-5 h-5" />;
      case 'relationship': return <Star className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getFortuneColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getFortuneBarColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const fortuneLabels = {
    career: '事业运',
    wealth: '财运',
    health: '健康运',
    relationship: '感情运',
    overall: '综合运势'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 pt-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            您的八字运势报告
          </h1>
          <p className="text-purple-200">
            剩余预测次数：{remaining_predictions}
          </p>
        </motion.div>

        {/* 八字分析 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-yellow-400" />
            八字命盘
          </h2>
          
          {bazi_result.bazi && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Object.entries(bazi_result.bazi).map(([key, pillar]) => (
                <div key={key} className="bg-purple-800/30 rounded-lg p-4 border border-purple-600/30">
                  <h4 className="text-purple-200 text-sm mb-2">
                    {key === 'year' ? '年柱' : key === 'month' ? '月柱' : key === 'day' ? '日柱' : '时柱'}
                  </h4>
                  <div className="text-white font-bold text-lg">
                    {pillar.heavenly}{pillar.earthly}
                  </div>
                  <div className="text-purple-300 text-sm">
                    {pillar.element}
                  </div>
                  {pillar.zodiac && (
                    <div className="text-purple-400 text-xs">
                      {pillar.zodiac}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {bazi_result.elementAnalysis && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">五行分析</h3>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {Object.entries(bazi_result.elementAnalysis.elementCount).map(([element, count]) => (
                  <div key={element} className="text-center">
                    <div className="bg-purple-700/50 rounded-lg p-2">
                      <div className="text-white font-bold">{element}</div>
                      <div className="text-purple-300">{count}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-purple-200 text-sm">
                五行平衡度：{bazi_result.elementAnalysis.balance}%
              </p>
            </div>
          )}
        </motion.div>

        {/* 运势分析 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Star className="w-6 h-6 mr-2 text-yellow-400" />
            运势分析
          </h2>
          
          {fortune_analysis.fortune && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(fortuneLabels).map(([key, label]) => {
                const score = fortune_analysis.fortune[key];
                if (score === undefined) return null;
                
                return (
                  <div key={key} className="bg-purple-800/30 rounded-lg p-4 border border-purple-600/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {getFortuneIcon(key)}
                        <span className="text-white font-medium ml-2">{label}</span>
                      </div>
                      <span className={`font-bold ${getFortuneColor(score)}`}>
                        {score}分
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getFortuneBarColor(score)} transition-all duration-500`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* AI分析 */}
        {silicon_flow_analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl mb-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-blue-400" />
              AI智能分析
            </h2>
            
            {silicon_flow_analysis.mainIssues && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">主要问题</h3>
                <p className="text-purple-200">{silicon_flow_analysis.mainIssues}</p>
              </div>
            )}
            
            {silicon_flow_analysis.expectedEffects && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">预期效果</h3>
                <p className="text-purple-200">{silicon_flow_analysis.expectedEffects}</p>
              </div>
            )}
            
            {silicon_flow_analysis.additionalAdvice && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">额外建议</h3>
                <p className="text-purple-200">{silicon_flow_analysis.additionalAdvice}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* 水晶推荐 */}
        {crystal_recommendations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl mb-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Gem className="w-6 h-6 mr-2 text-purple-400" />
              水晶推荐
            </h2>
            
            {crystal_recommendations.reasoning && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">推荐理由</h3>
                <p className="text-purple-200 whitespace-pre-line">{crystal_recommendations.reasoning}</p>
              </div>
            )}
            
            {crystal_recommendations.primary_crystals && crystal_recommendations.primary_crystals.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">主要推荐</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {crystal_recommendations.primary_crystals.map((crystal, index) => (
                    <div key={index} className="bg-purple-800/30 rounded-lg p-4 border border-purple-600/30">
                      {crystal.image_url && (
                        <img
                          src={crystal.image_url}
                          alt={crystal.chinese_name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}
                      <h4 className="text-white font-semibold mb-1">{crystal.chinese_name}</h4>
                      <p className="text-purple-300 text-sm mb-2">{crystal.name}</p>
                      {crystal.reason && (
                        <p className="text-purple-200 text-xs">{crystal.reason}</p>
                      )}
                      {crystal.price && (
                        <p className="text-yellow-400 font-semibold mt-2">￥{crystal.price}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {crystal_recommendations.wearing_guide && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">佩带指南</h3>
                <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600/30">
                  <div className="space-y-2 text-sm">
                    <p className="text-blue-200">
                      <strong>日常佩带：</strong>{crystal_recommendations.wearing_guide.daily_routine}
                    </p>
                    <p className="text-blue-200">
                      <strong>佩带时间：</strong>{crystal_recommendations.wearing_guide.wearing_time}
                    </p>
                    <p className="text-blue-200">
                      <strong>保养方法：</strong>{crystal_recommendations.wearing_guide.care_instructions}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* 操作按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 pb-8"
        >
          <button
            onClick={() => navigate('/prediction')}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            再次预测
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-3 bg-transparent border-2 border-purple-400 text-purple-200 font-semibold rounded-lg hover:bg-purple-400 hover:text-white transition-all duration-300"
          >
            查看历史
          </button>
          {remaining_predictions <= 0 && (
            <button
              onClick={() => navigate('/payment')}
              className="flex-1 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              购买更多
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PredictionResultPage;