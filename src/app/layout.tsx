import type { Metadata } from "next";
import "./globals.css";
import { MusicPlayer } from "@/components/shared/MusicPlayer";

export const metadata: Metadata = {
  title: "The Constellation of New Gen",
  description: "An interactive journey through the New Gen universe",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <MusicPlayer />
      </body>
    </html>
  );
}
