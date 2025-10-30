import React, { useRef, useState } from "react";
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
import { useRouter } from "expo-router";
import { useNotes } from "./NotesContext";

export default function HomeScreen() {
  const router = useRouter();
  const { notes, addNote } = useNotes();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const titleRef = useRef<TextInput | null>(null);
  const contentRef = useRef<TextInput | null>(null);

  function formatDate(iso?: string) {
    const d = iso ? new Date(iso) : new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = d.getFullYear();
    return `${dd}/${mm}/${yy}`;
  }

  function onAdd() {
    const t = title.trim();
    const c = content.trim();
    if (!t && !c) return;
    const created = addNote(t, c);
    // clear controlled values and clear native inputs via refs
    setTitle("");
    setContent("");
    titleRef.current?.clear();
    contentRef.current?.clear();
    Keyboard.dismiss();
    // optional: navigate to new note detail immediately
    router.push(`/notes/${created.id}`);
  }

  function renderItem({ item }: any) {
    return (
      <TouchableOpacity
        onPress={() => router.push(`/notes/${item.id}`)}
        style={styles.noteCard}
      >
        <View style={styles.row}>
          <Text style={styles.noteTitle}>{item.title}</Text>
          <Text style={styles.noteDate}>{formatDate(item.createdAt)}</Text>
        </View>
        {item.content ? <Text style={styles.noteText}>{item.content}</Text> : null}
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Note App</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          ref={titleRef}
          style={styles.titleInput}
          placeholder="Tiêu đề công việc..."
          value={title}
          onChangeText={setTitle}
          returnKeyType="next"
        />
        <TextInput
          ref={contentRef}
          style={styles.contentInput}
          placeholder="Nội dung..."
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={3}
          returnKeyType="done"
          onSubmitEditing={onAdd}
        />
        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
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
