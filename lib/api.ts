import axios from "axios";
import { NoteCategory, type Note, type NoteListResponse } from "../types/note";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common.Authorization = `Bearer ${
  process.env.NEXT_PUBLIC_NOTEHUB_TOKEN
}`;

export async function fetchNotes(
  page: number,
  searchText: string,
  tag?: string
): Promise<NoteListResponse> {
  const { data } = await axios.get<NoteListResponse>("/notes", {
    params: {
      page,
      perPage: 16,
      ...(searchText !== "" ? { search: searchText } : {}),
      ...(tag?.toLowerCase() !== "all" ? { tag } : {}),
    },
  });
  return data;
}
export type NewNoteData = {
  title: string;
  content: string;
  tag: string;
};

export const createNote = async (data: NewNoteData) => {
  const res = await axios.post<Note>("/notes", data);
  return res.data;
};

export const deleteNote = async (noteId: number): Promise<Note> => {
  const res = await axios.delete<Note>(`/notes/${noteId}`);
  return res.data;
};

export const fetchNoteById = async (id: number | string): Promise<Note> => {
  const res = await axios.get<Note>(`/notes/${id}`);
  return res.data;
};

export const getCategories = async (): Promise<NoteCategory[]> => {
  try {
    const initialNotesResponse = await axios.get<NoteListResponse>("/notes", {
      params: { page: 1, perPage: 100 },
    });

    const notes = initialNotesResponse.data.notes;
    const allTags = notes.map((note) => note.tag);
    const uniqueTags = Array.from(new Set(allTags));
    const categories: NoteCategory[] = uniqueTags.map((tag, index) => ({
      id: index,
      name: tag,
    }));

    return categories;
  } catch (error) {
    console.error("Error fetching categories by extracting from notes:", error);
    throw error;
  }
};
