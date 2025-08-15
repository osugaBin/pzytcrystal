const { Lunar, Solar } = require('lunar-javascript');

class BaziService {
  constructor() {
    // 五行属性对映
    this.elementMap = {
      '甲': '木', '乙': '木',
      '丙': '火', '丁': '火',
      '戊': '土', '己': '土',
      '庚': '金', '辛': '金',
      '壬': '水', '癸': '水'
    };

    // 生肖属性
    this.zodiacMap = {
      '子': '鼠', '丑': '牛', '寅': '虎', '卯': '兔',
      '辰': '龙', '巳': '蛇', '午': '马', '未': '羊',
      '申': '猴', '酉': '鸡', '戌': '狗', '亥': '猪'
    };

    // 五行相生相克
    this.elementRelations = {
      '木': { generates: '火', restrains: '土', generatedBy: '水', restrainedBy: '金' },
      '火': { generates: '土', restrains: '金', generatedBy: '木', restrainedBy: '水' },
      '土': { generates: '金', restrains: '水', generatedBy: '火', restrainedBy: '木' },
      '金': { generates: '水', restrains: '木', generatedBy: '土', restrainedBy: '火' },
      '水': { generates: '木', restrains: '火', generatedBy: '金', restrainedBy: '土' }
    };
  }

  // 计算八字
  calculateBazi(birthDate, birthTime, birthLocation) {
    try {
      // 解析出生时间
      const date = new Date(`${birthDate}T${birthTime}`);
      const solar = Solar.fromDate(date);
      const lunar = solar.getLunar();

      // 获取八字
      const eightChar = lunar.getEightChar();
      
      const bazi = {
        year: {
          heavenly: eightChar.getYearGan(),
          earthly: eightChar.getYearZhi(),
          element: this.elementMap[eightChar.getYearGan()],
          zodiac: this.zodiacMap[eightChar.getYearZhi()]
        },
        month: {
          heavenly: eightChar.getMonthGan(),
          earthly: eightChar.getMonthZhi(),
          element: this.elementMap[eightChar.getMonthGan()]
        },
        day: {
          heavenly: eightChar.getDayGan(),
          earthly: eightChar.getDayZhi(),
          element: this.elementMap[eightChar.getDayGan()]
        },
        hour: {
          heavenly: eightChar.getTimeGan(),
          earthly: eightChar.getTimeZhi(),
          element: this.elementMap[eightChar.getTimeGan()]
        }
      };

      // 分析五行平衡
      const elementAnalysis = this.analyzeElements(bazi);
      
      // 计算运势
      const fortune = this.calculateFortune(bazi, elementAnalysis);

      return {
        bazi,
        elementAnalysis,
        fortune,
        location: birthLocation,
        lunarDate: {
          year: lunar.getYear(),
          month: lunar.getMonth(),
          day: lunar.getDay(),
          chineseDate: lunar.toString()
        }
      };
    } catch (error) {
      throw new Error(`八字计算失败: ${error.message}`);
    }
  }

  // 分析五行平衡
  analyzeElements(bazi) {
    const elements = ['木', '火', '土', '金', '水'];
    const elementCount = {};
    
    // 初始化计数
    elements.forEach(element => {
      elementCount[element] = 0;
    });

    // 统计八字中各五行的数量
    Object.values(bazi).forEach(pillar => {
      if (pillar.element) {
        elementCount[pillar.element]++;
      }
    });

    // 找出最强和最弱的五行
    const strongest = elements.reduce((a, b) => elementCount[a] > elementCount[b] ? a : b);
    const weakest = elements.reduce((a, b) => elementCount[a] < elementCount[b] ? a : b);

    // 分析需要补强的五行
    const needStrengthening = elements.filter(element => elementCount[element] === 0);
    
    return {
      elementCount,
      strongest,
      weakest,
      needStrengthening,
      balance: this.calculateElementBalance(elementCount)
    };
  }

  // 计算五行平衡度
  calculateElementBalance(elementCount) {
    const total = Object.values(elementCount).reduce((sum, count) => sum + count, 0);
    const ideal = total / 5; // 理想情况下每个五行占总数的20%
    
    let variance = 0;
    Object.values(elementCount).forEach(count => {
      variance += Math.pow(count - ideal, 2);
    });
    
    const balance = Math.max(0, 100 - (variance / ideal * 10)); // 转换为0-100的平衡分数
    
    return Math.round(balance);
  }

