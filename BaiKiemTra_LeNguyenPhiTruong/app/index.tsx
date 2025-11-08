import { useState, useEffect } from "react";
import { Text, View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import getDatabase from "./lib/db";

// Interface cho Todo
interface Todo {
  id: number;
  title: string;
  done: number;
  created_at: number;
}

export default function Index() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // Hàm lấy danh sách todos từ SQLite
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const db = getDatabase();
      const result = await db.getAllAsync<Todo>('SELECT * FROM todos ORDER BY created_at DESC');
      setTodos(result);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách todos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Render mỗi item trong danh sách
  const renderTodoItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoItem}>
      <View style={styles.todoContent}>
        <Text style={[styles.todoTitle, item.done === 1 && styles.todoTitleDone]}>
          {item.title}
        </Text>
        <Text style={styles.todoDate}>
          {new Date(item.created_at).toLocaleDateString('vi-VN')}
        </Text>
      </View>
      <View style={[styles.statusBadge, item.done === 1 ? styles.statusDone : styles.statusPending]}>
        <Text style={styles.statusText}>
          {item.done === 1 ? '✓ Hoàn thành' : '○ Chưa xong'}
        </Text>
      </View>
    </View>
  );

  // Empty state component
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📝</Text>
      <Text style={styles.emptyText}>Chưa có việc nào</Text>
      <Text style={styles.emptySubText}>Thêm việc cần làm để bắt đầu</Text>
    </View>
  );

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh sách công việc</Text>
        <Text style={styles.headerSubtitle}>
          {todos.length > 0 ? `${todos.length} việc` : 'Không có việc nào'}
        </Text>
      </View>

      <FlatList
        data={todos}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={todos.length === 0 ? styles.emptyList : styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  list: {
    padding: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
  todoItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todoContent: {
    flex: 1,
    marginRight: 12,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  todoTitleDone: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  todoDate: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusDone: {
    backgroundColor: '#E8F5E9',
  },
  statusPending: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});
