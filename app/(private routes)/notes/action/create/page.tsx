import { NoteForm } from "../../../../../components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Create a New Note | NoteHub",
  description: "Create a note with minimal effort and maximum clarity.",
  openGraph: {
    title: "Create a New Note | NoteHub",
    description:
      "Quickly jot down your ideas, tasks, or thoughts using our simple and intuitive note editor.",
    url: "https://notehub.com/notes/action/create",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Create Note",
      },
    ],
    type: "website",
  },
};

const CreateNote = () => {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
};

export default CreateNote;
