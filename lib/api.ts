import axios from "axios";
import type { NewNoteData, Note, NoteResponse } from "../types/note";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common.Authorization = `Bearer ${
  process.env.NEXT_PUBLIC_NOTEHUB_TOKEN
}`;

export const fetchNotes = async (
  searchQuery: string,
  page: number = 1,
  perPage: number = 12
): Promise<NoteResponse> => {
  const params: Record<string, string | number> = {
    page,
    perPage,
  };

  if (searchQuery.trim()) {
    params.search = searchQuery.trim();
  }

  const res = await axios.get<NoteResponse>("/notes", { params });
  return res.data;
};

export const createNote = async (noteData: NewNoteData): Promise<Note> => {
  const res = await axios.post<Note>("/notes", noteData);
  return res.data;
};
export const deleteNote = async (noteId: number): Promise<Note> => {
  const res = await axios.delete<Note>(`/notes/${noteId}`);
  return res.data;
};

export async function fetchById(id: number | string): Promise<Note> {
  const response = await axios.get<Note>(`/notes/${id}`);
  return response.data;
}
