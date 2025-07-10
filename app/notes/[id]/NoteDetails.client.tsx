"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchNoteById } from "../../../lib/api";
import css from "./NoteDetails.module.css";

export const NoteDetailsClient = () => {
  const { id } = useParams<{ id: string }>();
  const noteId = Number(id);
  console.log("Converted noteId:", noteId);

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notes", noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  console.log(note);
  if (isNaN(noteId)) {
    return <p>Invalid note ID</p>;
  }
  if (isLoading) return <p>Loading, please wait...</p>;

  if (error || !note) return <p>Something went wrong.</p>;
  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>
          {new Date(note.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};
