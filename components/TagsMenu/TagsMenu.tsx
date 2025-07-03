"use client";
import { useState } from "react";
import Link from "next/link";
import { NoteCategory } from "../../types/note";
import css from "./TagsMenu.module.css";

type Props = {
  categories: NoteCategory[];
};

export const TagsMenu = ({ categories }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const allCategories = [{ id: 0, title: "All" }, ...categories];
  return (
    <div className={css.menuContainer}>
      <button onClick={toggle} className={css.menuButton}>
        Notes ▾
      </button>
      {isOpen && (
        <ul className={css.menuList}>
          {allCategories.map((category) => {
            console.log("Category:", category);
            return (
              <li key={category.id} className={css.menuItem}>
                <Link
                  href={`/notes/filter/${category.title}`}
                  onClick={toggle}
                  className={css.menuLink}
                >
                  {category.title}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
