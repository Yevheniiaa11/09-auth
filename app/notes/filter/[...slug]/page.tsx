import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "../../../../lib/api";
import { NoteListResponse } from "../../../../types/note";
import NotesClient from "./Notes.client";
import { Metadata } from "next";

interface NotesPageProps {
  params: {
    slug?: string[];
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] ?? "all";

  const title =
    tag === "all" ? "All Notes | NoteHub" : `Tag: "${tag}" | NoteHub`;

  const description =
    tag === "all"
      ? "View all your notes in one place."
      : `Notes with the tag "${tag}".`;

  const url =
    tag === "all"
      ? "https://notehub.com/notes"
      : `https://notehub.com/notes/filter/${tag}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub - notes",
        },
      ],
      type: "article",
    },
  };
}

export default async function Notes({ params, searchParams }: NotesPageProps) {
  const awaitedParams = await Promise.resolve(params);
  const awaitedSearchParams = await Promise.resolve(searchParams);
  const initialPage = Number(awaitedSearchParams?.page) || 1;
  const initialQuery = (awaitedSearchParams?.q as string) || "";
  const tagFromSlug =
    awaitedParams.slug?.[0] === "all" ? undefined : awaitedParams.slug?.[0];
  const queryClient = new QueryClient();
  const safeTag = tagFromSlug ?? "";
  await queryClient.prefetchQuery<NoteListResponse, Error>({
    queryKey: ["notes", initialQuery, initialPage, tagFromSlug],
    queryFn: () => fetchNotes(initialQuery, initialPage, safeTag),
  });
  const initialData = queryClient.getQueryData<NoteListResponse>([
    "notes",
    initialQuery,
    initialPage,
    tagFromSlug,
  ]) || { notes: [], totalPages: 1 };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        initialQuery={initialQuery}
        initialPage={initialPage}
        initialTag={tagFromSlug}
        initialData={initialData}
      />
    </HydrationBoundary>
  );
}
