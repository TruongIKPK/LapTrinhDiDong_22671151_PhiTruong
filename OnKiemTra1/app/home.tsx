import { useFocusEffect, useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { getTasks, addTask, deleteTask, updateTask, toggleTask } from "./db";

export default function HomeScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();
  const [tasks, setTasks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [editingTask, setEditingTask] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const loadTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (task: any) => {
    setEditingTask(task);
    setEditTitle(task.title);
  };

  const saveEdit = async () => {
    if (!editTitle.trim()) {
      Alert.alert("Error", "Title cannot be empty");
      return;
    }
    await updateTask(editingTask.id, editTitle);
    setEditingTask(null);
    loadTasks();
  };

  const saveNewTask = async () => {
    if (!newTitle.trim()) {
      Alert.alert("Error", "Task cannot be empty");
      return;
    }
    await addTask(newTitle);
    setNewTitle("");
    setAdding(false);
    loadTasks();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greet}>Hi {name || "User"} 👋</Text>
      <Text style={styles.subtitle}>Have a great day ahead</Text>

      <TextInput
        placeholder="Search tasks..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                toggleTask(item.id, !item.completed).then(loadTasks);
              }}
            >
              <Text
                style={[
                  styles.taskText,
                  item.completed && {
                    textDecorationLine: "line-through",
                    color: "#999",
                  },
                ]}
              >
                {item.completed ? "✅" : "⬜"} {item.title}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => startEdit(item)}
              style={{ marginRight: 10 }}
            >
              <Text style={{ color: "#007bff" }}>✏️</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => deleteTask(item.id).then(loadTasks)}
            >
              <Text style={{ color: "red" }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* ➕ Nút thêm mới */}
      <TouchableOpacity style={styles.addBtn} onPress={() => setAdding(true)}>
        <Text style={styles.addText}>＋</Text>
      </TouchableOpacity>

      {/* ✏️ Modal thêm task */}
      <Modal visible={adding} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>New Task</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter task title"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#00bcd4" }]}
                onPress={saveNewTask}
              >
                <Text style={styles.btnText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#ccc" }]}
                onPress={() => setAdding(false)}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ✏️ Modal chỉnh sửa */}
      <Modal visible={!!editingTask} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Edit Task</Text>
            <TextInput
              style={styles.input}
              value={editTitle}
              onChangeText={setEditTitle}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#00bcd4" }]}
                onPress={saveEdit}
              >
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#ccc" }]}
                onPress={() => setEditingTask(null)}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  greet: { fontSize: 22, fontWeight: "bold", marginTop: 40 },
  subtitle: { color: "#666", marginBottom: 20 },
  search: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10 },
  task: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f3f3f3",
    marginVertical: 5,
  },
  taskText: { fontSize: 16 },
  addBtn: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#00bcd4",
    borderRadius: 50,
    padding: 20,
  },
  addText: { color: "#fff", fontSize: 28 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, marginTop: 10 },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  btn: { padding: 10, borderRadius: 8, width: "45%", alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "bold" },
});