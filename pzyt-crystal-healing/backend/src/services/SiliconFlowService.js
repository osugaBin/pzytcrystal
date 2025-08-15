const axios = require('axios');

class SiliconFlowService {
  constructor() {
    this.apiKey = process.env.SILICONFLOW_API_KEY;
    this.baseUrl = process.env.SILICONFLOW_API_URL || 'https://cloud.siliconflow.cn';
    this.apiUrl = `${this.baseUrl}/v1/chat/completions`;
    this.model = process.env.SILICONFLOW_MODEL || 'deepseek-ai/DeepSeek-V3';
  }

  // 分析八字结果并生成水晶推荐
  async analyzeBaziForCrystalRecommendation(baziResult, userProfile) {
    try {
      const prompt = this.createAnalysisPrompt(baziResult, userProfile);
      
      const response = await axios.post(this.apiUrl, {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: '你是一位专业的水晶疗愈师和八字命理师，能够根据用户的八字分析结果推荐最适合的水晶组合。请以专业、准确、温暖的语调回复。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      const analysis = response.data.choices[0].message.content;
      return this.parseAnalysisResult(analysis);
    } catch (error) {
      console.error('SiliconFlow API调用失败:', error.message);
      // 返回默认的智能分析结果
      return this.generateDefaultAnalysis(baziResult);
    }
  }

  // 创建分析提示词
  createAnalysisPrompt(baziResult, userProfile = {}) {
    const { bazi, elementAnalysis, fortune } = baziResult;
    
    return `请根据以下八字分析结果，为用户推荐最适合的水晶组合：

八字信息：
- 年柱：${bazi.year.heavenly}${bazi.year.earthly}(五行：${bazi.year.element})
- 月柱：${bazi.month.heavenly}${bazi.month.earthly}(五行：${bazi.month.element})
- 日柱：${bazi.day.heavenly}${bazi.day.earthly}(五行：${bazi.day.element})
- 时柱：${bazi.hour.heavenly}${bazi.hour.earthly}(五行：${bazi.hour.element})

五行分析：
- 五行统计：${JSON.stringify(elementAnalysis.elementCount)}
- 最强五行：${elementAnalysis.strongest}
- 最弱五行：${elementAnalysis.weakest}
- 需要补强：${elementAnalysis.needStrengthening.join('、')}
- 平衡度：${elementAnalysis.balance}%

运势分析：
- 事业运：${fortune.career}分
- 财运：${fortune.wealth}分
- 健康运：${fortune.health}分
- 感情运：${fortune.relationship}分
- 总体运势：${fortune.overall}分

请按照以下格式返回分析结果：

1. 主要问题分析（找出最需要改善的方面）
2. 推荐水晶组合（至少3种水晶，包括中文名和英文名）
3. 佩带建议（具体的佩带方法和注意事项）
4. 疗愈效果预期（预期能改善的具体方面）
5. 额外建议（生活方式或风水布置建议）

请确保推荐的水晶都是常见且容易获取的品种。`;
  }

  // 解析AI分析结果
  parseAnalysisResult(analysis) {
    try {
      // 提取关键信息
      const sections = {
        mainIssues: this.extractSection(analysis, '主要问题', '推荐水晶'),
        crystalRecommendations: this.extractCrystalRecommendations(analysis),
        wearingAdvice: this.extractSection(analysis, '佩带建议', '疗愈效果'),
        expectedEffects: this.extractSection(analysis, '疗愈效果', '额外建议'),
        additionalAdvice: this.extractSection(analysis, '额外建议', null),
        fullAnalysis: analysis
      };

      return sections;
    } catch (error) {
      console.error('分析结果解析失败:', error.message);
      return {
        mainIssues: '分析结果解析失败',
        crystalRecommendations: [],
        wearingAdvice: '请咨询专业水晶疗愈师',
        expectedEffects: '请咨询专业水晶疗愈师',
        additionalAdvice: '请咨询专业水晶疗愈师',
        fullAnalysis: analysis
      };
    }
  }

  // 提取水晶推荐
  extractCrystalRecommendations(text) {
    const crystals = [];
    const lines = text.split('\n');
    let inCrystalSection = false;
    
    for (const line of lines) {
      if (line.includes('推荐水晶') || line.includes('水晶组合')) {
        inCrystalSection = true;
        continue;
      }
      
      if (inCrystalSection && (line.includes('佩带建议') || line.includes('疗愈效果'))) {
        break;
      }
      
      if (inCrystalSection && line.trim()) {
        // 提取水晶名称（中文和英文）
        const match = line.match(/[\u4e00-\u9fff]+\s*\([A-Za-z\s]+\)/g);
        if (match) {
          match.forEach(crystal => {
            const [chinese, english] = crystal.split(/[\(\uff08]/);
            crystals.push({
              chinese_name: chinese.trim(),
              english_name: english?.replace(/[\)\uff09]/g, '').trim() || '',
              reason: line.trim()
            });
          });
        }
      }
    }
    
    return crystals;
  }

  // 提取指定章节内容
  extractSection(text, startKeyword, endKeyword) {
    const lines = text.split('\n');
    let inSection = false;
    let content = [];
    
    for (const line of lines) {
      if (line.includes(startKeyword)) {
        inSection = true;
        continue;
      }
      
      if (inSection && endKeyword && line.includes(endKeyword)) {
        break;
      }
      
      if (inSection && line.trim()) {
        content.push(line.trim());
      }
    }
    
    return content.join('\n').trim();
  }

  // 生成智能本地分析结果
  generateDefaultAnalysis(baziResult) {
    const { bazi, elementAnalysis, fortune } = baziResult;
    
    // 深度分析主要问题
    const mainIssues = this.analyzeMainIssues(bazi, elementAnalysis, fortune);
    
    // 智能水晶推荐
    const crystalRecommendations = this.getIntelligentCrystalRecommendations(elementAnalysis, fortune);
    
    // 个性化佩带建议
    const wearingAdvice = this.generateWearingAdvice(elementAnalysis, crystalRecommendations);
    
    // 预期效果分析
    const expectedEffects = this.analyzeExpectedEffects(elementAnalysis, fortune);
    
    // 全面附加建议
    const additionalAdvice = this.generateComprehensiveAdvice(bazi, elementAnalysis, fortune);
    
    // 完整分析报告
    const fullAnalysis = this.generateFullAnalysisReport(bazi, elementAnalysis, fortune, crystalRecommendations);
    
    return {
      mainIssues,
      crystalRecommendations,
      wearingAdvice,
      expectedEffects,
      additionalAdvice,
      fullAnalysis
    };
  }
  
  // 深度分析主要问题
  analyzeMainIssues(bazi, elementAnalysis, fortune) {
    let issues = [];
    
    // 五行平衡分析
    if (elementAnalysis.balance < 60) {
      issues.push(`您的五行平衡度较低(${elementAnalysis.balance}%)，这可能导致能量流动不畅，影响各方面运势。`);
    }
    
    // 五行缺失分析
    if (elementAnalysis.needStrengthening.length > 0) {
      const elementMeanings = {
        '木': '创造力、成长力和事业发展',
        '火': '热情、活力和人际关系',
        '土': '稳定性、财运和健康基础',
        '金': '理性思维、决断力和领导能力',
        '水': '智慧、直觉和适应能力'
      };
      
      elementAnalysis.needStrengthening.forEach(element => {
        issues.push(`${element}元素不足，可能影响您的${elementMeanings[element]}。`);
      });
    }
    
    // 运势维度分析
    const lowScores = [];
    if (fortune.career < 70) lowScores.push('事业运势');
    if (fortune.wealth < 70) lowScores.push('财富运势');
    if (fortune.health < 70) lowScores.push('健康运势');
    if (fortune.relationship < 70) lowScores.push('感情运势');
    
    if (lowScores.length > 0) {
      issues.push(`${lowScores.join('、')}相对较弱，需要重点关注和调理。`);
    }
    
    // 日主分析
    const dayMaster = bazi.day.element;
    const seasonalAdvice = this.getSeasonalAdvice(dayMaster);
    if (seasonalAdvice) {
      issues.push(seasonalAdvice);
    }
    
    return issues.join(' ');
  }
  
  // 季节性建议
  getSeasonalAdvice(dayMaster) {
    const currentMonth = new Date().getMonth() + 1;
    const season = currentMonth <= 2 || currentMonth === 12 ? '冬' :
                  currentMonth <= 5 ? '春' :
                  currentMonth <= 8 ? '夏' : '秋';
    
    const seasonalAdvice = {
      '木': {
        '春': '正值木旺之季，是您发展事业的最佳时机。',
        '夏': '火旺消耗木气，注意保持充足休息。',
        '秋': '金克木，需要特别注意健康和人际关系。',
        '冬': '水生木，适合学习充电和规划未来。'
      },
      '火': {
        '春': '木生火，您的创造力和热情将得到很好的发挥。',
        '夏': '火旺当季，正是您大展身手的好时机。',
        '秋': '需要保持内心的热情，避免过度消耗。',
        '冬': '水克火，注意保暖养生，维持内在能量。'
      },
      '土': {
        '春': '木克土，需要加强稳定性和耐心。',
        '夏': '火生土，财运和事业都有不错的发展机会。',
        '秋': '金泄土气，适合整理和巩固已有成果。',
        '冬': '寒土需要温暖，多关注家庭和健康。'
      },
      '金': {
        '春': '木消耗金气，需要多补充营养和休息。',
        '夏': '火克金，避免过度劳累和情绪激动。',
        '秋': '金旺之季，您的理性思维和决断力最强。',
        '冬': '土生金，适合深度思考和长远规划。'
      },
      '水': {
        '春': '水生木，您的智慧能够很好地转化为行动力。',
        '夏': '火蒸水，需要保持内心平静，避免急躁。',
        '秋': '金生水，您的直觉和洞察力特别敏锐。',
        '冬': '水旺当季，是您思考人生和蓄积能量的好时期。'
      }
    };
    
    return seasonalAdvice[dayMaster]?.[season] || '';
  }
  
  // 智能水晶推荐
  getIntelligentCrystalRecommendations(elementAnalysis, fortune) {
    const recommendations = [];
    
    // 基于五行缺失的推荐
    const elementRecommendations = this.getElementBasedRecommendations(elementAnalysis);
    recommendations.push(...elementRecommendations);
    
    // 基于运势的推荐
    const fortuneRecommendations = this.getFortuneBasedRecommendations(fortune);
    recommendations.push(...fortuneRecommendations);
    
    // 去重并按优先级排序
    const uniqueRecommendations = this.deduplicateAndRank(recommendations);
    
    return uniqueRecommendations.slice(0, 3); // 返回最适合3个
  }
  
  // 基于五行的水晶推荐
  getElementBasedRecommendations(elementAnalysis) {
    const recommendations = [];
    
    // 五行缺失对应的水晶
    const elementCrystals = {
      '木': [
        { name: '绿东陵石', english: 'Green Aventurine', reason: '增强木元素，促进事业发展和创造力', priority: 9 },
        { name: '绿幽灵', english: 'Green Phantom', reason: '激发成长潜能，帮助事业突破', priority: 8 }
      ],
      '火': [
        { name: '红石榴石', english: 'Garnet', reason: '增强火元素，提升热情和行动力', priority: 9 },
        { name: '红绿宝', english: 'Ruby', reason: '激发内在能量，增强领导力', priority: 8 }
      ],
      '土': [
        { name: '黄水晶', english: 'Citrine', reason: '增强土元素，吸引财富和稳定性', priority: 10 },
        { name: '黄玉', english: 'Yellow Jade', reason: '带来健康和财运，稳定情绪', priority: 8 }
      ],
      '金': [
        { name: '白水晶', english: 'Clear Quartz', reason: '增强金元素，提升理性思维和决断力', priority: 9 },
        { name: '白玉', english: 'White Jade', reason: '净化心灵，增强智慧和清晰思维', priority: 8 }
      ],
      '水': [
        { name: '紫水晶', english: 'Amethyst', reason: '增强水元素，开发直觉和智慧', priority: 10 },
        { name: '海蓝宝', english: 'Aquamarine', reason: '平静心灵，增强沟通能力', priority: 8 }
      ]
    };
    
    elementAnalysis.needStrengthening.forEach(element => {
      if (elementCrystals[element]) {
        recommendations.push(...elementCrystals[element].map(crystal => ({
          chinese_name: crystal.name,
          english_name: crystal.english,
          reason: crystal.reason,
          priority: crystal.priority,
          type: 'element'
        })));
      }
    });
    
    return recommendations;
  }
  
  // 基于运势的水晶推荐
  getFortuneBasedRecommendations(fortune) {
    const recommendations = [];
    
    // 运势对应的水晶
    if (fortune.career < 70) {
      recommendations.push({
        chinese_name: '虎眼石',
        english_name: 'Tiger Eye',
        reason: '增强事业运势，提升勇气和决断力',
        priority: 8,
        type: 'career'
      });
    }
    
    if (fortune.wealth < 70) {
      recommendations.push({
        chinese_name: '黄水晶',
        english_name: 'Citrine',
        reason: '提升财运，吸引财富和机遇',
        priority: 9,
        type: 'wealth'
      });
    }
    
    if (fortune.health < 70) {
      recommendations.push({
        chinese_name: '绿东陵石',
        english_name: 'Green Aventurine',
        reason: '增强健康运势，平衡身心能量',
        priority: 8,
        type: 'health'
      });
    }
    
    if (fortune.relationship < 70) {
      recommendations.push({
        chinese_name: '粉水晶',
        english_name: 'Rose Quartz',
        reason: '增强感情运势，促进人际关系和爱情',
        priority: 9,
        type: 'relationship'
      });
    }
    
    return recommendations;
  }
  
  // 去重并按优先级排序
  deduplicateAndRank(recommendations) {
    const uniqueMap = new Map();
    
    recommendations.forEach(rec => {
      const key = rec.chinese_name;
      if (!uniqueMap.has(key) || uniqueMap.get(key).priority < rec.priority) {
        uniqueMap.set(key, rec);
      }
    });
    
    return Array.from(uniqueMap.values())
                .sort((a, b) => b.priority - a.priority);
  }
  
  // 个性化佩带建议
  generateWearingAdvice(elementAnalysis, crystalRecommendations) {
    let advice = [];
    
    // 基础佩带建议
    advice.push('建议每天佩带推荐的水晶，最好放置在心轮位置或直接佩带。');
    
    // 根据五行平衡度给出具体建议
    if (elementAnalysis.balance < 60) {
      advice.push('由于您的五行平衡度较低，建议同时佩带変2-3种不同水晶，平衡能量。');
    }
    
    // 根据推荐水晶给出具体指导
    if (crystalRecommendations.length > 0) {
      const primaryCrystal = crystalRecommendations[0];
      advice.push(`主要佩带${primaryCrystal.chinese_name}，可以做成手链或项链形式。`);
    }
    
    // 时间建议
    advice.push('每天早上起床后和晚上睡前，各花费5-10分钟冥想，手持水晶感受其能量振动。');
    
    return advice.join(' ');
  }
  
  // 预期效果分析
  analyzeExpectedEffects(elementAnalysis, fortune) {
    let effects = [];
    
    // 根据五行平衡度预测效果
    if (elementAnalysis.balance < 50) {
      effects.push('在1-2周内，您将逐渐感受到内心的平静和能量的流动。');
      effects.push('在2-4周内，五行能量将得到显著平衡，运势开始好转。');
      effects.push('在1-3个月内，您的整体运势将得到稳定提升。');
    } else {
      effects.push('在1周内，您将感受到水晶带来的正面能量。');
      effects.push('在2-3周内，相应的运势领域将得到明显改善。');
    }
    
    // 根据具体运势问题给出预期
    if (fortune.career < 70) {
      effects.push('事业方面：工作灵感增加，决断力提升，更容易获得上司和同事的认可。');
    }
    
    if (fortune.wealth < 70) {
      effects.push('财运方面：理财意识增强，更容易发现赚钱机会，偿还能力提升。');
    }
    
    if (fortune.health < 70) {
      effects.push('健康方面：身体能量增强，睡眠质量改善，抵抗力提升。');
    }
    
    if (fortune.relationship < 70) {
      effects.push('感情方面：人际关系改善，更容易吸引到合适的伴侣，家庭和谐度提升。');
    }
    
    return effects.join(' ');
  }
  
  // 全面附加建议
  generateComprehensiveAdvice(bazi, elementAnalysis, fortune) {
    let advice = [];
    
    // 生活习惯建议
    advice.push('生活习惯：保持规律作息，早睡早起，适度运动，均衡饮食。');
    
    // 水晶保养建议
    advice.push('水晶保养：每周用清水清洗水晶，每月放在月光下净化一次，保持水晶能量纯净。');
    
    // 环境布置建议
    const dayMaster = bazi.day.element;
    const environmentAdvice = this.getEnvironmentAdvice(dayMaster);
    if (environmentAdvice) {
      advice.push(`环境布置：${environmentAdvice}`);
    }
    
    // 心理调节建议
    advice.push('心理调节：保持乐观积极的心态，定期冥想或练习瞥想，提升精神层面的能量振动。');
    
    return advice.join(' ');
  }
  
  // 环境布置建议
  getEnvironmentAdvice(dayMaster) {
    const advice = {
      '木': '家中可多放置绿色植物，使用木质家具，选择东方或东南方向的住所。',
      '火': '可使用温暖的照明，布置红色或橙色装饰，选择南方向的房间。',
      '土': '使用土黄色调的装饰，可放置陶瓷制品，选择中央或西南方向的位置。',
      '金': '使用金属装饰品，选择白色或银色主色调，住所宜选择西方或西北方向。',
      '水': '可设置水景或鱼缸，使用蓝色或黑色装饰，选择北方向的房间。'
    };
    
    return advice[dayMaster] || '';
  }
  
  // 完整分析报告
  generateFullAnalysisReport(bazi, elementAnalysis, fortune, crystalRecommendations) {
    let report = [];
    
    // 八字概述
    report.push(`您的八字为：${bazi.year.heavenly}${bazi.year.earthly} ${bazi.month.heavenly}${bazi.month.earthly} ${bazi.day.heavenly}${bazi.day.earthly} ${bazi.hour.heavenly}${bazi.hour.earthly}。`);
    
    // 日主分析
    report.push(`您的日主为${bazi.day.heavenly}(${bazi.day.element})，这决定了您的根本性格和命运特质。`);
    
    // 五行分析
    const elementCounts = Object.entries(elementAnalysis.elementCount)
                               .map(([element, count]) => `${element}(${count})`)
                               .join('、');
    report.push(`五行分布：${elementCounts}，平衡度${elementAnalysis.balance}%。`);
    
    // 运势分析
    report.push(`各项运势评分：事业${fortune.career}分、财运${fortune.wealth}分、健康${fortune.health}分、感情${fortune.relationship}分，综合评分${fortune.overall}分。`);
    
    // 水晶推荐概述
    if (crystalRecommendations.length > 0) {
      const crystalNames = crystalRecommendations.map(c => c.chinese_name).join('、');
      report.push(`根据您的八字特点，特别推荐佩带${crystalNames}等水晶，这些水晶能够有效平衡您的五行能量。`);
    }
    
    // 结论
    report.push('此分析基于传统中医五行理论和水晶能量学，旨在为您提供参考和指导。请结合自身实际情况，理性对待。');
    
    return report.join('');
  }
  
  // 获取默认水晶推荐（兼容旧方法）
  getDefaultCrystalRecommendations(elementAnalysis) {
    const recommendations = [];
    
    // 根据缺少的五行元素推荐水晶
    if (elementAnalysis.needStrengthening.includes('木')) {
      recommendations.push({
        chinese_name: '绿东陵石',
        english_name: 'Green Aventurine',
        reason: '补充木元素，增强事业运和健康运'
      });
    }
    
    if (elementAnalysis.needStrengthening.includes('火')) {
      recommendations.push({
        chinese_name: '红石榴石',
        english_name: 'Garnet',
        reason: '补充火元素，提升热情和行动力'
      });
    }
    
    if (elementAnalysis.needStrengthening.includes('土')) {
      recommendations.push({
        chinese_name: '黄水晶',
        english_name: 'Citrine',
        reason: '补充土元素，增强财运和稳定性'
      });
    }
    
    if (elementAnalysis.needStrengthening.includes('金')) {
      recommendations.push({
        chinese_name: '白水晶',
        english_name: 'Clear Quartz',
        reason: '补充金元素，提升思维清晰度'
      });
    }
    
    if (elementAnalysis.needStrengthening.includes('水')) {
      recommendations.push({
        chinese_name: '紫水晶',
        english_name: 'Amethyst',
        reason: '补充水元素，增强直觉和智慧'
      });
    }
    
    // 如果没有明显缺失的元素，推荐平衡性水晶
    if (recommendations.length === 0) {
      recommendations.push(
        {
          chinese_name: '粉水晶',
          english_name: 'Rose Quartz',
          reason: '增强爱情运势和人际关系'
        },
        {
          chinese_name: '白水晶',
          english_name: 'Clear Quartz',
          reason: '净化能量，提升整体运势'
        }
      );
    }
    
    return recommendations;
  }

  // 验证API配置
  validateConfiguration() {
    if (!this.apiKey) {
      throw new Error('SiliconFlow API Key 未配置');
    }
    
    if (!this.apiUrl) {
      throw new Error('SiliconFlow API URL 未配置');
    }
    
    return true;
  }
}

module.exports = new SiliconFlowService();