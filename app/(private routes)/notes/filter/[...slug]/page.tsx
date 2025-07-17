import { fetchNotesServer } from "../../../../../lib/api/serverApi";
import { Tag } from "../../../../../types/note";
import NotesClient from "./Notes.client";
import { Metadata } from "next";

type NotesProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: NotesProps): Promise<Metadata> {
  const { slug } = await params;

  const tag = slug[0];

  return {
    title: `Notes sorted by "${tag}" category`,
    description: `This page include all your notes in "${tag}" category`,
    openGraph: {
      title: `Notes sorted by "${tag}" category`,
      description: `This page include all your notes in "${tag}" category`,
      url: `https://08-zustand-zeta.vercel.app/notes/filter/${tag}`,
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
  const tag =
    slug.length > 0 && slug[0].toLowerCase() !== "all"
      ? (slug[0] as Tag)
      : undefined;

  const initialNotesData = await fetchNotesServer("", 1, tag);

  return <NotesClient initialNotesData={initialNotesData} tag={tag} />;
}
