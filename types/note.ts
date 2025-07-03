export interface Note {
  id: number;
  title: string;
  content: string;
  tag: string;
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
  title: string;
}

export interface NoteListResponse {
  notes: Note[];
  totalPages: number;
}
