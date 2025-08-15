const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
  constructor() {
    const dbPath = path.resolve(__dirname, '../database/pzyt.db');
    const dbDir = path.dirname(dbPath);
    
    // 确保数据库目录存在
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('数据库连接失败:', err.message);
      } else {
        console.log('✓ 数据库连接成功');
        this.initialize();
      }
    });
  }

  initialize() {
    // 启用外键约束
    this.db.run('PRAGMA foreign_keys = ON');
    
    // 创建表
    this.createTables();
  }

  createTables() {
    const tables = [
      // 用户表
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT,
        prediction_count INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // 预测记录表
      `CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        birth_date TEXT NOT NULL,
        birth_time TEXT NOT NULL,
        birth_location TEXT NOT NULL,
        bazi_result TEXT,
        fortune_analysis TEXT,
        crystal_recommendations TEXT,
        silicon_flow_analysis TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,
      
      // 支付记录表
      `CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'CNY',
        status TEXT DEFAULT 'pending',
        payment_method TEXT DEFAULT 'alipay',
        transaction_id TEXT,
        prediction_count_added INTEGER DEFAULT 2,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,
      
      // 水晶信息表
      `CREATE TABLE IF NOT EXISTS crystals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        chinese_name TEXT NOT NULL,
        category TEXT,
        color TEXT,
        five_elements TEXT,
        healing_properties TEXT,
        suitable_for TEXT,
        image_url TEXT,
        price REAL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    tables.forEach((sql, index) => {
      this.db.run(sql, (err) => {
        if (err) {
          console.error(`表${index + 1}创建失败:`, err.message);
        } else {
          console.log(`✓ 表${index + 1}创建成功`);
        }
      });
    });
  }

  // 获取数据库实例
  getDatabase() {
    return this.db;
  }

  // 关闭数据库连接
  close() {
    this.db.close((err) => {
      if (err) {
        console.error('数据库关闭失败:', err.message);
      } else {
        console.log('数据库连接已关闭');
      }
    });
  }
}

module.exports = new Database();