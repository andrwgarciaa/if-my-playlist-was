import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { PlaylistProvider } from "@/providers/PlaylistProvider";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "If my playlist was...",
  description: "Find out what your playlist would be if it was NOT a playlist!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <PlaylistProvider>
        <body
          className={`${notoSans.variable} antialiased mx-auto w-screen min-h-screen flex justify-center p-4 lg:p-8`}
        >
          {children}
        </body>
      </PlaylistProvider>
    </html>
  );
}
