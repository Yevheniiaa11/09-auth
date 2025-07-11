import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNoteById } from "../../../lib/api";
import { NoteDetailsClient } from "./NoteDetails.client";
import { Metadata } from "next";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);

    if (!note) {
      return {
        title: "Note not found",
        description: "The requested note does not exist.",
        openGraph: {
          title: "Note not found",
          description: "The requested note does not exist.",
          url: `https://notehub.com/notes/${id}`,
          siteName: "NoteHub",
          images: [
            {
              url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
              width: 1200,
              height: 630,
              alt: "Note not found",
            },
          ],
          type: "article",
        },
      };
    }

    return {
      title: `Note: ${note.title}`,

      description: note.content.slice(0, 30),
      openGraph: {
        title: `Note: ${note.title}`,

        description: note.content.slice(0, 100),
        url: `https://notehub.com/notes/${id}`,
        siteName: "NoteHub",
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            width: 1200,
            height: 630,
            alt: note.title,
          },
        ],
        type: "article",
      },
    };
  } catch (error) {
    console.error("Failed to load metadata for note", error);
    return {
      title: "Error loading note",
      description: "An error occurred while loading this note.",
      openGraph: {
        title: "Error loading note",
        description: "An error occurred while loading this note.",
        url: `https://notehub.com/notes/${id}`,
        siteName: "NoteHub",
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            width: 1200,
            height: 630,
            alt: "Error loading note",
          },
        ],
        type: "article",
      },
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const numId = Number(id);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", numId],
    queryFn: () => fetchNoteById(numId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
