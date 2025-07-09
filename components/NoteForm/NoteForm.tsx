"use client";

import { useMutation } from "@tanstack/react-query";
import css from "./NoteForm.module.css";
import { createNote } from "../../lib/api";
import type { NoteCategory } from "../../types/note";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type NoteFormProps = {
  categories: NoteCategory[];
};

export const NoteForm = ({ categories }: NoteFormProps) => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      toast.success("Note created!");
      router.push("/notes/filter/all");
    },
    onError: () => {
      toast.error("Failed to create a note");
    },
  });

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData) as Record<string, string>;
    const title = values.title.trim();
    if (!title) {
      toast.error("Title is required");
      return;
    }
    mutate({
      title,
      content: values.content.trim(),
      categoryId: values.categoryId,
    });
  };
  const handleCancel = () => router.push("/notes/filter/all");

  return (
    <form onSubmit={handleCreate} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input id="title" type="text" name="title" className={css.input} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select id="tag" name="tag" className={css.select}>
          {categories.map((category) => (
            <option key={category.id} value={category.title}>
              {category.title}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          Create note
        </button>
      </div>
    </form>
  );
};
