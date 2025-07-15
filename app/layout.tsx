import type { Metadata } from "next";
import "./globals.css";
import TanStackProvider from "../components/TanStackProvider/TanStackProvider";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Roboto } from "next/font/google";
import AuthProvider from "../components/AuthProvider/AuthProvider";

export const metadata: Metadata = {
  title: "NoteHub",
  description:
    "A fast and clean note-taking app to store your thoughts and ideas, anytime, anywhere.",
  openGraph: {
    title: `NoteHub`,
    description:
      "A fast and clean note-taking app to store your thoughts and ideas, anytime, anywhere.",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub - notes",
      },
    ],
    type: "article",
  },
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
  display: "swap",
});
export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            {children}
            {modal}
            <Footer />
          </AuthProvider>
        </TanStackProvider>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
