import React, { useState, useEffect } from 'react';
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import * as SQLite from 'expo-sqlite';

export default function TaskList() {

  return (
    <SafeAreaView style={styles.container}>
      <SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded}>
        <Main />
      </SQLiteProvider>
    </SafeAreaView>
  );
}

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export function Main() {

  const params = useLocalSearchParams();
  const userName = params.userName as string || 'Truong';

  const db = useSQLiteContext();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function setup() {
      setLoading(true);
      await migrateDbIfNeeded(db);
      const result = await db.getAllAsync<Task>('SELECT * FROM todos');
      setTasks(result);
      setLoading(false);
    }
    setup();
  }, []);

  const getAllTodos = async (): Promise<Task[]> => {
    const todos = await db.getAllAsync<Task>('SELECT * FROM todos');
    return todos;
  }

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const refreshTasks = async () => {
    try {
      setRefreshing(true);
      const todos = await getAllTodos();
      setTasks(todos);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể làm mới danh sách');
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      refreshTasks();
    }, [])
  );

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        style={[styles.checkbox, item.completed && styles.checkedBox]}
        onPress={() => toggleTask(item.id)}
      >
        {item.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
      <Text style={[styles.taskText, item.completed && styles.completedTask]}>
        {item.title}
      </Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {}}
        activeOpacity={0.7}
      >
        <Text style={styles.editIcon}>Sửa</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          deleteTask(item.id);
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.editIcon}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#00BCD4" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </SafeAreaView>
    );
  }

  const handleAddJob = () => {
    router.push({ pathname: '/add-job', params: { userName } });
  };

  const deleteTask = async (id: number) => { // sửa lại kiểu id
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa công việc này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.runAsync('DELETE FROM todos WHERE id = ?', id);
              setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
            } catch (error) {
              console.error('Delete error:', error);
            }
          }
        }
      ]
    );
  };

  const toggleTask = async (id: number) => { // sửa lại kiểu id
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    try {
      await db.runAsync('UPDATE todos SET completed = ? WHERE id = ?', !task.completed ? 1 : 0, id);
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái công việc');
    }
  };

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/40' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.greeting}>Hi {userName}</Text>
            <Text style={styles.subGreeting}>Have a great day ahead</Text>
          </View>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={item => item.id.toString()}
        style={styles.taskList}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={refreshTasks}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có công việc nào</Text>
            <Text style={styles.emptySubText}>Thêm công việc mới bằng cách nhấn nút +</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddJob}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  
  const versionRow = await db.getFirstAsync<any>('PRAGMA user_version');
  console.log('PRAGMA user_version result:', versionRow);
  const currentDbVersion = versionRow.user_version ?? versionRow['user_version(0)'] ?? 0;

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  
  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0
      );
    `);
    await db.runAsync('INSERT INTO todos (title, completed) VALUES (?, ?)', 'hello', 0);
    await db.runAsync('INSERT INTO todos (title, completed) VALUES (?, ?)', 'world', 0);
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  backButton: {
    fontSize: 24,
    marginRight: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#ddd',
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subGreeting: {
    fontSize: 12,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#00C851',
    borderRadius: 4,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#00C851',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  editButton: {
    padding: 5,
  },
  editIcon: {
    fontSize: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00BCD4',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
});