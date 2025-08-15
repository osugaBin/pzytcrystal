const Database = require('./Database');

class Payment {
  constructor() {
    this.db = Database.getDatabase();
  }

  // 创建支付记录
  async create(paymentData) {
    const {
      user_id,
      amount,
      currency = 'CNY',
      payment_method = 'alipay',
      prediction_count_added = 2
    } = paymentData;
    
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO payments (user_id, amount, currency, payment_method, prediction_count_added) VALUES (?, ?, ?, ?, ?)`;
      this.db.run(sql, [user_id, amount, currency, payment_method, prediction_count_added], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...paymentData, status: 'pending' });
        }
      });
    });
  }

  // 更新支付状态
  async updateStatus(id, status, transaction_id = null) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE payments SET status = ?, transaction_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      this.db.run(sql, [status, transaction_id, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }

  // 根据ID查找支付记录
  async findById(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM payments WHERE id = ?`;
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // 获取用户支付记录
  async getUserPayments(userId, limit = 10, offset = 0) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      this.db.all(sql, [userId, limit, offset], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // 根据交易ID查找支付记录
  async findByTransactionId(transaction_id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM payments WHERE transaction_id = ?`;
      this.db.get(sql, [transaction_id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
}

module.exports = new Payment();