const Database = require('../src/models/Database');
const fs = require('fs');
const path = require('path');

// 水晶数据种子数据
const crystalData = [
  {
    name: 'Amethyst',
    chinese_name: '紫水晶',
    category: '石英类',
    color: '紫色',
    five_elements: JSON.stringify(['水']),
    healing_properties: JSON.stringify(['净化意念', '增强直觉', '平静心灵', '改善睡眠']),
    suitable_for: JSON.stringify(['健康运', '感情运', '灵性提升']),
    image_url: '/images/purple_amethyst_raw_crystal_stone_display.jpg',
    price: 88.00,
    description: '紫水晶被誉为“智慧之石”，能够净化心灵，增强直觉力，帮助保持内心平静。'
  },
  {
    name: 'Rose Quartz',
    chinese_name: '粉水晶',
    category: '石英类',
    color: '粉色',
    five_elements: JSON.stringify(['土']),
    healing_properties: JSON.stringify(['增进爱情', '治愈心灵创伤', '提升自信', '缓解情绪压力']),
    suitable_for: JSON.stringify(['感情运', '人际关系', '心理健康']),
    image_url: '/images/natural_raw_rose_quartz_pink_crystal.jpg',
    price: 66.00,
    description: '粉水晶被称为“爱情之石”，能够吸引爱情，治愈心灵创伤，增强人际关系。'
  },
  {
    name: 'Clear Quartz',
    chinese_name: '白水晶',
    category: '石英类',
    color: '百色',
    five_elements: JSON.stringify(['金']),
    healing_properties: JSON.stringify(['放大能量', '净化磁场', '增强专注力', '促进治愈']),
    suitable_for: JSON.stringify(['事业运', '健康运', '能量增强']),
    image_url: '/images/natural_clear_quartz_crystal_cluster_white_background.jpg',
    price: 55.00,
    description: '白水晶被誉为“水晶之王”，具有放大和净化能量的作用，可以增强其他水晶的能量。'
  },
  {
    name: 'Citrine',
    chinese_name: '黄水晶',
    category: '石英类',
    color: '黄色',
    five_elements: JSON.stringify(['土']),
    healing_properties: JSON.stringify(['招财进宝', '增强自信', '提升创造力', '带来欢乐']),
    suitable_for: JSON.stringify(['财运', '事业运', '创业发展']),
    image_url: '/images/golden_yellow_citrine_crystal_gemstone_wealth.jpg',
    price: 99.00,
    description: '黄水晶被称为“商人之石”，具有强大的招财能量，能够吸引财富和成功。'
  },
  {
    name: 'Green Aventurine',
    chinese_name: '绿东陵石',
    category: '石英类',
    color: '绿色',
    five_elements: JSON.stringify(['木']),
    healing_properties: JSON.stringify(['平衡情绪', '增强领导力', '吸引好运', '促进成长']),
    suitable_for: JSON.stringify(['事业运', '健康运', '人际关系']),
    image_url: '/images/natural_raw_clear_white_quartz_crystals.jpg',
    price: 77.00,
    description: '绿东陵石被誉为“机会之石”，能够带来好运和机会，特别适合创业者和投资者。'
  },
  {
    name: 'Black Tourmaline',
    chinese_name: '黑电气石',
    category: '电气石类',
    color: '黑色',
    five_elements: JSON.stringify(['水']),
    healing_properties: JSON.stringify(['防护负能量', '增强安全感', '稳定情绪', '净化磁场']),
    suitable_for: JSON.stringify(['健康运', '工作压力', '环境净化']),
    image_url: '/images/clear_quartz_crystal_cluster_hand_display.jpg',
    price: 88.00,
    description: '黑电气石被誉为“防护之石”，能够有效阻挡负能量和电磁辐射，保护佩带者的能量场。'
  },
  {
    name: 'Moonstone',
    chinese_name: '月光石',
    category: '长石类',
    color: '白色',
    five_elements: JSON.stringify(['水']),
    healing_properties: JSON.stringify(['增强直觉', '平衡荷尔蒙', '提升女性魅力', '促进灵性成长']),
    suitable_for: JSON.stringify(['感情运', '女性健康', '灵性发展']),
    image_url: '/images/three_natural_clear_quartz_crystal_points.jpg',
    price: 108.00,
    description: '月光石被称为“女性之石”，能够平衡女性荷尔蒙，增强直觉力和灵性敏感度。'
  },
  {
    name: 'Tiger Eye',
    chinese_name: '虎眼石',
    category: '石英类',
    color: '黄棕色',
    five_elements: JSON.stringify(['土']),
    healing_properties: JSON.stringify(['增强勇气', '提升专注力', '吸引财富', '平衡能量']),
    suitable_for: JSON.stringify(['事业运', '财运', '领导力提升']),
    image_url: '/images/golden-citrine-crystal-cluster.jpg',
    price: 66.00,
    description: '虎眼石被誉为“勇气之石”，能够增强意志力和决断力，帮助佩带者克服困难。'
  }
];

async function seedDatabase() {
  try {
    console.log('ℹ️  开始初始化数据库数据...');
    
    const db = Database.getDatabase();
    
    // 清空现有数据
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM crystals', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    console.log('✓ 清空现有水晶数据');
    
    // 插入水晶数据
    for (const crystal of crystalData) {
      await new Promise((resolve, reject) => {
        const sql = `INSERT INTO crystals 
          (name, chinese_name, category, color, five_elements, healing_properties, suitable_for, image_url, price, description) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        db.run(sql, [
          crystal.name,
          crystal.chinese_name,
          crystal.category,
          crystal.color,
          crystal.five_elements,
          crystal.healing_properties,
          crystal.suitable_for,
          crystal.image_url,
          crystal.price,
          crystal.description
        ], function(err) {
          if (err) {
            console.error(`插入水晶 ${crystal.chinese_name} 失败:`, err.message);
            reject(err);
          } else {
            console.log(`✓ 水晶 ${crystal.chinese_name} 插入成功`);
            resolve();
          }
        });
      });
    }
    
    console.log(`\n🎉 数据库初始化完成！共插入 ${crystalData.length} 条水晶数据`);
    console.log('ℹ️  可以使用 npm run dev 启动服务器');
    
  } catch (error) {
    console.error('✗ 数据库初始化失败:', error.message);
  } finally {
    Database.close();
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;