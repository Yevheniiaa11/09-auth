import { Note } from "../../types/note";
import { cookies } from "next/headers";
import { nextApi } from "./api";
import { User } from "../../types/user";

export const fetchNotesServer = async (
  page: number,
  search = "",
  tag?: string,
  perPage = 12
): Promise<{ notes: Note[]; totalPages: number }> => {
  const params: Record<string, string | number> = { page, perPage };
  if (search.trim()) params.search = search.trim();
  if (tag && tag !== "all") params.tag = tag;

  const headers = await getSSRHeaders();

  const response = await nextApi.get<{ notes: Note[]; totalPages: number }>(
    "/notes",
    {
      params,
      ...headers,
    }
  );
  return response.data;
};

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
const getSSRHeaders = async () => {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
};

export const getMeServer = async (): Promise<User> => {
  const headers = await getSSRHeaders();
  const response = await nextApi.get<User>("/users/me", headers);
  return response.data;
};
