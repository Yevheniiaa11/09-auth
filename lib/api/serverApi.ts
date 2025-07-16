import { Note, NoteListResponse } from "../../types/note";
import { cookies } from "next/headers";
import { ParamsTypes } from "./clientApi";
import { api } from "./api";
import { User } from "../../types/user";

export async function fetchNotesServer(
  search: string,
  page: number,
  tag: string | undefined
): Promise<NoteListResponse> {
  const params: ParamsTypes = {
    ...(search.trim() !== "" && { query: search.trim() }),
    page,
    perPage: 12,
    tag,
  };

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    throw new Error("No access token");
  }

  const response = await api.get<NoteListResponse>("/notes", {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
}

export async function fetchNoteByIdServer(noteId: string): Promise<Note> {
  const cookieStore = await cookies();
  const response = await api.get<Note>(`/notes/${noteId}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
}

export async function checkServerSession() {
  const cookieStore = await cookies();
  const res = await api.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
}

export const getMeServer = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const response = await api.get<User>("/users/me", {
    headers: {
      Cookie: cookieHeader,
    },
  });
  return response.data;
};
