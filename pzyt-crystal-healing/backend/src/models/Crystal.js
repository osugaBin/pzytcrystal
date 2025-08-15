const Database = require('./Database');

class Crystal {
  constructor() {
    this.db = Database.getDatabase();
  }

  // 获取所有水晶
  async getAll() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM crystals ORDER BY name`;
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // 解析JSON数据
          const crystals = rows.map(row => ({
            ...row,
            five_elements: JSON.parse(row.five_elements || '[]'),
            healing_properties: JSON.parse(row.healing_properties || '[]'),
            suitable_for: JSON.parse(row.suitable_for || '[]')
          }));
          resolve(crystals);
        }
      });
    });
  }

  // 根据五行属性获取水晶
  async getByElement(element) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM crystals WHERE five_elements LIKE ?`;
      this.db.all(sql, [`%"${element}"%`], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const crystals = rows.map(row => ({
            ...row,
            five_elements: JSON.parse(row.five_elements || '[]'),
            healing_properties: JSON.parse(row.healing_properties || '[]'),
            suitable_for: JSON.parse(row.suitable_for || '[]')
          }));
          resolve(crystals);
        }
      });
    });
  }

  // 根据疗愈属性获取水晶
  async getByHealingProperty(property) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM crystals WHERE healing_properties LIKE ?`;
      this.db.all(sql, [`%"${property}"%`], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const crystals = rows.map(row => ({
            ...row,
            five_elements: JSON.parse(row.five_elements || '[]'),
            healing_properties: JSON.parse(row.healing_properties || '[]'),
            suitable_for: JSON.parse(row.suitable_for || '[]')
          }));
          resolve(crystals);
        }
      });
    });
  }

  // 根据ID获取水晶
  async findById(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM crystals WHERE id = ?`;
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          const crystal = {
            ...row,
            five_elements: JSON.parse(row.five_elements || '[]'),
            healing_properties: JSON.parse(row.healing_properties || '[]'),
            suitable_for: JSON.parse(row.suitable_for || '[]')
          };
          resolve(crystal);
        } else {
          resolve(null);
        }
      });
    });
  }

  // 搜索水晶
  async search(keyword) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM crystals WHERE name LIKE ? OR chinese_name LIKE ? OR description LIKE ?`;
      const searchTerm = `%${keyword}%`;
      this.db.all(sql, [searchTerm, searchTerm, searchTerm], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const crystals = rows.map(row => ({
            ...row,
            five_elements: JSON.parse(row.five_elements || '[]'),
            healing_properties: JSON.parse(row.healing_properties || '[]'),
            suitable_for: JSON.parse(row.suitable_for || '[]')
          }));
          resolve(crystals);
        }
      });
    });
  }
}

module.exports = new Crystal();