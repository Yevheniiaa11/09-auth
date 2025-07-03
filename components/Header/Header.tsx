"use client";
import { TagsMenu } from "../TagsMenu/TagsMenu";
import css from "./Header.module.css";
import Link from "next/link";
import { NoteCategory } from "../../types/note";

type Props = {
  categories: NoteCategory[];
};
const Header = ({ categories }: Props) => {
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home">
        NoteHub
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <TagsMenu categories={categories} />
          </li>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/notes/filter/All">Notes</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
