import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import NotesClient from "./Notes.client";
import { fetchNotes } from "../../lib/api";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  const initialData = await fetchNotes("", 1);

  await queryClient.prefetchQuery({
    queryKey: ["note", "", 1],
    queryFn: () => fetchNotes("", 1),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        initialNotes={initialData.notes}
        initialTotalPages={initialData.totalPages}
      />
    </HydrationBoundary>
  );
}
