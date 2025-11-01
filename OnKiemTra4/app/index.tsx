import { useState, useCallback } from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';

interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  description?: string;
  createdAt: string;
}

export default function HomeScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      title: "Mua sắm hàng tháng",
      amount: 500000,
      category: "Thực phẩm",
      description: "Mua thực phẩm cho cả tháng",
      createdAt: "2024-11-01"
    },
    {
      id: 2,
      title: "Xăng xe",
      amount: 200000,
      category: "Giao thông",
      description: "Đổ xăng xe máy",
      createdAt: "2024-11-01"
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  const handleItemPress = (item: Expense) => {
    router.push({
      pathname: '/edit-expense' as any,
      params: {
        id: item.id.toString(),
        title: item.title,
        amount: item.amount.toString(),
        category: item.category,
        description: item.description || '',
        createdAt: item.createdAt
      }
    });
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <TouchableOpacity 
      style={styles.expenseItem}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.expenseInfo}>
        <Text style={styles.expenseTitle}>{item.title}</Text>
        <Text style={styles.expenseCategory}>{item.category}</Text>
        {item.description && (
          <Text style={styles.expenseDescription}>{item.description}</Text>
        )}
        <Text style={styles.expenseDate}>Ngày tạo: {item.createdAt}</Text>
      </View>
      <Text style={styles.expenseAmount}>{formatCurrency(item.amount)}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Expense Tracker</Text>
        <TouchableOpacity 
          style={styles.trashButton}
          onPress={() => router.push('/deleted-expenses')}
        >
          <Ionicons name="trash-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('/add-expense')}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#495057',
  },
  trashButton: {
    padding: 8,
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
    alignItems: 'center',
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
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  expenseCategory: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 2,
  },
  expenseDescription: {
    fontSize: 13,
    color: '#6c757d',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: 12,
    color: '#adb5bd',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc3545',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007bff',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
