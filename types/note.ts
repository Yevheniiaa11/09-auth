export interface Note {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewNoteData {
  title: string;
  content: string;
  tag: string;
}

export interface NoteCategory {
  id: number;
  title?: string;
}

export interface NoteListResponse {
  notes: Note[];
  totalPages: number;
}

export const tags = [
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
  "Todo",
] as const;

export type Tag = (typeof tags)[number];
