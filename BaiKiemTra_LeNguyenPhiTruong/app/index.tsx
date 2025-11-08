import { useState, useEffect } from "react";
import { 
  Text, 
  View, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import getDatabase, { initDatabase } from "./lib/db";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  // Hàm lấy danh sách todos từ SQLite
  const fetchTodos = async () => {
    try {
      setLoading(true);
      // Đảm bảo database đã được khởi tạo trước khi lấy dữ liệu
      await initDatabase();
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

  // Refresh data khi màn hình được focus (quay lại từ màn hình edit)
  useFocusEffect(
    useCallback(() => {
      fetchTodos();
    }, [])
  );

  // Hàm thêm todo mới
  const handleAddTodo = async () => {
    // Validate: kiểm tra title không rỗng
    if (!newTodoTitle.trim()) {
      Alert.alert(
        "Lỗi", 
        "Vui lòng nhập tiêu đề công việc!",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      const db = getDatabase();
      const now = Date.now();
      
      // INSERT todo mới vào SQLite
      await db.runAsync(
        'INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)',
        [newTodoTitle.trim(), 0, now]
      );

      // Đóng modal và reset form
      setModalVisible(false);
      setNewTodoTitle("");

      // Auto refresh list
      await fetchTodos();

      Alert.alert(
        "Thành công", 
        "Đã thêm công việc mới!",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error('Lỗi khi thêm todo:', error);
      Alert.alert(
        "Lỗi", 
        "Không thể thêm công việc. Vui lòng thử lại!",
        [{ text: "OK" }]
      );
    }
  };

  // Hàm hủy thêm mới
  const handleCancelAdd = () => {
    setModalVisible(false);
    setNewTodoTitle("");
  };

  // Hàm mở màn hình chỉnh sửa
  const handleOpenEdit = (todo: Todo) => {
    router.push({
      pathname: "/edit-todo",
      params: {
        id: todo.id,
        title: todo.title,
        done: todo.done,
      },
    });
  };

  // Render mỗi item trong danh sách
  const renderTodoItem = ({ item }: { item: Todo }) => (
    <TouchableOpacity 
      style={styles.todoItem}
      onPress={() => handleOpenEdit(item)}
      activeOpacity={0.7}
    >
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
    </TouchableOpacity>
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

      {/* Nút thêm mới floating */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal thêm mới */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancelAdd}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Thêm công việc mới</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Nhập tiêu đề công việc..."
                value={newTodoTitle}
                onChangeText={setNewTodoTitle}
                autoFocus
                multiline
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCancelAdd}
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleAddTodo}
                >
                  <Text style={styles.saveButtonText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  // Floating add button
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  addButtonText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
    lineHeight: 32,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 50,
    maxHeight: 120,
    marginBottom: 20,
    backgroundColor: '#F9F9F9',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
