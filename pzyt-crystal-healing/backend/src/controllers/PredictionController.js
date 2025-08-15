const BaziService = require('../services/BaziService');
const SiliconFlowService = require('../services/SiliconFlowService');
const CrystalRecommendationService = require('../services/CrystalRecommendationService');
const Prediction = require('../models/Prediction');
const User = require('../models/User');

class PredictionController {
  // 创建预测
  async createPrediction(req, res) {
    try {
      const { birth_date, birth_time, birth_location } = req.body;
      const userId = req.user.user_id;
      
      // 验证输入
      if (!birth_date || !birth_time || !birth_location) {
        return res.status(400).json({ error: '请提供完整的出生信息' });
      }
      
      // 检查用户预测次数
      const user = await User.findById(userId);
      if (!user || user.prediction_count <= 0) {
        return res.status(402).json({ 
          error: '预测次数不足',
          need_payment: true,
          message: '您的预测次数已用完，请购买更多次数' 
        });
      }
      
      // 执行八字计算
      const baziResult = BaziService.calculateBazi(birth_date, birth_time, birth_location);
      
      // 调用SiliconFlow API进行智能分析
      let siliconFlowAnalysis;
      try {
        siliconFlowAnalysis = await SiliconFlowService.analyzeBaziForCrystalRecommendation(baziResult, {
          user_id: userId,
          full_name: user.full_name
        });
      } catch (error) {
        console.error('SiliconFlow分析失败:', error.message);
        // 如果AI分析失败，使用默认分析
        siliconFlowAnalysis = {
          mainIssues: '由于服务繁忙，此次使用基础分析功能',
          crystalRecommendations: [],
          wearingAdvice: '请根据下方推荐结果选择适合的水晶',
          expectedEffects: '通过佩带适合的水晶，可以帮助平衡五行能量',
          additionalAdvice: '建议结合风水布置和生活习惯调整',
          fullAnalysis: '基础分析结果'
        };
      }
      
      // 生成水晶推荐
      const crystalRecommendations = await CrystalRecommendationService.recommendCrystals(
        baziResult,
        siliconFlowAnalysis
      );
      
      // 生成风水建议
      const fengShuiAdvice = BaziService.generateFengShuiAdvice(baziResult.bazi, baziResult.elementAnalysis);
      
      // 保存预测记录
      const prediction = await Prediction.create({
        user_id: userId,
        birth_date,
        birth_time,
        birth_location,
        bazi_result: baziResult,
        fortune_analysis: {
          fortune: baziResult.fortune,
          feng_shui_advice: fengShuiAdvice
        },
        crystal_recommendations: crystalRecommendations,
        silicon_flow_analysis: siliconFlowAnalysis
      });
      
      // 消耗预测次数
      await User.consumePrediction(userId);
      
      res.json({
        message: '预测生成成功',
        prediction: {
          id: prediction.id,
          bazi_result: baziResult,
          fortune_analysis: {
            fortune: baziResult.fortune,
            feng_shui_advice: fengShuiAdvice
          },
          crystal_recommendations: crystalRecommendations,
          silicon_flow_analysis: siliconFlowAnalysis,
          created_at: new Date().toISOString()
        },
        remaining_predictions: user.prediction_count - 1
      });
    } catch (error) {
      console.error('创建预测失败:', error.message);
      res.status(500).json({ error: '预测生成失败，请稍后再试' });
    }
  }
  
  // 获取用户预测历史
  async getUserPredictions(req, res) {
    try {
      const userId = req.user.user_id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      const predictions = await Prediction.getUserPredictions(userId, limit, offset);
      
      res.json({
        predictions,
        pagination: {
          page,
          limit,
          total: predictions.length
        }
      });
    } catch (error) {
      console.error('获取预测历史失败:', error.message);
      res.status(500).json({ error: '获取数据失败' });
    }
  }
  
  // 获取单个预测详情
  async getPredictionById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.user_id;
      
      const prediction = await Prediction.findById(id, userId);
      if (!prediction) {
        return res.status(404).json({ error: '预测记录不存在' });
      }
      
      res.json({ prediction });
    } catch (error) {
      console.error('获取预测详情失败:', error.message);
      res.status(500).json({ error: '获取数据失败' });
    }
  }
}

module.exports = new PredictionController();