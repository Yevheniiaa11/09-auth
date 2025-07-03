// import { fetchCategories, fetchNotes } from "../../../../lib/api";
// import NotesClient from "./Notes.client";
// import {
//   dehydrate,
//   HydrationBoundary,
//   QueryClient,
// } from "@tanstack/react-query";
// interface NotesByCategoryProps {
//   params: { slug?: string[] };
// }

// export default async function NotesByCategory({
//   params,
// }: NotesByCategoryProps) {
//   const slug = Array.isArray(params?.slug) ? params.slug : [];

//   const category = slug[0]?.toLowerCase() === "all" ? "all" : slug[0];
//   const categories = await fetchCategories();
//   console.log("Category:", categories);

//   const queryClient = new QueryClient();
//   await queryClient.prefetchQuery({
//     queryKey: ["note", category, 1],
//     queryFn: () => fetchNotes(category),
//   });

//   const initialData = await fetchNotes(category, 1);

//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       <NotesClient
//         initialNotes={initialData.notes}
//         initialTotalPages={initialData.totalPages}
//         category={category}
//       />
//     </HydrationBoundary>
//   );
// }

// app/notes/filter/[...slug]/page.tsx
// Тимчасово, щоб побачити логи в браузері, або видаліть для Server Component
// app/notes/filter/[...slug]/page.tsx
// app/notes/filter/[...slug]/page.tsx
// app/notes/filter/[...slug]/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { fetchCategories, fetchNotes } from "../../../../lib/api";
import NotesClient from "./Notes.client";
import type { Note } from "../../../../types/note"; // Переконайтеся, що імпортуєте Note

interface NotesByCategoryProps {
  params: { slug?: string[] };
}

export default async function NotesByCategory({
  params,
}: NotesByCategoryProps) {
  console.log("Server Component: Full params object:", params);
  const slug = Array.isArray(params?.slug) ? params.slug : [];
  console.log("Server Component: Processed slug (final):", slug);

  const category = !slug || slug[0]?.toLowerCase() === "all" ? "all" : slug[0];
  console.log("Server Component: Derived category:", category);

  const categories = await fetchCategories();
  console.log("Server Component: Fetched Categories:", categories);

  const queryClient = new QueryClient();

  // Очікуємо prefetchQuery, щоб кеш був заповнений
  // queryFn має повертати саме Promise<{ notes: Note[]; totalPages: number }>
  await queryClient.prefetchQuery({
    queryKey: ["notes", category, "", 1],
    queryFn: () => fetchNotes(category, 1),
  });

  // Типізуємо initialData явно, використовуючи той самий тип, що повертає fetchNotes
  type InitialDataType = { notes: Note[]; totalPages: number };

  const initialData: InitialDataType =
    queryClient.getQueryData<InitialDataType>(["notes", category, "", 1]) || {
      notes: [],
      totalPages: 1,
    };

  // Додаткова перевірка на випадок, якщо initialData все ще undefined або має неправильний формат
  // Ця перевірка тепер має бути менш потрібною, якщо `initialData` завжди ініціалізується.
  // Але залишаємо її для надійності, якщо щось піде не так.
  if (!initialData || !Array.isArray(initialData.notes)) {
    console.error(
      "Server Component: initialData is malformed or empty. Falling back to empty array.",
      initialData
    );
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient
          initialNotes={[]}
          initialTotalPages={1}
          category={category}
        />
      </HydrationBoundary>
    );
  }

  console.log(
    "Server Component: Initial Data for Notes (notes count):",
    initialData.notes.length
  );
  console.log(
    "Server Component: Initial Data for Notes (totalPages):",
    initialData.totalPages
  );

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
