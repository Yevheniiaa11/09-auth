"use client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import Modal from "../../../../components/Modal/Modal";
import { useQuery } from "@tanstack/react-query";
import { Note } from "../../../../types/note";
import css from "./NotePreview.module.css";
import { fetchNoteById } from "../../../../lib/api/clientApi";

export default function ModalClient() {
  const router = useRouter();
  const { id } = useParams();
  const noteId = id as string;

  function handleClose() {
    router.back();
  }

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery<Note>({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });
  return (
    <Modal onClose={handleClose}>
      {isLoading && <p>Loading note...</p>}
      {isError && <p>Failed to load note</p>}
      {note && (
        <div className={css.container}>
          <button onClick={handleClose} className={css.backBtn}>
            ← Back
          </button>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
              <span className={css.tag}>{note.tag}</span>
            </div>
            <div className={css.content}>{note.content}</div>
            <div className={css.date}>
              {new Date(note.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
