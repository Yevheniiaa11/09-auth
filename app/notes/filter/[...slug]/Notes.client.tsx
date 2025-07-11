"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import css from "./NotesPage.module.css";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { fetchNotes } from "../../../../lib/api";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import Pagination from "../../../../components/Pagination/Pagination";
import { NoteList } from "../../../../components/NoteList/NoteList";
import { NoteListResponse } from "../../../../types/note";
import Link from "next/link";

interface NotesClientProps {
  initialTag?: string | undefined;
  initialData: NoteListResponse | undefined;
}

export default function NotesClient({
  initialTag,
  initialData,
}: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const [debounceQuery] = useDebounce(searchText, 500);
  const safeInitialTag = initialTag ?? "";
  const { data } = useQuery({
    queryKey: ["notes", debounceQuery, currentPage, safeInitialTag],
    queryFn: () => fetchNotes(debounceQuery, currentPage, safeInitialTag),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    initialData,
  });

  const notes = data?.notes ?? [];
  const totalPage = data?.totalPages ?? 1;

  function handleChange(value: string) {
    setSearchText(value);
    setCurrentPage(1);
  }

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={searchText} onSearch={handleChange} />

        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </div>
      {data && notes.length > 0 && <NoteList notes={notes} />}
      {totalPage > 1 && (
        <Pagination
          totalPages={totalPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
