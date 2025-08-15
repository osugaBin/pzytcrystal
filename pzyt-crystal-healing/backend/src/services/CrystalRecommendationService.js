const Crystal = require('../models/Crystal');
const SiliconFlowService = require('./SiliconFlowService');

class CrystalRecommendationService {
  constructor() {
    // 五行对应的水晶分类
    this.elementCrystals = {
      '木': ['green_aventurine', 'malachite', 'green_jade', 'amazonite'],
      '火': ['carnelian', 'red_jasper', 'garnet', 'ruby'],
      '土': ['yellow_jade', 'tiger_eye', 'brown_jasper', 'citrine'],
      '金': ['clear_quartz', 'white_jade', 'howlite', 'moonstone'],
      '水': ['amethyst', 'sodalite', 'lapis_lazuli', 'black_tourmaline']
    };

    // 运势问题对应的水晶
    this.fortuneCrystals = {
      career: ['citrine', 'tiger_eye', 'pyrite', 'carnelian'],
      wealth: ['citrine', 'green_aventurine', 'pyrite', 'jade'],
      health: ['amethyst', 'clear_quartz', 'rose_quartz', 'green_aventurine'],
      relationship: ['rose_quartz', 'moonstone', 'rhodonite', 'green_aventurine']
    };
  }

  // 根据八字分析推荐水晶
  async recommendCrystals(baziResult, siliconFlowAnalysis) {
    try {
      // 获取所有水晶数据
      const allCrystals = await Crystal.getAll();
      
      // 基于五行缺失的推荐
      const elementRecommendations = await this.getElementBasedRecommendations(
        baziResult.elementAnalysis,
        allCrystals
      );
      
      // 基于运势问题的推荐
      const fortuneRecommendations = await this.getFortuneBasedRecommendations(
        baziResult.fortune,
        allCrystals
      );
      
      // 结合SiliconFlow分析结果
      const aiRecommendations = this.parseAIRecommendations(
        siliconFlowAnalysis.crystalRecommendations,
        allCrystals
      );
      
      // 综合推荐结果
      const finalRecommendations = this.combineRecommendations(
        elementRecommendations,
        fortuneRecommendations,
        aiRecommendations
      );
      
      return {
        primary_crystals: finalRecommendations.slice(0, 3), // 主要推荐
        secondary_crystals: finalRecommendations.slice(3, 6), // 次要推荐
        reasoning: this.generateRecommendationReasoning(baziResult, siliconFlowAnalysis),
        wearing_guide: this.generateWearingGuide(finalRecommendations.slice(0, 3))
      };
    } catch (error) {
      console.error('水晶推荐失败:', error.message);
      throw new Error('水晶推荐服务暂时不可用');
    }
  }

  // 基于五行缺失的推荐
  async getElementBasedRecommendations(elementAnalysis, allCrystals) {
    const recommendations = [];
    
    // 优先推荐缺失五行的水晶
    elementAnalysis.needStrengthening.forEach(element => {
      const crystalNames = this.elementCrystals[element] || [];
      crystalNames.forEach(name => {
        const crystal = allCrystals.find(c => 
          c.name.toLowerCase().includes(name.toLowerCase()) ||
          c.chinese_name.includes(this.getElementChineseName(element))
        );
        if (crystal) {
          recommendations.push({
            ...crystal,
            priority: 'high',
            reason: `补强${element}五行能量`,
            score: 90
          });
        }
      });
    });
    
    // 排序并去重
    return this.deduplicateAndSort(recommendations);
  }

  // 基于运势问题的推荐
  async getFortuneBasedRecommendations(fortune, allCrystals) {
    const recommendations = [];
    
    // 找出最低的运势分数
    const fortuneTypes = ['career', 'wealth', 'health', 'relationship'];
    const weakestFortune = fortuneTypes.reduce((min, type) => 
      fortune[type] < fortune[min] ? type : min
    );
    
    // 推荐对应的水晶
    const crystalNames = this.fortuneCrystals[weakestFortune] || [];
    crystalNames.forEach(name => {
      const crystal = allCrystals.find(c => 
        c.name.toLowerCase().includes(name.toLowerCase()) ||
        c.suitable_for.includes(this.getFortuneChineseName(weakestFortune))
      );
      if (crystal) {
        recommendations.push({
          ...crystal,
          priority: 'medium',
          reason: `改善${this.getFortuneChineseName(weakestFortune)}`,
          score: 70
        });
      }
    });
    
    return this.deduplicateAndSort(recommendations);
  }

