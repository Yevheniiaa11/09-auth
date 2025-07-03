import axios from "axios";
import type {
  NewNoteData,
  Note,
  NoteCategory,
  NoteListResponse,
} from "../types/note";
import { categories } from "./categories";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common.Authorization = `Bearer ${
  process.env.NEXT_PUBLIC_NOTEHUB_TOKEN
}`;

export const fetchNotes = async (
  tag: string = "",
  page: number = 1,
  perPage: number = 12
): Promise<{ notes: Note[]; totalPages: number }> => {
  try {
    const params: Record<string, string | number> = {
      page,
      perPage,
    };
    if (tag && tag.toLowerCase() !== "all") {
      params.tag = tag.trim();
    }

    const res = await axios.get<{ notes: Note[]; totalPages: number }>(
      "/notes",
      {
        params,
      }
    );
    return res.data;
  } catch (error: unknown) {
    console.error("fetchNotes error:", error);
    return { notes: [], totalPages: 1 };
  }
};

export const createNote = async (noteData: NewNoteData): Promise<Note> => {
  const res = await axios.post<Note>("/notes", noteData);
  return res.data;
};
export const deleteNote = async (noteId: number): Promise<Note> => {
  const res = await axios.delete<Note>(`/notes/${noteId}`);
  return res.data;
};

export const fetchNoteById = async (id: number): Promise<Note | undefined> => {
  const res = await axios.get<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return res.data;
};

export const getNotes = async (categoryId?: string) => {
  const res = await axios.get<NoteListResponse>("/notes", {
    params: { categoryId },
  });
  return res.data;
};

export const fetchCategories = async (): Promise<NoteCategory[]> => {
  return new Promise((resolve) => {
    resolve(categories);
  });
};
