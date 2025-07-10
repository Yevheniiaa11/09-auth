import { fetchNotes } from "../../../../lib/api";
import NotesClient from "./Notes.client";
import { Metadata } from "next";

export const revalidate = 60;

type NotesProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: NotesProps): Promise<Metadata> {
  const { slug } = await params;
  const rawTag = slug?.[0] ?? "all";
  const tag = rawTag.toLowerCase();

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
    title: `Notes: ${title}`,
    description: description,
    openGraph: {
      title: `Notes: ${title}`,
      description: description,
      url: url,
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
export default async function Notes({ params }: NotesProps) {
  const { slug } = await params;

  const category = slug[0] === "All" ? undefined : slug[0];
  const safeCategory = category ?? "";
  const initialData = await fetchNotes("", 1, safeCategory);

  return <NotesClient initialData={initialData} initialTag={safeCategory} />;
}
