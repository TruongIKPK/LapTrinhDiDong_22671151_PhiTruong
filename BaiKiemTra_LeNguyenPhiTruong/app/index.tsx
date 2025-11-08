import { useState, useEffect, useCallback } from "react";
import { 
  Text, 
  View, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  RefreshControl
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useTodos, Todo } from "./hooks/useTodos";

export default function Index() {
  // Sử dụng custom hook
  const {
    loading,
    refreshing,
    syncing,
    searchQuery,
    filteredTodos,
    loadTodos,
    refreshTodos,
    addTodo,
    syncFromAPI,
    handleSearch,
  } = useTodos();

  // State cho modal thêm mới
  const [modalVisible, setModalVisible] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  // Load dữ liệu khi component mount
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // Refresh data khi màn hình được focus (quay lại từ màn hình edit)
  useFocusEffect(
    useCallback(() => {
      loadTodos(false); // Không hiển thị loading khi quay lại
    }, [loadTodos])
  );

  // State cho modal thêm mới
  const [modalVisible, setModalVisible] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  
  // State để track loading khi thêm
  const [addingTodo, setAddingTodo] = useState(false);

  // Wrapper function để handle add với loading state
  const handleAddTodoWithLoading = useCallback(async () => {
    if (addingTodo) return; // Prevent double-click
    
    setAddingTodo(true);
    const success = await addTodo(newTodoTitle);
    if (success) {
      setModalVisible(false);
      setNewTodoTitle("");
    }
    setAddingTodo(false);
  }, [addingTodo, newTodoTitle, addTodo]);

  // Hàm hủy thêm mới
  const handleCancelAdd = useCallback(() => {
    setModalVisible(false);
    setNewTodoTitle("");
  }, []);

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

  // Render mỗi item trong danh sách - wrap với useCallback
  const renderTodoItem = useCallback(({ item }: { item: Todo }) => (
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
  ), []);

  // Empty state component
  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>📝</Text>
      </View>
      <Text style={styles.emptyText}>
        {searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có việc nào'}
      </Text>
      <Text style={styles.emptySubText}>
        {searchQuery 
          ? 'Thử tìm kiếm với từ khóa khác' 
          : 'Nhấn vào nút + để thêm việc cần làm'}
      </Text>
      {!searchQuery && (
        <TouchableOpacity 
          style={styles.emptyActionButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.emptyActionButtonText}>+ Thêm việc đầu tiên</Text>
        </TouchableOpacity>
      )}
    </View>
  ), [searchQuery]);

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
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Danh sách công việc</Text>
            <Text style={styles.headerSubtitle}>
              {filteredTodos.length > 0 ? `${filteredTodos.length} việc` : 'Không có việc nào'}
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.syncButton, syncing && styles.syncButtonDisabled]}
            onPress={syncFromAPI}
            disabled={syncing}
          >
            <Text style={styles.syncButtonText}>
              {syncing ? '⏳' : '🔄'} {syncing ? 'Đang đồng bộ...' : 'API'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Box */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm công việc..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            onPress={() => handleSearch("")}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Results count */}
      {searchQuery.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            Tìm thấy {filteredTodos.length} kết quả
          </Text>
        </View>
      )}

      <FlatList
        data={filteredTodos}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={filteredTodos.length === 0 ? styles.emptyList : styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshTodos}
            colors={["#007AFF"]}
            tintColor="#007AFF"
          />
        }
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
                  disabled={addingTodo}
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.modalButton, 
                    styles.saveButton,
                    (addingTodo || !newTodoTitle.trim()) && styles.saveButtonDisabled
                  ]}
                  onPress={handleAddTodoWithLoading}
                  disabled={addingTodo || !newTodoTitle.trim()}
                >
                  <Text style={styles.saveButtonText}>
                    {addingTodo ? 'Đang lưu...' : 'Lưu'}
                  </Text>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  syncButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  syncButtonDisabled: {
    opacity: 0.6,
  },
  syncButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 18,
    color: '#999',
    fontWeight: 'bold',
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
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
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 64,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyActionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyActionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
