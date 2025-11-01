import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, ScrollView, Alert, TextInput, RefreshControl, Modal, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from 'expo-router';
import { initDatabase, getAllTransactions, softDeleteTransaction, Transaction as DBTransaction } from '../lib/db';
import { syncAllData, testApiConnection } from '../lib/syncApi';

// Interface cho Transaction (Thu-Chi) - sử dụng từ db.ts
interface Transaction extends DBTransaction {}

export default function ExpenseTracker() {
  const router = useRouter();
  
  // State để lưu danh sách giao dịch Thu-Chi từ database
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'income' | 'expense'>('all');

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

  const loadTransactions = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      console.log('Loading transactions...');
      const dbTransactions = await getAllTransactions();
      console.log('Loaded transactions:', dbTransactions.length);
      setTransactions(dbTransactions);
      // Apply current filters to newly loaded data
      applyFiltersToData(dbTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      // Set empty array on error to prevent crashes
      setTransactions([]);
      setFilteredTransactions([]);
      if (!isRefresh) {
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
      }
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  // Xử lý xóa (soft-delete) transaction
  const handleDeleteTransaction = async (id: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn chuyển giao dịch này vào thùng rác?',
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
              await softDeleteTransaction(id);
              Alert.alert('Thành công', 'Giao dịch đã được chuyển vào thùng rác');
              loadTransactions(); // Reload list
            } catch (error) {
              console.error('Error soft-deleting transaction:', error);
              Alert.alert('Lỗi', 'Có lỗi xảy ra khi xóa giao dịch');
            }
          }
        }
      ]
    );
  };

  // Xử lý pull to refresh
  const onRefresh = useCallback(() => {
    loadTransactions(true);
  }, []);

  // Xử lý tìm kiếm và lọc
  const applyFilters = (searchTerm: string = searchQuery, filterType: 'all' | 'income' | 'expense' = selectedFilter) => {
    let filtered = transactions;

    // Lọc theo loại giao dịch
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredTransactions(filtered);
  };

  // Helper function để apply filters với data cụ thể
  const applyFiltersToData = (data: Transaction[]) => {
    let filtered = data;

    // Lọc theo loại giao dịch
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(t => t.type === selectedFilter);
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, selectedFilter);
  };

  const handleFilterChange = (filter: 'all' | 'income' | 'expense') => {
    setSelectedFilter(filter);
    applyFilters(searchQuery, filter);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchQuery('');
      applyFilters('', selectedFilter);
    }
  };  // Xử lý đồng bộ dữ liệu
  const handleSync = async () => {
    // Kiểm tra kết nối API trước
    const isConnected = await testApiConnection();
    if (!isConnected) {
      Alert.alert(
        'Lỗi kết nối',
        'Không thể kết nối đến API. Vui lòng kiểm tra cấu hình API trong màn hình cài đặt.',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Cài đặt', onPress: () => router.push('./settings') }
        ]
      );
      return;
    }

    Alert.alert(
      'Xác nhận đồng bộ',
      'Thao tác này sẽ xóa toàn bộ dữ liệu trên API và upload lại tất cả giao dịch từ thiết bị. Bạn có chắc chắn?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đồng bộ', 
          style: 'destructive',
          onPress: performSync 
        }
      ]
    );
  };

  const performSync = async () => {
    setIsSyncing(true);
    try {
      // Lấy tất cả giao dịch local (chỉ những giao dịch chưa bị xóa)
      const localTransactions = transactions;
      
      await syncAllData(localTransactions);
      
      Alert.alert(
        'Thành công',
        `Đã đồng bộ thành công ${localTransactions.length} giao dịch lên API!`
      );
    } catch (error) {
      console.error('Sync failed:', error);
      Alert.alert(
        'Lỗi đồng bộ',
        'Không thể đồng bộ dữ liệu. Vui lòng thử lại sau.'
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  // Tính tổng thu và chi
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netAmount = totalIncome - totalExpense;

  // Format số tiền
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  // Render item giao dịch Thu-Chi
  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      activeOpacity={0.9}
      onLongPress={() => {
        // show delete menu
        Alert.alert(
          'Tùy chọn',
          undefined,
          [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Xem thùng rác', onPress: () => router.push('./trash') },
            { text: 'Xóa', style: 'destructive', onPress: () => handleDeleteTransaction(item.id!) }
          ]
        );
      }}
    >
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
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>EXPENSE TRACKER</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerActionButton} onPress={toggleSearch}>
              <Ionicons name={isSearchVisible ? "close" : "search"} size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerActionButton} onPress={toggleMenu}>
              <Ionicons name="ellipsis-vertical" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        {isSearchVisible && (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#6c757d" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm theo tiêu đề, danh mục, mô tả..."
                placeholderTextColor="#6c757d"
                value={searchQuery}
                onChangeText={handleSearch}
                autoFocus={true}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={20} color="#6c757d" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Filter Bar */}
        <View style={styles.filterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
          >
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === 'all' && styles.filterButtonActive
              ]}
              onPress={() => handleFilterChange('all')}
            >
              <Text style={[
                styles.filterButtonText,
                selectedFilter === 'all' && styles.filterButtonTextActive
              ]}>
                Tất cả
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === 'income' && styles.filterButtonActive,
                selectedFilter === 'income' && styles.incomeFilterActive
              ]}
              onPress={() => handleFilterChange('income')}
            >
              <Ionicons 
                name="arrow-down" 
                size={16} 
                color={selectedFilter === 'income' ? '#fff' : '#28a745'} 
              />
              <Text style={[
                styles.filterButtonText,
                selectedFilter === 'income' && styles.filterButtonTextActive,
                selectedFilter !== 'income' && styles.incomeFilterText
              ]}>
                Thu
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === 'expense' && styles.filterButtonActive,
                selectedFilter === 'expense' && styles.expenseFilterActive
              ]}
              onPress={() => handleFilterChange('expense')}
            >
              <Ionicons 
                name="arrow-up" 
                size={16} 
                color={selectedFilter === 'expense' ? '#fff' : '#dc3545'} 
              />
              <Text style={[
                styles.filterButtonText,
                selectedFilter === 'expense' && styles.filterButtonTextActive,
                selectedFilter !== 'expense' && styles.expenseFilterText
              ]}>
                Chi
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Menu Modal */}
        <Modal
          visible={isMenuVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsMenuVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsMenuVisible(false)}
          >
            <View style={styles.menuContainer}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setIsMenuVisible(false);
                  router.push('./statistics');
                }}
              >
                <Ionicons name="bar-chart" size={20} color="#007bff" />
                <Text style={styles.menuItemText}>Thống kê</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setIsMenuVisible(false);
                  handleSync();
                }}
              >
                <Ionicons name="sync" size={20} color="#007bff" />
                <Text style={styles.menuItemText}>Đồng bộ dữ liệu</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setIsMenuVisible(false);
                  router.push('./settings');
                }}
              >
                <Ionicons name="settings" size={20} color="#6c757d" />
                <Text style={styles.menuItemText}>Cài đặt API</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setIsMenuVisible(false);
                  router.push('./trash');
                }}
              >
                <Ionicons name="trash" size={20} color="#dc3545" />
                <Text style={styles.menuItemText}>Thùng rác</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Sync Progress Modal */}
        <Modal
          visible={isSyncing}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.syncModalOverlay}>
            <View style={styles.syncContainer}>
              <ActivityIndicator size="large" color="#007bff" />
              <Text style={styles.syncText}>Đang đồng bộ dữ liệu...</Text>
              <Text style={styles.syncSubText}>Vui lòng không tắt ứng dụng</Text>
            </View>
          </View>
        </Modal>

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
          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={() => router.push('./trash')}>
            <Ionicons name="trash" size={24} color="#007bff" />
            <Text style={[styles.actionText, styles.secondaryText]}>Thùng Rác</Text>
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
            data={filteredTransactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            showsVerticalScrollIndicator={false}
            style={styles.transactionList}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={['#007bff']}
                tintColor="#007bff"
                title="Đang tải..."
                titleColor="#6c757d"
              />
            }
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerActionButton: {
    padding: 5,
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
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#212529',
  },
  clearButton: {
    marginLeft: 8,
  },
  // Menu and Sync styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 70,
    paddingRight: 20,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  syncModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  syncText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginTop: 16,
    textAlign: 'center',
  },
  syncSubText: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 8,
    textAlign: 'center',
  },
  // Filter styles
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  filterScrollContent: {
    paddingHorizontal: 4,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  incomeFilterActive: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  expenseFilterActive: {
    backgroundColor: '#dc3545',
    borderColor: '#dc3545',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  incomeFilterText: {
    color: '#28a745',
  },
  expenseFilterText: {
    color: '#dc3545',
  },
});
