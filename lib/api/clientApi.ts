import { api } from "./api";
import { Note, NoteListResponse } from "../../types/note";
import { AuthSuccessData, LoginResult, User } from "../../types/user";
import axios from "axios";

export interface ParamsTypes {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
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
  const { data } = await api.get<NoteListResponse>("/notes", {
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
  const res = await api.post<Note>("/notes", data);
  return res.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const res = await api.delete<Note>(`/notes/${noteId}`);
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export const register = async (data: RegisterRequest) => {
  const res = await api.post<User>("/auth/register", data);
  return res.data;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (data: LoginRequest): Promise<LoginResult> => {
  try {
    const res = await api.post<AuthSuccessData>("/auth/login", data);
    return { ok: true, data: res.data };
  } catch (error: unknown) {
    console.error("Login API error:", error);

    let errorMessage: string =
      "An unexpected error occurred. Please try again.";

    if (axios.isAxiosError(error)) {
      errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to log in via API.";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      ok: false,
      error: errorMessage,
    };
  }
};
type CheckSessionRequest = {
  success: boolean;
};

export const checkSession = async () => {
  const res = await api.get<CheckSessionRequest>("/auth/session");
  return res.data.success;
};

export const getMe = async () => {
  const { data } = await api.get<User>("/users/me");
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export type CategoryType = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export const getCategories = async () => {
  const { data } = await api<CategoryType[]>(`/categories`);
  return data;
};

export type UpdateUserRequest = {
  userName?: string;
  photoUrl?: string;
};

export const updateMe = async (payload: UpdateUserRequest) => {
  const res = await api.put<User>("/users/me", payload);
  return res.data;
};

export interface AuthUserData {
  username: string;
  email: string;
}
