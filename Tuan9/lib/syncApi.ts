import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from './db';

// Key để lưu API URL
const API_URL_KEY = 'sync_api_url';

// Default API URL (example MockAPI)
const DEFAULT_API_URL = 'https://6721ce4398bbb4d93ca7e8e3.mockapi.io/api/v1/transactions';

// Lấy API URL từ storage
export const getApiUrl = async (): Promise<string> => {
  try {
    const savedUrl = await AsyncStorage.getItem(API_URL_KEY);
    return savedUrl || DEFAULT_API_URL;
  } catch (error) {
    console.error('Error getting API URL:', error);
    return DEFAULT_API_URL;
  }
};

// Lưu API URL vào storage
export const saveApiUrl = async (url: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(API_URL_KEY, url);
  } catch (error) {
    console.error('Error saving API URL:', error);
    throw error;
  }
};

// Interface cho API Transaction (có thể khác với local Transaction)
interface ApiTransaction {
  id?: string;
  title: string;
  amount: number;
  category: string;
  description?: string;
  createdAt: string;
  type: 'income' | 'expense';
  deleted?: number;
  deletedAt?: string;
}

// Chuyển đổi local Transaction sang API Transaction
const convertToApiTransaction = (transaction: Transaction): ApiTransaction => {
  return {
    title: transaction.title,
    amount: transaction.amount,
    category: transaction.category,
    description: transaction.description || '',
    createdAt: transaction.createdAt,
    type: transaction.type,
    deleted: 0, // Chỉ sync các transaction chưa bị xóa
  };
};

// Lấy tất cả data từ API
export const getAllApiTransactions = async (): Promise<ApiTransaction[]> => {
  try {
    const apiUrl = await getApiUrl();
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching API transactions:', error);
    throw error;
  }
};

// Xóa toàn bộ data trong API
export const clearAllApiData = async (): Promise<void> => {
  try {
    const apiUrl = await getApiUrl();
    
    // Lấy tất cả transaction từ API
    const transactions = await getAllApiTransactions();
    
    // Xóa từng transaction
    const deletePromises = transactions.map(async (transaction) => {
      if (transaction.id) {
        const response = await fetch(`${apiUrl}/${transaction.id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to delete transaction ${transaction.id}`);
        }
      }
    });
    
    await Promise.all(deletePromises);
    console.log('All API data cleared successfully');
  } catch (error) {
    console.error('Error clearing API data:', error);
    throw error;
  }
};

// Upload một transaction lên API
export const uploadTransaction = async (transaction: Transaction): Promise<ApiTransaction> => {
  try {
    const apiUrl = await getApiUrl();
    const apiTransaction = convertToApiTransaction(transaction);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiTransaction),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error uploading transaction:', error);
    throw error;
  }
};

// Upload nhiều transactions lên API (batch)
export const uploadTransactions = async (transactions: Transaction[]): Promise<void> => {
  try {
    const uploadPromises = transactions.map(transaction => uploadTransaction(transaction));
    await Promise.all(uploadPromises);
    console.log(`Uploaded ${transactions.length} transactions successfully`);
  } catch (error) {
    console.error('Error uploading transactions:', error);
    throw error;
  }
};

// Đồng bộ toàn bộ: xóa API data và upload local data
export const syncAllData = async (localTransactions: Transaction[]): Promise<void> => {
  try {
    console.log('Starting sync process...');
    
    // Bước 1: Xóa toàn bộ data trong API
    console.log('Clearing API data...');
    await clearAllApiData();
    
    // Bước 2: Upload toàn bộ local data lên API
    console.log('Uploading local data...');
    await uploadTransactions(localTransactions);
    
    console.log('Sync completed successfully');
  } catch (error) {
    console.error('Sync failed:', error);
    throw error;
  }
};

// Kiểm tra kết nối API
export const testApiConnection = async (): Promise<boolean> => {
  try {
    const apiUrl = await getApiUrl();
    const response = await fetch(apiUrl, {
      method: 'GET',
    });
    
    return response.ok;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};

// Validate API URL format
export const validateApiUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};