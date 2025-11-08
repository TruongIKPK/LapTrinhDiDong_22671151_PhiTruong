import * as SQLite from 'expo-sqlite';

// Mở kết nối SQLite
const db = SQLite.openDatabaseSync('myDatabase.db');

// Hàm khởi tạo database
export const initDatabase = async () => {
  try {
    console.log('Đang khởi tạo database...');
    
    // Tạo bảng todos
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        done INTEGER DEFAULT 0,
        created_at INTEGER
      );
    `);
    
    console.log('Database đã được khởi tạo thành công!');
  } catch (error) {
    console.error('Lỗi khi khởi tạo database:', error);
    throw error;
  }
};

// Export database instance
export default db;
