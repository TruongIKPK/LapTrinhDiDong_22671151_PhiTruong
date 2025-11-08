import * as SQLite from 'expo-sqlite';

// Mở kết nối SQLite (async)
let db: SQLite.SQLiteDatabase | null = null;
let isInitializing = false;
let initPromise: Promise<void> | null = null;

// Hàm khởi tạo database (bất đồng bộ)
export const initDatabase = async () => {
  // Nếu database đã được khởi tạo, return ngay
  if (db) {
    return;
  }

  // Nếu đang khởi tạo, đợi promise hiện tại
  if (isInitializing && initPromise) {
    return initPromise;
  }

  // Bắt đầu khởi tạo
  isInitializing = true;
  
  initPromise = (async () => {
    try {
      console.log('Đang khởi tạo database...');
      
      // Mở database bất đồng bộ
      db = await SQLite.openDatabaseAsync('myDatabase.db');
      
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
      
      // Seed dữ liệu mẫu nếu bảng trống
      await seedDataIfEmpty();
      
    } catch (error) {
      console.error('Lỗi khi khởi tạo database:', error);
      db = null;
      throw error;
    } finally {
      isInitializing = false;
    }
  })();

  return initPromise;
};

// Hàm seed dữ liệu mẫu nếu bảng trống
const seedDataIfEmpty = async () => {
  if (!db) {
    console.error('Database chưa được khởi tạo trong seedDataIfEmpty');
    return;
  }

  try {
    // Kiểm tra xem bảng có dữ liệu chưa
    const result = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM todos');
    
    if (result && result.count === 0) {
      console.log('Bảng todos trống, đang seed dữ liệu mẫu...');
      
      const now = Date.now();
      
      // Thêm 2 bản ghi mẫu
      await db.runAsync(
        'INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)',
        ['Học React Native', 0, now]
      );
      
      await db.runAsync(
        'INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)',
        ['Hoàn thành bài kiểm tra', 1, now - 86400000] // 1 ngày trước
      );
      
      console.log('Đã seed 2 bản ghi mẫu thành công!');
    } else {
      console.log(`Bảng todos đã có ${result?.count} bản ghi, bỏ qua seed.`);
    }
  } catch (error) {
    console.error('Lỗi khi seed dữ liệu:', error);
    // Không throw error để app vẫn chạy được
  }
};

// Hàm lấy database instance
export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Database chưa được khởi tạo. Hãy gọi initDatabase() trước.');
  }
  return db;
};

// Export database instance
export default getDatabase;