  // 计算运势
  calculateFortune(bazi, elementAnalysis) {
    const dayMaster = bazi.day.element; // 日主五行
    
    // 基础运势评分（根据五行平衡度）
    const baseScore = elementAnalysis.balance;
    
    // 各方面运势评分
    const fortune = {
      career: this.calculateCareerFortune(dayMaster, elementAnalysis, baseScore),
      wealth: this.calculateWealthFortune(dayMaster, elementAnalysis, baseScore),
      health: this.calculateHealthFortune(dayMaster, elementAnalysis, baseScore),
      relationship: this.calculateRelationshipFortune(dayMaster, elementAnalysis, baseScore),
      overall: 0
    };

    // 计算总体运势
    fortune.overall = Math.round(
      (fortune.career + fortune.wealth + fortune.health + fortune.relationship) / 4
    );

    return fortune;
  }

  // 计算事业运
  calculateCareerFortune(dayMaster, elementAnalysis, baseScore) {
    let score = baseScore;
    
    // 根据日主五行调整
    if (dayMaster === '火' && elementAnalysis.elementCount['木'] > 0) {
      score += 10; // 火得木生，事业运好
    }
    if (dayMaster === '土' && elementAnalysis.elementCount['火'] > 0) {
      score += 10; // 土得火生，事业运好
    }
    
    return Math.min(100, Math.max(0, score));
  }

  // 计算财运
  calculateWealthFortune(dayMaster, elementAnalysis, baseScore) {
    let score = baseScore;
    
    // 根据日主五行调整
    if (dayMaster === '土' && elementAnalysis.elementCount['金'] > 0) {
      score += 15; // 土生金，财运好
    }
    if (dayMaster === '金' && elementAnalysis.elementCount['水'] > 0) {
      score += 15; // 金生水，财运好
    }
    
    return Math.min(100, Math.max(0, score));
  }

  // 计算健康运
  calculateHealthFortune(dayMaster, elementAnalysis, baseScore) {
    let score = baseScore;
    
    // 五行平衡对健康影响很大
    if (elementAnalysis.balance > 80) {
      score += 20;
    } else if (elementAnalysis.balance < 30) {
      score -= 20;
    }
    
    return Math.min(100, Math.max(0, score));
  }

  // 计算感情运
  calculateRelationshipFortune(dayMaster, elementAnalysis, baseScore) {
    let score = baseScore;
    
    // 根据日主五行调整
    if (dayMaster === '水' && elementAnalysis.elementCount['木'] > 0) {
      score += 10; // 水生木，感情运好
    }
    if (dayMaster === '木' && elementAnalysis.elementCount['火'] > 0) {
      score += 10; // 木生火，感情运好
    }
    
    return Math.min(100, Math.max(0, score));
  }

  // 生成风水建议
  generateFengShuiAdvice(bazi, elementAnalysis) {
    const advice = {
      colors: [],
      directions: [],
      lifestyle: [],
      cautions: []
    };

    // 根据缺失的五行给出建议
    elementAnalysis.needStrengthening.forEach(element => {
      switch (element) {
        case '木':
          advice.colors.push('绿色', '青色');
          advice.directions.push('东方');
          advice.lifestyle.push('多接触自然', '可养植绿植');
          break;
        case '火':
          advice.colors.push('红色', '紫色');
          advice.directions.push('南方');
          advice.lifestyle.push('多晒太阳', '可佩带红色饰品');
          break;
        case '土':
          advice.colors.push('黄色', '棕色');
          advice.directions.push('中宫');
          advice.lifestyle.push('多接触土地', '可佩带黄水晶');
          break;
        case '金':
          advice.colors.push('白色', '金色');
          advice.directions.push('西方');
          advice.lifestyle.push('多佩带金属饰品', '可放置金属用品');
          break;
        case '水':
          advice.colors.push('黑色', '蓝色');
          advice.directions.push('北方');
          advice.lifestyle.push('多喝水', '可放置水景装饰');
          break;
      }
    });

    return advice;
  }
}

module.exports = new BaziService();