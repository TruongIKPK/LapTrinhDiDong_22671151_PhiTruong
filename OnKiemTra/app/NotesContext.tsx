import React, { createContext, useContext, useState } from "react";

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

type NotesContextValue = {
  notes: Note[];
  addNote: (title: string, content: string) => Note;
  getNoteById: (id: string) => Note | undefined;
};

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);

  function addNote(title: string, content: string) {
    const newNote: Note = {
      id: Date.now().toString(),
      title: title.trim() || "Không có tiêu đề",
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    setNotes((s) => [newNote, ...s]);
    return newNote;
  }

  function getNoteById(id: string) {
    return notes.find((n) => n.id === id);
  }

  return (
    <NotesContext.Provider value={{ notes, addNote, getNoteById }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used inside NotesProvider");
  return ctx;
}