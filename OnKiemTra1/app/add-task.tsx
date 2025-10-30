import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { addTask } from "./db";

export default function AddTask() {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const handleAddTask = async () => {
    if (title.trim() === "") return;
    await addTask(title);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ADD YOUR JOB</Text>

      <TextInput
        placeholder="Input your job"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddTask}>
        <Text style={styles.buttonText}>FINISH →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    width: "80%",
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#00bcd4",
    padding: 12,
    borderRadius: 8,
    width: "60%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});