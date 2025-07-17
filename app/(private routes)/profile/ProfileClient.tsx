"use client";

import Link from "next/link";
import css from "./ProfilePage.module.css";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../../lib/api/clientApi";

export default function ProfileClient() {
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

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
            src="https://ac.goit.global/fullstack/react/default-avatar.jpg"
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
