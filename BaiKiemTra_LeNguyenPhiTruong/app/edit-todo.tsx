import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import getDatabase from "./lib/db";

export default function EditTodo() {
  const params = useLocalSearchParams();
  const todoId = Number(params.id);
  const [title, setTitle] = useState(params.title as string || "");
  const [done, setDone] = useState(Number(params.done) || 0);
  const [loading, setLoading] = useState(false);

  // Hàm lưu chỉnh sửa
  const handleSave = async () => {
    // Validate: kiểm tra title không rỗng
    if (!title.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tiêu đề công việc!", [{ text: "OK" }]);
      return;
    }

    try {
      setLoading(true);
      const db = getDatabase();

      // UPDATE title và done trong SQLite
      await db.runAsync(
        "UPDATE todos SET title = ?, done = ? WHERE id = ?",
        [title.trim(), done, todoId]
      );

      Alert.alert("Thành công", "Đã cập nhật công việc!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Lỗi khi cập nhật todo:", error);
      Alert.alert("Lỗi", "Không thể cập nhật công việc. Vui lòng thử lại!", [
        { text: "OK" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm toggle trạng thái done
  const handleToggleDone = () => {
    setDone(done === 1 ? 0 : 1);
  };

  // Hàm xóa todo
  const handleDelete = () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa công việc này?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const db = getDatabase();

              // DELETE todo khỏi SQLite
              await db.runAsync("DELETE FROM todos WHERE id = ?", [todoId]);

              Alert.alert("Thành công", "Đã xóa công việc!", [
                {
                  text: "OK",
                  onPress: () => router.back(),
                },
              ]);
            } catch (error) {
              console.error("Lỗi khi xóa todo:", error);
              Alert.alert("Lỗi", "Không thể xóa công việc. Vui lòng thử lại!", [
                { text: "OK" },
              ]);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chỉnh sửa công việc</Text>
            <Text style={styles.headerSubtitle}>
              Cập nhật thông tin công việc của bạn
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tiêu đề công việc</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập tiêu đề công việc..."
                value={title}
                onChangeText={setTitle}
                multiline
                autoFocus
              />
            </View>

            <View style={styles.statusContainer}>
              <Text style={styles.label}>Trạng thái</Text>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  done === 1 ? styles.statusButtonDone : styles.statusButtonPending,
                ]}
                onPress={handleToggleDone}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    done === 1
                      ? styles.statusButtonTextDone
                      : styles.statusButtonTextPending,
                  ]}
                >
                  {done === 1 ? "✓ Hoàn thành" : "○ Chưa xong"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? "Đang lưu..." : "Lưu"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Nút xóa */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={loading}
          >
            <Text style={styles.deleteButtonText}>🗑️ Xóa công việc</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statusContainer: {
    marginBottom: 24,
  },
  statusButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
  },
  statusButtonDone: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
  },
  statusButtonPending: {
    backgroundColor: "#FFF3E0",
    borderColor: "#FF9800",
  },
  statusButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusButtonTextDone: {
    color: "#2E7D32",
  },
  statusButtonTextPending: {
    color: "#E65100",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  deleteButton: {
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    borderWidth: 2,
    borderColor: "#F44336",
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#C62828",
  },
});
