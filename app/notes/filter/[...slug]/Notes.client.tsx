"use client";
import { useState } from "react";
import css from "./NotesPage.module.css";
import { useQuery } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDebounce } from "use-debounce";
import Loader from "../../../../components/Loader/Loader";

import { fetchNotes } from "../../../../lib/api";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import Pagination from "../../../../components/Pagination/Pagination";
import { NoteList } from "../../../../components/NoteList/NoteList";
import NoteModal from "../../../../components/NoteModal/NoteModal";
import { Note } from "../../../../types/note";
import ErrorMessage from "../../../../components/ErrorMessage/ErrorMessage";

type NotesClientProps = {
  initialNotes: Note[];
  initialTotalPages: number;
  category: string;
};
export default function NotesClient({
  initialNotes,
  initialTotalPages,
  category,
}: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  const trimmedSearch = debouncedSearch.trim();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["notes", category, trimmedSearch, currentPage],
    queryFn: () => fetchNotes(trimmedSearch, currentPage),
    initialData:
      currentPage === 1 && trimmedSearch === ""
        ? { notes: initialNotes, totalPages: initialTotalPages }
        : undefined,
    placeholderData: (prev) => prev,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={handleSearchChange} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        )}

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {data?.notes && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {isLoading && isFetching && <Loader />}
      {error && <ErrorMessage />}
      {isModalOpen && <NoteModal onClose={closeModal} />}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
