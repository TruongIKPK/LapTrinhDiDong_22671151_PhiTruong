import { useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';

interface DeletedExpense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  deletedDate: string;
}

export default function DeletedExpensesScreen() {
  const [deletedExpenses, setDeletedExpenses] = useState<DeletedExpense[]>([
    {
      id: 1,
      title: "Café buổi sáng",
      amount: 35000,
      category: "Thực phẩm",
      date: "2024-10-30",
      deletedDate: "2024-11-01"
    },
    {
      id: 2,
      title: "Vé xem phim",
      amount: 120000,
      category: "Giải trí",
      date: "2024-10-29",
      deletedDate: "2024-11-01"
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleRestore = (id: number) => {
    // TODO: Khôi phục chi tiêu
    console.log('Khôi phục chi tiêu có ID:', id);
    setDeletedExpenses(prev => prev.filter(item => item.id !== id));
  };

  const handlePermanentDelete = (id: number) => {
    // TODO: Xóa vĩnh viễn
    console.log('Xóa vĩnh viễn chi tiêu có ID:', id);
    setDeletedExpenses(prev => prev.filter(item => item.id !== id));
  };

  const renderDeletedItem = ({ item }: { item: DeletedExpense }) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseInfo}>
        <Text style={styles.expenseTitle}>{item.title}</Text>
        <Text style={styles.expenseCategory}>{item.category}</Text>
        <Text style={styles.expenseDate}>Ngày tạo: {item.date}</Text>
        <Text style={styles.deletedDate}>Đã xóa: {item.deletedDate}</Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.expenseAmount}>{formatCurrency(item.amount)}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.restoreButton}
            onPress={() => handleRestore(item.id)}
          >
            <Ionicons name="refresh" size={16} color="#28a745" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handlePermanentDelete(item.id)}
          >
            <Ionicons name="trash" size={16} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#495057" />
        </TouchableOpacity>
        <Text style={styles.title}>Chi Tiêu Đã Xóa</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {deletedExpenses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="trash-outline" size={64} color="#adb5bd" />
          <Text style={styles.emptyText}>Không có chi tiêu nào đã xóa</Text>
        </View>
      ) : (
        <FlatList
          data={deletedExpenses}
          renderItem={renderDeletedItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#495057',
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  expenseItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    opacity: 0.8,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 4,
  },
  expenseCategory: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: 12,
    color: '#adb5bd',
    marginBottom: 2,
  },
  deletedDate: {
    fontSize: 12,
    color: '#dc3545',
    fontStyle: 'italic',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6c757d',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  restoreButton: {
    backgroundColor: '#e8f5e8',
    padding: 8,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#fdeaea',
    padding: 8,
    borderRadius: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 16,
  },
});