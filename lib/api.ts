import axios from "axios";
import { NoteCategory, type Note, type NoteListResponse } from "../types/note";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common.Authorization = `Bearer ${
  process.env.NEXT_PUBLIC_NOTEHUB_TOKEN
}`;

interface ParamsTypes {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}
export const fetchNotes = async (
  search: string,
  page: number,
  tag: string
): Promise<NoteListResponse> => {
  const perPage = 12;
  const params: ParamsTypes = {
    page,
    perPage,
  };

  if (tag?.trim()) {
    params.tag = tag;
  }
  if (search?.trim()) {
    params.search = search;
  }

  const res = await axios.get<{ notes: Note[]; totalPages: number }>("/notes", {
    params,
  });
  return res.data;
};

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

export const getCategories = async () => {
  const { data } = await axios.get<NoteCategory[]>(`/notes `);
  console.log("Data from /notes:", data);
  return data;
};
