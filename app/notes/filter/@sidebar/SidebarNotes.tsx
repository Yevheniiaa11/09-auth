import css from "./SidebarNotes.module.css";
import Link from "next/link";
import { fetchCategories } from "../../../../lib/api";

const SidebarNotes = async () => {
  const categories = await fetchCategories();
  return (
    <ul className={css.menuList}>
      <li>
        <Link href={`/notes/filter/all`}>All notes</Link>
      </li>
      {categories.map((category) => (
        <li key={category.id} className={css.menuItem}>
          <Link
            href={`/notes/filter/${category.title}`}
            className={css.menuLink}
          >
            {category.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SidebarNotes;
