import type { Metadata } from "next";
import "./globals.css";
import TanStackProvider from "../components/TanStackProvider/TanStackProvider";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Roboto } from "next/font/google";

export const metadata: Metadata = {
  title: "NoteHub",
  description:
    "A fast and clean note-taking app to store your thoughts and ideas, anytime, anywhere.",
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
          <Header />
          {children}
          {modal}
          <Footer />
        </TanStackProvider>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
