import { nextApi } from "./api";
import { Note, NoteListResponse } from "../../types/note";
import { User } from "../../types/user";

export interface ParamsTypes {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
  sortBy?: string;
}

export type NewNoteData = {
  title: string;
  content: string;
  tag: string;
};

export const fetchNotes = async (
  page: number,
  searchText: string,
  tag?: string
): Promise<NoteListResponse> => {
  const { data } = await nextApi.get<NoteListResponse>("/notes", {
    params: {
      page,
      perPage: 16,
      ...(searchText !== "" ? { search: searchText } : {}),
      ...(tag?.toLowerCase() !== "all" ? { tag } : {}),
    },
  });
  return data;
};

export const createNote = async (data: NewNoteData): Promise<Note> => {
  const res = await nextApi.post<Note>("/notes", data);
  return res.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const res = await nextApi.delete<Note>(`/notes/${noteId}`);
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await nextApi.get<Note>(`/notes/${id}`);
  return res.data;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export const register = async (data: RegisterRequest) => {
  const res = await nextApi.post<User>("/auth/register", data);
  return res.data;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (data: LoginRequest): Promise<User> => {
  const response = await nextApi.post<User>("/auth/login", data);
  return response.data;
};

type CheckSessionResponse = {
  success: boolean;
};

export const checkSession = async () => {
  const res = await nextApi.get<CheckSessionResponse>("/auth/session");
  return res;
};

export const getMe = async () => {
  const response = await nextApi.get<User>("/users/me");
  return response.data;
};

export const logout = async (): Promise<void> => {
  await nextApi.post("/auth/logout");
};

export type CategoryType = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export const getCategories = async () => {
  const { data } = await nextApi<CategoryType[]>(`/categories`);
  return data;
};

export type UpdateUserRequest = {
  username?: string;
  photoUrl?: string;
};

export const updateMe = async (payload: UpdateUserRequest) => {
  const res = await nextApi.patch<User>("/users/me", payload);
  return res.data;
};

export interface AuthUserData {
  username: string;
  email: string;
}
