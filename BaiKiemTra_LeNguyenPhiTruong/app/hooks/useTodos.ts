import { useState, useCallback, useMemo } from "react";
import { Alert } from "react-native";
import getDatabase, { initDatabase } from "../lib/db";

// Interface cho Todo
export interface Todo {
  id: number;
  title: string;
  done: number;
  created_at: number;
}

// Custom hook quản lý todos
export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Hàm lấy danh sách todos từ SQLite
  const loadTodos = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      
      // Đảm bảo database đã được khởi tạo trước khi lấy dữ liệu
      await initDatabase();
      const db = getDatabase();
      const result = await db.getAllAsync<Todo>(
        "SELECT * FROM todos ORDER BY created_at DESC"
      );
      setTodos(result);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách todos:", error);
      Alert.alert(
        "Lỗi",
        "Không thể tải danh sách công việc. Vui lòng thử lại!",
        [{ text: "OK" }]
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  // Hàm refresh (dùng cho pull-to-refresh)
  const refreshTodos = useCallback(async () => {
    try {
      setRefreshing(true);
      await initDatabase();
      const db = getDatabase();
      const result = await db.getAllAsync<Todo>(
        "SELECT * FROM todos ORDER BY created_at DESC"
      );
      setTodos(result);
    } catch (error) {
      console.error("Lỗi khi refresh todos:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Hàm thêm todo mới
  const addTodo = useCallback(
    async (title: string): Promise<boolean> => {
      // Validate: kiểm tra title không rỗng
      if (!title.trim()) {
        Alert.alert("Lỗi", "Vui lòng nhập tiêu đề công việc!", [
          { text: "OK" },
        ]);
        return false;
      }

      try {
        const db = getDatabase();
        const now = Date.now();

        // INSERT todo mới vào SQLite
        await db.runAsync(
          "INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)",
          [title.trim(), 0, now]
        );

        // Auto refresh list (không hiển thị loading)
        await loadTodos(false);

        Alert.alert("Thành công", "Đã thêm công việc mới!", [{ text: "OK" }]);
        return true;
      } catch (error) {
        console.error("Lỗi khi thêm todo:", error);
        Alert.alert("Lỗi", "Không thể thêm công việc. Vui lòng thử lại!", [
          { text: "OK" },
        ]);
        return false;
      }
    },
    [loadTodos]
  );

  // Hàm đồng bộ dữ liệu từ API
  const syncFromAPI = useCallback(async (): Promise<void> => {
    try {
      setSyncing(true);

      // Fetch data từ JSONPlaceholder API
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos"
      );

      if (!response.ok) {
        throw new Error("Không thể kết nối đến API");
      }

      const apiTodos = await response.json();

      // Lấy danh sách todos hiện tại từ database
      const db = getDatabase();
      const existingTodos = await db.getAllAsync<Todo>(
        "SELECT title FROM todos"
      );

      // Tạo Set các title đã tồn tại để check nhanh
      const existingTitles = new Set(
        existingTodos.map((t) => t.title.toLowerCase().trim())
      );

      // Lọc và merge dữ liệu
      let importedCount = 0;
      const now = Date.now();

      // Chỉ lấy 20 todos đầu tiên để demo
      const todosToImport = apiTodos.slice(0, 20);

      for (const apiTodo of todosToImport) {
        const title = apiTodo.title.trim();
        const titleLower = title.toLowerCase();

        // Bỏ qua nếu title đã tồn tại
        if (existingTitles.has(titleLower)) {
          continue;
        }

        // Map completed (boolean) sang done (0/1)
        const done = apiTodo.completed ? 1 : 0;

        // Insert vào SQLite
        await db.runAsync(
          "INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)",
          [title, done, now]
        );

        importedCount++;
      }

      // Refresh danh sách (không hiển thị loading)
      await loadTodos(false);

      // Thông báo thành công
      Alert.alert(
        "Đồng bộ thành công!",
        `Đã nhập ${importedCount} công việc mới từ API.`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Lỗi khi đồng bộ API:", error);
      Alert.alert(
        "Lỗi đồng bộ",
        "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại!",
        [{ text: "OK" }]
      );
    } finally {
      setSyncing(false);
    }
  }, [loadTodos]);

  // Hàm xử lý search
  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  // Lọc todos theo search query (client-side với useMemo)
  const filteredTodos = useMemo(() => {
    if (!searchQuery.trim()) {
      return todos;
    }

    const query = searchQuery.toLowerCase();
    return todos.filter((todo) => todo.title.toLowerCase().includes(query));
  }, [todos, searchQuery]);

  return {
    // States
    todos,
    loading,
    refreshing,
    syncing,
    searchQuery,
    filteredTodos,

    // Actions
    loadTodos,
    refreshTodos,
    addTodo,
    syncFromAPI,
    handleSearch,
  };
};
