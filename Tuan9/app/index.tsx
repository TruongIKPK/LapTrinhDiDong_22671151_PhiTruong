import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from 'expo-router';
import { initDatabase, getAllTransactions, deleteTransaction, Transaction as DBTransaction } from '../lib/db';

// Interface cho Transaction (Thu-Chi) - sử dụng từ db.ts
interface Transaction extends DBTransaction {}

export default function ExpenseTracker() {
  const router = useRouter();
  
  // State để lưu danh sách giao dịch Thu-Chi từ database
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Khởi tạo database và load dữ liệu
  useEffect(() => {
    initializeApp();
  }, []);

  // Load lại dữ liệu khi focus vào screen
  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  const initializeApp = async () => {
    try {
      console.log('Initializing app...');
      await initDatabase();
      console.log('Database initialized successfully');
      await loadTransactions();
    } catch (error) {
      console.error('Error initializing app:', error);
      // Show user-friendly error message
      Alert.alert(
        'Lỗi khởi tạo',
        'Không thể khởi tạo cơ sở dữ liệu. Vui lòng khởi động lại ứng dụng.',
        [
          {
            text: 'Thử lại',
            onPress: () => initializeApp(),
          }
        ]
      );
    }
  };

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      console.log('Loading transactions...');
      const dbTransactions = await getAllTransactions();
      console.log('Loaded transactions:', dbTransactions.length);
      setTransactions(dbTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      // Set empty array on error to prevent crashes
      setTransactions([]);
      Alert.alert(
        'Lỗi tải dữ liệu',
        'Không thể tải danh sách giao dịch. Vui lòng thử lại.',
        [
          {
            text: 'Thử lại',
            onPress: () => loadTransactions(),
          },
          {
            text: 'Bỏ qua',
            style: 'cancel'
          }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý xóa transaction
  const handleDeleteTransaction = async (id: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa giao dịch này?',
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(id);
              Alert.alert('Thành công', 'Giao dịch đã được xóa thành công!');
              loadTransactions(); // Reload list
            } catch (error) {
              console.error('Error deleting transaction:', error);
              Alert.alert('Lỗi', 'Có lỗi xảy ra khi xóa giao dịch');
            }
          }
        }
      ]
    );
  };

  // Tính tổng thu và chi
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netAmount = totalIncome - totalExpense;

  // Format số tiền
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  // Render item giao dịch Thu-Chi
  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <View style={styles.transactionHeader}>
          <View style={styles.titleSection}>
            <Text style={styles.transactionTitle}>{item.title}</Text>
            <View style={styles.typeContainer}>
              <View style={[
                styles.typeBadge, 
                item.type === 'income' ? styles.incomeBadge : styles.expenseBadge
              ]}>
                <Ionicons 
                  name={item.type === 'income' ? 'arrow-down' : 'arrow-up'} 
                  size={12} 
                  color="#fff" 
                />
                <Text style={styles.typeText}>
                  {item.type === 'income' ? 'Thu' : 'Chi'}
                </Text>
              </View>
            </View>
          </View>
          <Text style={[
            styles.transactionAmount,
            item.type === 'income' ? styles.incomeAmount : styles.expenseAmount
          ]}>
            {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
          </Text>
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionCategory}>
            <Ionicons name="pricetag" size={14} color="#6c757d" /> {item.category}
          </Text>
          <Text style={styles.transactionDate}>
            <Ionicons name="calendar" size={14} color="#6c757d" /> {item.createdAt}
          </Text>
        </View>
        {item.description && (
          <Text style={styles.transactionDescription}>{item.description}</Text>
        )}
        
        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push(`./edit-transaction?id=${item.id}`)}
          >
            <Ionicons name="create-outline" size={16} color="#007bff" />
            <Text style={styles.editButtonText}>Sửa</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteTransaction(item.id!)}
          >
            <Ionicons name="trash-outline" size={16} color="#dc3545" />
            <Text style={styles.deleteButtonText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>EXPENSE TRACKER</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Số dư hiện tại</Text>
              <Text style={[
                styles.summaryAmount,
                netAmount >= 0 ? styles.positiveAmount : styles.negativeAmount
              ]}>
                {formatCurrency(Math.abs(netAmount))}
              </Text>
            </View>
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{formatCurrency(totalIncome)}</Text>
                <Text style={styles.statLabel}>Tổng Thu</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{formatCurrency(totalExpense)}</Text>
                <Text style={styles.statLabel}>Tổng Chi</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('./add-transaction')}
          >
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.actionText}>Thêm chi tiêu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
            <Ionicons name="pie-chart" size={24} color="#007bff" />
            <Text style={[styles.actionText, styles.secondaryText]}>Thống kê</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={transactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            showsVerticalScrollIndicator={false}
            style={styles.transactionList}
          />
        </View>

        {/* Floating Add Button */}
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={() => router.push('./add-transaction')}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    letterSpacing: 1,
  },
  menuButton: {
    padding: 5,
  },
  summaryCard: {
    margin: 20,
    backgroundColor: '#007bff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  summaryContent: {
    padding: 20,
  },
  summaryItem: {
    marginBottom: 15,
  },
  summaryLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 5,
  },
  summaryAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  positiveAmount: {
    color: '#28a745',
  },
  negativeAmount: {
    color: '#dc3545',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#fff',
    opacity: 0.3,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007bff',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryText: {
    color: '#007bff',
  },
  recentSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '500',
  },
  expenseList: {
    flex: 1,
  },
  transactionList: {
    flex: 1,
  },
  transactionItem: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionInfo: {
    padding: 16,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleSection: {
    flex: 1,
    marginRight: 10,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  typeContainer: {
    marginTop: 2,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  incomeBadge: {
    backgroundColor: '#28a745',
  },
  expenseBadge: {
    backgroundColor: '#dc3545',
  },
  typeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  incomeAmount: {
    color: '#28a745',
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#6c757d',
    flex: 1,
  },
  transactionDate: {
    fontSize: 14,
    color: '#6c757d',
  },
  transactionDescription: {
    fontSize: 13,
    color: '#6c757d',
    fontStyle: 'italic',
    marginTop: 4,
  },
  expenseItem: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expenseInfo: {
    padding: 16,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    flex: 1,
    marginRight: 10,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc3545',
  },
  expenseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  expenseCategory: {
    fontSize: 14,
    color: '#6c757d',
    flex: 1,
  },
  expenseDate: {
    fontSize: 14,
    color: '#6c757d',
  },
  expenseDescription: {
    fontSize: 13,
    color: '#6c757d',
    fontStyle: 'italic',
    marginTop: 4,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3f2fd',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  editButtonText: {
    color: '#007bff',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffebee',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  deleteButtonText: {
    color: '#dc3545',
    fontSize: 12,
    fontWeight: '600',
  },
});
