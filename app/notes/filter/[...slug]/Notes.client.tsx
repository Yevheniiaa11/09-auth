// "use client";
// import { useState } from "react";
// import css from "./NotesPage.module.css";
// import { useQuery } from "@tanstack/react-query";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useDebounce } from "use-debounce";
// import Loader from "../../../../components/Loader/Loader";

// import { fetchNotes } from "../../../../lib/api";
// import SearchBox from "../../../../components/SearchBox/SearchBox";
// import Pagination from "../../../../components/Pagination/Pagination";
// import { NoteList } from "../../../../components/NoteList/NoteList";
// import NoteModal from "../../../../components/NoteModal/NoteModal";
// import { Note } from "../../../../types/note";
// import ErrorMessage from "../../../../components/ErrorMessage/ErrorMessage";

// type NotesClientProps = {
//   initialNotes: Note[];
//   initialTotalPages: number;
//   category: string;
// };

// export default function NotesClient({
//   initialNotes,
//   initialTotalPages,
//   category,
// }: NotesClientProps) {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [debouncedSearch] = useDebounce(searchQuery, 500);

//   const trimmedSearch = debouncedSearch.trim();

//   const handleSearchChange = (value: string) => {
//     setSearchQuery(value);
//     setCurrentPage(1);
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };
//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   const { data, isLoading, error, isFetching } = useQuery({
//     queryKey: ["notes", category, trimmedSearch, currentPage],
//     queryFn: () => fetchNotes(trimmedSearch, currentPage),
//     initialData:
//       currentPage === 1 && trimmedSearch === ""
//         ? { notes: initialNotes, totalPages: initialTotalPages }
//         : undefined,
//     placeholderData: (prev) => prev,
//   });

//   return (
//     <div className={css.app}>
//       <header className={css.toolbar}>
//         <SearchBox value={searchQuery} onChange={handleSearchChange} />
//         {data && data.totalPages > 1 && (
//           <Pagination
//             currentPage={currentPage}
//             totalPages={data.totalPages}
//             onPageChange={handlePageChange}
//           />
//         )}

//         <button className={css.button} onClick={openModal}>
//           Create note +
//         </button>
//       </header>
//       {data?.notes && data.notes.length > 0 && <NoteList notes={data.notes} />}
//       {isLoading && isFetching && <Loader />}
//       {error && <ErrorMessage />}
//       {isModalOpen && <NoteModal onClose={closeModal} />}

//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// }

// app/notes/filter/[...slug]/Notes.client.tsx
"use client";

import { useState, useEffect } from "react";
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
import NoteModal from "../../../../components/Modal/Modal";
import { Note } from "../../../../types/note";
import ErrorMessage from "../../../../components/ErrorMessage/ErrorMessage";

type NotesClientProps = {
  initialNotes: Note[];
  initialTotalPages: number;
  category: string;
};

// Визначимо тип для даних, які повертає fetchNotes
type NotesQueryResult = { notes: Note[]; totalPages: number };

export default function NotesClient({
  initialNotes,
  initialTotalPages,
  category,
}: NotesClientProps) {
  console.log("Client Component: NotesClient Mounted.");
  console.log(
    "Client Component: Initial props - initialNotes count:",
    initialNotes?.length
  );
  console.log(
    "Client Component: Initial props - initialTotalPages:",
    initialTotalPages
  );
  console.log("Client Component: Initial props - category:", category);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch] = useDebounce(searchQuery, 700);

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

  // Явно вказуємо тип для useQuery
  const { data, isLoading, error, isFetching } = useQuery<
    NotesQueryResult,
    Error
  >({
    queryKey: ["notes", category, trimmedSearch, currentPage],
    queryFn: () => fetchNotes(trimmedSearch, currentPage),
    initialData:
      currentPage === 1 && trimmedSearch === ""
        ? { notes: initialNotes, totalPages: initialTotalPages }
        : undefined, // Може бути undefined

    // placeholderData для збереження попереднього стану
    placeholderData: (prevData) => {
      // Якщо prevData існує, повертаємо його, інакше повертаємо initialData
      // (якщо conditions for initialData match)
      if (prevData) return prevData;
      if (currentPage === 1 && trimmedSearch === "") {
        return { notes: initialNotes, totalPages: initialTotalPages };
      }
      return undefined;
    },
  });

  useEffect(() => {
    console.log("Client Component (useQuery data update):");
    console.log("  data:", data);
    console.log("  isLoading:", isLoading);
    console.log("  error:", error);
    console.log("  isFetching:", isFetching);
    console.log("  data.notes (for rendering):", data?.notes); // Перевіряємо наявність data?.notes
    console.log("  data.notes.length:", data?.notes?.length); // Перевіряємо довжину
  }, [data, isLoading, error, isFetching]);

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

      {/* Умовний рендеринг: Перевіряємо, чи data.notes існує і чи він не порожній */}
      {data?.notes && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : isLoading || isFetching ? (
        <Loader />
      ) : error ? (
        <ErrorMessage />
      ) : (
        <p className={css.noNotesMessage}>
          No notes found for category: {category}
        </p>
      )}

      {isModalOpen && <NoteModal onClose={closeModal} />}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
