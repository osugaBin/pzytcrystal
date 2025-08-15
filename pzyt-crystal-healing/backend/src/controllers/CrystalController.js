const Crystal = require('../models/Crystal');

class CrystalController {
  // 获取所有水晶
  async getAllCrystals(req, res) {
    try {
      const crystals = await Crystal.getAll();
      res.json({ crystals });
    } catch (error) {
      console.error('获取水晶列表失败:', error.message);
      res.status(500).json({ error: '获取数据失败' });
    }
  }
  
  // 根据ID获取水晶详情
  async getCrystalById(req, res) {
    try {
      const { id } = req.params;
      const crystal = await Crystal.findById(id);
      
      if (!crystal) {
        return res.status(404).json({ error: '水晶不存在' });
      }
      
      res.json({ crystal });
    } catch (error) {
      console.error('获取水晶详情失败:', error.message);
      res.status(500).json({ error: '获取数据失败' });
    }
  }
  
  // 根据五行获取水晶
  async getCrystalsByElement(req, res) {
    try {
      const { element } = req.params;
      const crystals = await Crystal.getByElement(element);
      res.json({ crystals, element });
    } catch (error) {
      console.error('按五行获取水晶失败:', error.message);
      res.status(500).json({ error: '获取数据失败' });
    }
  }
  
  // 按疗愈属性获取水晶
  async getCrystalsByHealingProperty(req, res) {
    try {
      const { property } = req.params;
      const crystals = await Crystal.getByHealingProperty(property);
      res.json({ crystals, property });
    } catch (error) {
      console.error('按疗愈属性获取水晶失败:', error.message);
      res.status(500).json({ error: '获取数据失败' });
    }
  }
  
  // 搜索水晶
  async searchCrystals(req, res) {
    try {
      const { q: keyword } = req.query;
      
      if (!keyword) {
        return res.status(400).json({ error: '请提供搜索关键词' });
      }
      
      const crystals = await Crystal.search(keyword);
      res.json({ crystals, keyword });
    } catch (error) {
      console.error('搜索水晶失败:', error.message);
      res.status(500).json({ error: '搜索失败' });
    }
  }
  
  // 获取水晶分类统计
  async getCrystalStats(req, res) {
    try {
      const allCrystals = await Crystal.getAll();
      
      // 统计各个分类的水晶数量
      const stats = {
        total: allCrystals.length,
        by_element: {},
        by_color: {},
        by_category: {}
      };
      
      allCrystals.forEach(crystal => {
        // 统计五行
        if (crystal.five_elements && Array.isArray(crystal.five_elements)) {
          crystal.five_elements.forEach(element => {
            stats.by_element[element] = (stats.by_element[element] || 0) + 1;
          });
        }
        
        // 统计颜色
        if (crystal.color) {
          stats.by_color[crystal.color] = (stats.by_color[crystal.color] || 0) + 1;
        }
        
        // 统计分类
        if (crystal.category) {
          stats.by_category[crystal.category] = (stats.by_category[crystal.category] || 0) + 1;
        }
      });
      
      res.json({ stats });
    } catch (error) {
      console.error('获取水晶统计失败:', error.message);
      res.status(500).json({ error: '获取数据失败' });
    }
  }
}

module.exports = new CrystalController();