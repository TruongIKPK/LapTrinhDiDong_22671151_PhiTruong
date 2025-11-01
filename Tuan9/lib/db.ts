import * as SQLite from 'expo-sqlite';

// Interface cho Transaction
export interface Transaction {
  id?: number;
  title: string;
  amount: number;
  category: string;
  description?: string;
  createdAt: string;
  type: 'income' | 'expense';
}

// Khởi tạo database
let db: SQLite.SQLiteDatabase | null = null;

// Mở kết nối database
export const initDatabase = async (): Promise<void> => {
  try {
    if (db) {
      console.log('Database already initialized');
      return;
    }

    db = await SQLite.openDatabaseAsync('expense_tracker.db');
    
    // Tạo bảng transactions nếu chưa tồn tại
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        createdAt TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('income', 'expense'))
      );
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Helper function to ensure database is initialized
const ensureDbInitialized = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!db) {
    await initDatabase();
  }
  if (!db) {
    throw new Error('Database initialization failed');
  }
  return db;
};

// Thêm transaction mới
export const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<number> => {
  try {
    const database = await ensureDbInitialized();
    const result = await database.runAsync(
      `INSERT INTO transactions (title, amount, category, description, createdAt, type) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        transaction.title,
        transaction.amount,
        transaction.category,
        transaction.description || '',
        transaction.createdAt,
        transaction.type
      ]
    );
    
    console.log('Transaction added successfully with ID:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

// Lấy tất cả transactions
export const getAllTransactions = async (): Promise<Transaction[]> => {
  try {
    const database = await ensureDbInitialized();
    const result = await database.getAllAsync(
      `SELECT * FROM transactions ORDER BY createdAt DESC`
    );
    
    return result as Transaction[];
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
};

// Lấy transactions theo loại
export const getTransactionsByType = async (type: 'income' | 'expense'): Promise<Transaction[]> => {
  try {
    const database = await ensureDbInitialized();
    const result = await database.getAllAsync(
      `SELECT * FROM transactions WHERE type = ? ORDER BY createdAt DESC`,
      [type]
    );
    
    return result as Transaction[];
  } catch (error) {
    console.error('Error getting transactions by type:', error);
    throw error;
  }
};

// Xóa transaction
export const deleteTransaction = async (id: number): Promise<void> => {
  try {
    const database = await ensureDbInitialized();
    await database.runAsync(`DELETE FROM transactions WHERE id = ?`, [id]);
    console.log('Transaction deleted successfully');
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

// Cập nhật transaction
export const updateTransaction = async (id: number, transaction: Omit<Transaction, 'id'>): Promise<void> => {
  try {
    const database = await ensureDbInitialized();
    await database.runAsync(
      `UPDATE transactions 
       SET title = ?, amount = ?, category = ?, description = ?, createdAt = ?, type = ?
       WHERE id = ?`,
      [
        transaction.title,
        transaction.amount,
        transaction.category,
        transaction.description || '',
        transaction.createdAt,
        transaction.type,
        id
      ]
    );
    
    console.log('Transaction updated successfully');
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

// Lấy tổng thu nhập
export const getTotalIncome = async (): Promise<number> => {
  try {
    const database = await ensureDbInitialized();
    const result = await database.getFirstAsync(
      `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'income'`
    ) as any;
    
    return result?.total || 0;
  } catch (error) {
    console.error('Error getting total income:', error);
    return 0;
  }
};

// Lấy tổng chi tiêu
export const getTotalExpense = async (): Promise<number> => {
  try {
    const database = await ensureDbInitialized();
    const result = await database.getFirstAsync(
      `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'expense'`
    ) as any;
    
    return result?.total || 0;
  } catch (error) {
    console.error('Error getting total expense:', error);
    return 0;
  }
};

// Clear tất cả transactions (để test)
export const clearAllTransactions = async (): Promise<void> => {
  try {
    const database = await ensureDbInitialized();
    await database.runAsync(`DELETE FROM transactions`);
    console.log('All transactions cleared');
  } catch (error) {
    console.error('Error clearing transactions:', error);
    throw error;
  }
};