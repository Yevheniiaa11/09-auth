export interface Note {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
  id: number;
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
