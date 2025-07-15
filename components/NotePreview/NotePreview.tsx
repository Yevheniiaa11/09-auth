"use client";
import { fetchNoteById } from "../../lib/api/clientApi";
import { Note } from "../../types/note";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import css from "./NotePreview.module.css";
import { useQuery } from "@tanstack/react-query";

interface NotePreviewProps {
  noteId: string;
  onClose?: () => void;
}

export default function NotePreview({ noteId, onClose }: NotePreviewProps) {
  const {
    data: note,
    isLoading,
    error,
  } = useQuery<Note, Error>({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    enabled: !!noteId,
  });

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return <ErrorMessage />;
  }
  if (!note) {
    return <p>Note not found.</p>;
  }

  return (
    <div className={css.container}>
      <button
        className={css.closeButton}
        onClick={handleClose}
        aria-label="Close note preview"
      >
        ✖
      </button>
      {note && (
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.tag}>{note.tag}</p>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{note.createdAt}</p>
        </div>
      )}
    </div>
  );
}
