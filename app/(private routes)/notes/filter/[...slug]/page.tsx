import { cookies } from "next/headers";
import { fetchNotesServer } from "../../../../../lib/api/serverApi";
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
  const tag = slug[0];

  const cookieStore = await cookies();
  const token = cookieStore.get("notehub_token")?.value;

  if (!token) {
    throw new Error("No token found. Are you logged in?");
  }

  const response = await fetchNotesServer(`notehub_token=${token}`, 1, tag);
  return <NotesClient initialData={response} tag={tag} />;
}
