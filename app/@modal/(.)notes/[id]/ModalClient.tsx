"use client";
import { useRouter, useParams } from "next/navigation";
import { fetchNoteById } from "../../../../lib/api";
import { useQuery } from "@tanstack/react-query";
import Modal from "../../../../components/Modal/Modal";
import NotePreview from "../../../../components/NotePreview/NotePreview";

export default function Preview() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const numId = Number(id);
  const { data } = useQuery({
    queryKey: ["note", numId],
    queryFn: () => fetchNoteById(numId),
    refetchOnMount: false,
  });

  function handleClose() {
    router.back();
  }

  return (
    <Modal onClose={handleClose}>
      <NotePreview note={data} />
    </Modal>
  );
}
