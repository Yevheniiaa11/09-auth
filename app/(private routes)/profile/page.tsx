import { Metadata } from "next";
import ProfileClient from "./ProfileClient";

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

export default function ProfilePage() {
  return <ProfileClient />;
}
