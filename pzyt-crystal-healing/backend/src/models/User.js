const Database = require('./Database');
const bcrypt = require('bcryptjs');

class User {
  constructor() {
    this.db = Database.getDatabase();
  }

  // 创建用户
  async create(userData) {
    const { email, password, full_name } = userData;
    const password_hash = await bcrypt.hash(password, 10);
    
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)`;
      this.db.run(sql, [email, password_hash, full_name], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, email, full_name, prediction_count: 1 });
        }
      });
    });
  }

  // 根据Email查找用户
  async findByEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE email = ?`;
      this.db.get(sql, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // 根据ID查找用户
  async findById(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id, email, full_name, prediction_count, created_at FROM users WHERE id = ?`;
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // 验证密码
  async validatePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  // 更新预测次数
  async updatePredictionCount(userId, count) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE users SET prediction_count = prediction_count + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      this.db.run(sql, [count, userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }

  // 消耗预测次数
  async consumePrediction(userId) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE users SET prediction_count = prediction_count - 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND prediction_count > 0`;
      this.db.run(sql, [userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }
}

module.exports = new User();