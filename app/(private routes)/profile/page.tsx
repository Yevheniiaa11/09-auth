import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import css from "./ProfilePage.module.css";
import { getMeServer } from "../../../lib/api/serverApi";

export const metadata: Metadata = {
  title: "User Profile - NoteHub",
  description: "Your personal profile page in NoteHub.",
  openGraph: {
    title: "User Profile - NoteHub",
    description: "Your personal profile page in NoteHub.",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub - notes",
      },
    ],
    type: "profile",
  },
};

export default async function ProfilePage() {
  const user = await getMeServer();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={
              user?.avatar ||
              "https://ac.goit.global/fullstack/react/default-avatar.jpg"
            }
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user?.userName || "Guest"}</p>
          <p>Email: {user?.email || "your_email@example.com"}</p>
        </div>
      </div>
    </main>
  );
}
