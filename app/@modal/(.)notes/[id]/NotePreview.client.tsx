"use client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import Modal from "../../../../components/Modal/Modal";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "../../../../lib/api";
import { Note } from "../../../../types/note";

export default function ModalClient() {
  const router = useRouter();
  const { id } = useParams();
  const noteId = Number(id);

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
    refetchOnMount: true,
  });
  return (
    <Modal onClose={handleClose}>
      {isLoading && <p>Loading note...</p>}
      {isError && <p>Failed to load note</p>}
      {note && (
        <div>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
        </div>
      )}
    </Modal>
  );
}
