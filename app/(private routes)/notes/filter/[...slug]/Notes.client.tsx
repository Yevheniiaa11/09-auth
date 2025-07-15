"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import css from "./NotesPage.module.css";
import { useState } from "react";
import { useDebounce } from "use-debounce";

import Link from "next/link";
import { NoteListResponse } from "../../../../../types/note";
import { fetchNotes } from "../../../../../lib/api/clientApi";
import SearchBox from "../../../../../components/SearchBox/SearchBox";
import Pagination from "../../../../../components/Pagination/Pagination";
import { NoteList } from "../../../../../components/NoteList/NoteList";

interface NotesClientProps {
  initialData: NoteListResponse;
  tag: string;
}

export default function NotesClient({ initialData, tag }: NotesClientProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debounceQuery] = useDebounce(search, 500);

  const allNotes = useQuery({
    queryKey: ["allNotes", debounceQuery, page, tag],
    queryFn: () => fetchNotes(page, debounceQuery, tag),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    initialData: page === 1 && search === "" ? initialData : undefined,
  });

  function handleSearch(search: string) {
    setSearch(search);
    setPage(1);
  }
  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onSearch={handleSearch} value={search} />

        {allNotes.isSuccess && allNotes.data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={allNotes.data.totalPages}
            onPageChange={setPage}
          />
        )}
        <Link href={"/notes/action/create"} className={css.button}>
          Create note +
        </Link>
      </div>
      {allNotes.isSuccess && allNotes.data.notes.length > 0 && (
        <NoteList notes={allNotes.data.notes} />
      )}
    </div>
  );
}
