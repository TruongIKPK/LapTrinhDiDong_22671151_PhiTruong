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

type Note = { id: string; text: string };

export default function HomeScreen() {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);

  function addNote() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setNotes((s) => [{ id: Date.now().toString(), text: trimmed }, ...s]);
    setText("");
    Keyboard.dismiss();
  }

  function renderItem({ item }: { item: Note }) {
    return (
      <View style={styles.noteCard}>
        <Text style={styles.noteText}>{item.text}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Note App</Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Viết ghi chú..."
          value={text}
          onChangeText={setText}
          onSubmitEditing={addNote}
          returnKeyType="done"
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
            <Text style={styles.emptyText}>Chưa có ghi chú — thêm ngay!</Text>
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
  inputRow: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E1E8EE",
    marginRight: 8,
  },
  addButton: {
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
    paddingTop: 8,
    paddingBottom: 32,
  },
  noteCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E6F0F8",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  noteText: {
    color: "#183C4A",
    fontSize: 15,
  },
  empty: {
    marginTop: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#7A97A7",
  },
});
