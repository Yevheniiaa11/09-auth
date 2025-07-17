import { Note, NoteListResponse } from "../../types/note";
import { cookies } from "next/headers";
import { nextApi } from "./api";
import { User } from "../../types/user";
import { ParamsTypes } from "./clientApi";

export async function fetchNotesServer(
  query: string,
  page: number,
  tag: string | undefined = undefined
): Promise<NoteListResponse> {
  const params: ParamsTypes = {
    ...(query.trim() !== "" && { search: query.trim() }),
    page: page,
    perPage: 12,
    tag,
  };
  const cookieStore = await cookies();
  const response = await nextApi.get<NoteListResponse>("/notes", {
    params,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
}
export async function fetchNoteByIdServer(noteId: string): Promise<Note> {
  const cookieStore = await cookies();
  const response = await nextApi.get<Note>(`/notes/${noteId}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
}

export async function checkServerSession() {
  const cookieStore = await cookies();
  const res = await nextApi.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
}

export const getMeServer = async () => {
  const cookieStore = await cookies();
  const responce = await nextApi.get<User>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return responce.data;
};
