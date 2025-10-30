import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO string or formatted
};

export default function HomeScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);

  function formatDate(iso?: string) {
    const d = iso ? new Date(iso) : new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = d.getFullYear();
    return `${dd}/${mm}/${yy}`;
  }

  function addNote() {
    const t = title.trim();
    const c = content.trim();
    if (!t && !c) return;
    const newNote: Note = {
      id: Date.now().toString(),
      title: t || "Không có tiêu đề",
      content: c,
      createdAt: new Date().toISOString(),
    };
    setNotes((s) => [newNote, ...s]);
    setTitle("");
    setContent("");
    Keyboard.dismiss();
  }

  function renderItem({ item }: { item: Note }) {
    return (
      <View style={styles.noteCard}>
        <View style={styles.row}>
          <Text style={styles.noteTitle}>{item.title}</Text>
          <Text style={styles.noteDate}>{formatDate(item.createdAt)}</Text>
        </View>
        {item.content ? (
          <Text style={styles.noteText}>{item.content}</Text>
        ) : null}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Note App</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.titleInput}
          placeholder="Tiêu đề công việc..."
          value={title}
          onChangeText={setTitle}
          returnKeyType="next"
        />
        <TextInput
          style={styles.contentInput}
          placeholder="Nội dung..."
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={3}
          returnKeyType="done"
          onSubmitEditing={addNote}
        />
        <TouchableOpacity style={styles.addButton} onPress={addNote}>
          <Text style={styles.addButtonText}>Thêm</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Chưa có công việc — thêm ngay!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F7FBFF",
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 18,
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5EEF6",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0B4F6C",
  },
  inputContainer: {
    marginTop: 14,
    marginBottom: 10,
  },
  titleInput: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E1E8EE",
    marginBottom: 8,
    fontWeight: "600",
  },
  contentInput: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E1E8EE",
    textAlignVertical: "top",
  },
  addButton: {
    marginTop: 10,
    alignSelf: "flex-end",
    backgroundColor: "#0B7FC7",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  list: {
    paddingTop: 12,
    paddingBottom: 32,
  },
  noteCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E6F0F8",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  noteTitle: {
    color: "#183C4A",
    fontSize: 16,
    fontWeight: "700",
  },
  noteDate: {
    color: "#7A97A7",
    fontSize: 12,
  },
  noteText: {
    color: "#183C4A",
    fontSize: 14,
  },
  empty: {
    marginTop: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#7A97A7",
  },
});
