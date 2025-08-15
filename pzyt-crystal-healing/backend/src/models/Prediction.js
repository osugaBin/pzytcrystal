const Database = require('./Database');

class Prediction {
  constructor() {
    this.db = Database.getDatabase();
  }

  // 创建预测记录
  async create(predictionData) {
    const {
      user_id,
      birth_date,
      birth_time,
      birth_location,
      bazi_result,
      fortune_analysis,
      crystal_recommendations,
      silicon_flow_analysis
    } = predictionData;
    
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO predictions 
        (user_id, birth_date, birth_time, birth_location, bazi_result, fortune_analysis, crystal_recommendations, silicon_flow_analysis) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      
      this.db.run(sql, [
        user_id,
        birth_date,
        birth_time,
        birth_location,
        JSON.stringify(bazi_result),
        JSON.stringify(fortune_analysis),
        JSON.stringify(crystal_recommendations),
        JSON.stringify(silicon_flow_analysis)
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...predictionData });
        }
      });
    });
  }

  // 获取用户的预测记录
  async getUserPredictions(userId, limit = 10, offset = 0) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM predictions WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      this.db.all(sql, [userId, limit, offset], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // 解析JSON数据
          const predictions = rows.map(row => ({
            ...row,
            bazi_result: JSON.parse(row.bazi_result || '{}'),
            fortune_analysis: JSON.parse(row.fortune_analysis || '{}'),
            crystal_recommendations: JSON.parse(row.crystal_recommendations || '[]'),
            silicon_flow_analysis: JSON.parse(row.silicon_flow_analysis || '{}')
          }));
          resolve(predictions);
        }
      });
    });
  }

  // 根据ID获取预测记录
  async findById(id, userId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM predictions WHERE id = ? AND user_id = ?`;
      this.db.get(sql, [id, userId], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          // 解析JSON数据
          const prediction = {
            ...row,
            bazi_result: JSON.parse(row.bazi_result || '{}'),
            fortune_analysis: JSON.parse(row.fortune_analysis || '{}'),
            crystal_recommendations: JSON.parse(row.crystal_recommendations || '[]'),
            silicon_flow_analysis: JSON.parse(row.silicon_flow_analysis || '{}')
          };
          resolve(prediction);
        } else {
          resolve(null);
        }
      });
    });
  }

  // 获取用户预测数量
  async getUserPredictionCount(userId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT COUNT(*) as count FROM predictions WHERE user_id = ?`;
      this.db.get(sql, [userId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.count);
        }
      });
    });
  }
}

module.exports = new Prediction();