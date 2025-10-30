
import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export async function openDB() {
  if (db) return db;
  db = await SQLite.openDatabaseAsync("tasks.db");

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER DEFAULT 0
    );
  `);

  const count = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM tasks"
  );

  if (count?.count === 0) {
    console.log("🌱 Seeding sample data...");
    const sampleTasks = [
      "Buy groceries",
      "Walk the dog",
      "Finish React Native homework",
      "Plan weekend trip",
    ];

    for (const title of sampleTasks) {
      await db.runAsync("INSERT INTO tasks (title) VALUES (?)", title);
    }
    console.log("✅ Sample data inserted successfully");
  }

  return db;
}

export async function getTasks(): Promise<any[]> {
  const db = await openDB();
  return await db.getAllAsync("SELECT * FROM tasks ORDER BY id DESC");
}

export async function addTask(title: string) {
  const db = await openDB();
  await db.runAsync("INSERT INTO tasks (title) VALUES (?)", title);
}

export async function deleteTask(id: number) {
  const db = await openDB();
  await db.runAsync("DELETE FROM tasks WHERE id = ?", id);
}

export async function updateTask(id: number, newTitle: string) {
  const db = await openDB();
  await db.runAsync("UPDATE tasks SET title = ? WHERE id = ?", newTitle, id);
}

export async function toggleTask(id: number, completed: boolean) {
  const db = await openDB();
  await db.runAsync(
    "UPDATE tasks SET completed = ? WHERE id = ?",
    completed ? 1 : 0,
    id
  );
}