  // 解析AI推荐结果
  parseAIRecommendations(aiRecommendations, allCrystals) {
    const recommendations = [];
    
    aiRecommendations.forEach(aiCrystal => {
      const crystal = allCrystals.find(c => 
        c.chinese_name.includes(aiCrystal.chinese_name) ||
        c.name.toLowerCase().includes(aiCrystal.english_name?.toLowerCase())
      );
      
      if (crystal) {
        recommendations.push({
          ...crystal,
          priority: 'ai',
          reason: aiCrystal.reason,
          score: 85
        });
      }
    });
    
    return recommendations;
  }

  // 综合推荐结果
  combineRecommendations(elementRecs, fortuneRecs, aiRecs) {
    const combined = [...elementRecs, ...fortuneRecs, ...aiRecs];
    
    // 去重并按评分排序
    return this.deduplicateAndSort(combined);
  }

  // 去重并排序
  deduplicateAndSort(recommendations) {
    const unique = recommendations.reduce((acc, current) => {
      const existing = acc.find(item => item.id === current.id);
      if (!existing) {
        acc.push(current);
      } else if (current.score > existing.score) {
        // 如果现有的评分更低，替换
        const index = acc.findIndex(item => item.id === current.id);
        acc[index] = current;
      }
      return acc;
    }, []);
    
    return unique.sort((a, b) => b.score - a.score);
  }

  // 生成推荐理由
  generateRecommendationReasoning(baziResult, siliconFlowAnalysis) {
    const { elementAnalysis, fortune } = baziResult;
    
    let reasoning = '根据您的八字分析：\n';
    
    if (elementAnalysis.needStrengthening.length > 0) {
      reasoning += `\n您的五行中缺少${elementAnalysis.needStrengthening.join('、')}能量，`;
      reasoning += '建议佩带相应的水晶来补强。';
    }
    
    const weakestFortune = Object.keys(fortune)
      .filter(key => key !== 'overall')
      .reduce((min, key) => fortune[key] < fortune[min] ? key : min);
    
    reasoning += `\n您的${this.getFortuneChineseName(weakestFortune)}相对较弱，`;
    reasoning += '可以通过特定水晶来增强这方面的能量。';
    
    if (siliconFlowAnalysis.mainIssues) {
      reasoning += `\n\nAI分析认为：${siliconFlowAnalysis.mainIssues}`;
    }
    
    return reasoning;
  }

  // 生成佩带指南
  generateWearingGuide(crystals) {
    const guide = {
      daily_routine: '建议每天佩带水晶，可以选择手链、项链或随身携带。',
      wearing_time: '最佳佩带时间为每天6-8小时，避免过度佩带。',
      care_instructions: '定期清洗水晶，可用清水冲洗或日光浄化。',
      combinations: []
    };
    
    if (crystals.length >= 2) {
      guide.combinations.push(`${crystals[0].chinese_name}和${crystals[1].chinese_name}可以同时佩带，增强效果。`);
    }
    
    return guide;
  }

  // 获取五行中文名称
  getElementChineseName(element) {
    const names = {
      '木': '绿色',
      '火': '红色',
      '土': '黄色',
      '金': '白色',
      '水': '黑色'
    };
    return names[element] || element;
  }

  // 获取运势中文名称
  getFortuneChineseName(fortune) {
    const names = {
      career: '事业运',
      wealth: '财运',
      health: '健康运',
      relationship: '感情运'
    };
    return names[fortune] || fortune;
  }
}

module.exports = new CrystalRecommendationService();