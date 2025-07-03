import { fetchCategories, fetchNotes } from "../../../../lib/api";
import NotesClient from "./Notes.client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
interface NotesByCategoryProps {
  params: { slug?: string[] };
}

export default async function NotesByCategory({
  params,
}: NotesByCategoryProps) {
  const { slug } = params || {};
  const category = !slug || slug[0]?.toLowerCase() === "all" ? "all" : slug[0];

  const categories = await fetchCategories();
  console.log("Category:", categories);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", category, 1],
    queryFn: () => fetchNotes(category),
  });

  const initialData = await fetchNotes(category, 1);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        initialNotes={initialData.notes}
        initialTotalPages={initialData.totalPages}
        category={category}
      />
    </HydrationBoundary>
  );
}
