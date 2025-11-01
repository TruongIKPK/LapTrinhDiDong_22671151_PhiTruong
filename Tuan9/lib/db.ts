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
let isInitializing = false;

// Mở kết nối database
export const initDatabase = async (): Promise<void> => {
  try {
    if (db) {
      console.log('Database already initialized');
      return;
    }

    if (isInitializing) {
      console.log('Database initialization already in progress');
      // Wait for initialization to complete
      while (isInitializing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }

    isInitializing = true;
    console.log('Starting database initialization...');

    db = await SQLite.openDatabaseAsync('expense_tracker.db');
    
    if (!db) {
      throw new Error('Failed to open database');
    }
    
    // Kiểm tra schema hiện tại để hỗ trợ migration nếu cần
    const tableInfo = await db.getAllAsync(`PRAGMA table_info(transactions)`);

    if (!tableInfo || tableInfo.length === 0) {
      // Table chưa tồn tại, tạo lại với đầy đủ trường
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          amount REAL NOT NULL,
          category TEXT NOT NULL,
          description TEXT,
          createdAt TEXT NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
          deleted INTEGER DEFAULT 0,
          deletedAt TEXT
        );
      `);
    } else {
      // Nếu bảng đã tồn tại, đảm bảo các cột soft-delete có mặt (migration)
      const columnNames = tableInfo.map((c: any) => c.name);
      if (!columnNames.includes('deleted')) {
        await db.execAsync(`ALTER TABLE transactions ADD COLUMN deleted INTEGER DEFAULT 0`);
      }
      if (!columnNames.includes('deletedAt')) {
        await db.execAsync(`ALTER TABLE transactions ADD COLUMN deletedAt TEXT`);
      }
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    db = null; // Reset on error
    throw error;
  } finally {
    isInitializing = false;
  }
};

// Helper function to ensure database is initialized
const ensureDbInitialized = async (): Promise<SQLite.SQLiteDatabase> => {
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      if (!db) {
        console.log(`Database not initialized, attempting initialization (attempt ${attempts + 1}/${maxAttempts})`);
        await initDatabase();
      }
      
      if (!db) {
        throw new Error('Database initialization failed - db is still null');
      }

      // Test the database connection
      await db.getFirstAsync('SELECT 1');
      
      return db;
    } catch (error) {
      attempts++;
      console.error(`Database initialization attempt ${attempts} failed:`, error);
      
      // Reset the database on error
      db = null;
      
      if (attempts >= maxAttempts) {
        throw new Error(`Database initialization failed after ${maxAttempts} attempts: ${error}`);
      }
      
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  throw new Error('Should not reach here');
};

// Thêm transaction mới
export const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<number> => {
  try {
    const database = await ensureDbInitialized();
    const result = await database.runAsync(
      `INSERT INTO transactions (title, amount, category, description, createdAt, type, deleted) 
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
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
    // Only return not-deleted items
    const result = await database.getAllAsync(
      `SELECT * FROM transactions WHERE deleted = 0 ORDER BY createdAt DESC`
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
      `SELECT * FROM transactions WHERE type = ? AND deleted = 0 ORDER BY createdAt DESC`,
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

// Lấy các transactions đã bị xóa (thùng rác)
export const getDeletedTransactions = async (): Promise<Transaction[]> => {
  try {
    const database = await ensureDbInitialized();
    const result = await database.getAllAsync(
      `SELECT * FROM transactions WHERE deleted = 1 ORDER BY deletedAt DESC`
    );
    return result as Transaction[];
  } catch (error) {
    console.error('Error getting deleted transactions:', error);
    throw error;
  }
};

// Soft-delete transaction: đánh dấu deleted = 1 và lưu deletedAt
export const softDeleteTransaction = async (id: number): Promise<void> => {
  try {
    const database = await ensureDbInitialized();
    const deletedAt = new Date().toISOString();
    await database.runAsync(
      `UPDATE transactions SET deleted = 1, deletedAt = ? WHERE id = ?`,
      [deletedAt, id]
    );
    console.log('Transaction soft-deleted:', id);
  } catch (error) {
    console.error('Error soft-deleting transaction:', error);
    throw error;
  }
};

// Restore transaction from trash
export const restoreTransaction = async (id: number): Promise<void> => {
  try {
    const database = await ensureDbInitialized();
    await database.runAsync(
      `UPDATE transactions SET deleted = 0, deletedAt = NULL WHERE id = ?`,
      [id]
    );
    console.log('Transaction restored:', id);
  } catch (error) {
    console.error('Error restoring transaction:', error);
    throw error;
  }
};

// Interface cho dữ liệu thống kê theo tháng
export interface MonthlyStatistics {
  month: string;
  income: number;
  expense: number;
  net: number;
  transactionCount: number;
}

// Lấy thống kê theo tháng cho một năm cụ thể
export const getMonthlyStatistics = async (year: number): Promise<MonthlyStatistics[]> => {
  try {
    const database = await ensureDbInitialized();
    
    // Tạo array cho 12 tháng
    const monthlyStats: MonthlyStatistics[] = [];
    
    for (let month = 1; month <= 12; month++) {
      const monthStr = month.toString().padStart(2, '0');
      const startDate = `${year}-${monthStr}-01`;
      const endDate = `${year}-${monthStr}-31`;
      
      // Lấy tổng thu nhập
      const incomeResult = await database.getFirstAsync(
        `SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
         WHERE type = 'income' AND deleted = 0 
         AND createdAt >= ? AND createdAt <= ?`,
        [startDate, endDate]
      ) as any;
      
      // Lấy tổng chi tiêu
      const expenseResult = await database.getFirstAsync(
        `SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
         WHERE type = 'expense' AND deleted = 0 
         AND createdAt >= ? AND createdAt <= ?`,
        [startDate, endDate]
      ) as any;
      
      // Lấy số lượng giao dịch
      const countResult = await database.getFirstAsync(
        `SELECT COUNT(*) as count FROM transactions 
         WHERE deleted = 0 AND createdAt >= ? AND createdAt <= ?`,
        [startDate, endDate]
      ) as any;
      
      const income = incomeResult?.total || 0;
      const expense = expenseResult?.total || 0;
      
      monthlyStats.push({
        month: month.toString(),
        income: income,
        expense: expense,
        net: income - expense,
        transactionCount: countResult?.count || 0
      });
    }
    
    return monthlyStats;
  } catch (error) {
    console.error('Error getting monthly statistics:', error);
    throw error;
  }
};

// Lấy thống kê tổng quan
export const getOverallStatistics = async (): Promise<{
  totalIncome: number;
  totalExpense: number;
  totalTransactions: number;
  currentMonthIncome: number;
  currentMonthExpense: number;
}> => {
  try {
    const database = await ensureDbInitialized();
    
    // Lấy tổng thu nhập
    const totalIncomeResult = await database.getFirstAsync(
      `SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
       WHERE type = 'income' AND deleted = 0`
    ) as any;
    
    // Lấy tổng chi tiêu
    const totalExpenseResult = await database.getFirstAsync(
      `SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
       WHERE type = 'expense' AND deleted = 0`
    ) as any;
    
    // Lấy tổng số giao dịch
    const totalTransactionsResult = await database.getFirstAsync(
      `SELECT COUNT(*) as count FROM transactions WHERE deleted = 0`
    ) as any;
    
    // Lấy thu nhập tháng hiện tại
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const startDate = `${currentYear}-${currentMonth}-01`;
    const endDate = `${currentYear}-${currentMonth}-31`;
    
    const currentMonthIncomeResult = await database.getFirstAsync(
      `SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
       WHERE type = 'income' AND deleted = 0 
       AND createdAt >= ? AND createdAt <= ?`,
      [startDate, endDate]
    ) as any;
    
    const currentMonthExpenseResult = await database.getFirstAsync(
      `SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
       WHERE type = 'expense' AND deleted = 0 
       AND createdAt >= ? AND createdAt <= ?`,
      [startDate, endDate]
    ) as any;
    
    return {
      totalIncome: totalIncomeResult?.total || 0,
      totalExpense: totalExpenseResult?.total || 0,
      totalTransactions: totalTransactionsResult?.count || 0,
      currentMonthIncome: currentMonthIncomeResult?.total || 0,
      currentMonthExpense: currentMonthExpenseResult?.total || 0,
    };
  } catch (error) {
    console.error('Error getting overall statistics:', error);
    throw error;
  }
};