"use client";
import { useRouter } from "next/navigation";
import NotePreview from "../../../../components/NotePreview/NotePreview";
import React from "react";
import Modal from "../../../../components/Modal/Modal";
interface ModalClientProps {
  noteId: number;
}
export default function ModalClient({ noteId }: ModalClientProps) {
  const router = useRouter();

  function handleClose() {
    router.back();
  }

  return (
    <Modal onClose={handleClose}>
      <NotePreview noteId={noteId} onClose={handleClose} />
    </Modal>
  );
}
