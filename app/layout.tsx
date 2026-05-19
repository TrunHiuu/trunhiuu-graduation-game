import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P, Roboto } from "next/font/google";
import BackgroundMusic from "@/components/BackgroundMusic";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  weight: "400",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "700"],
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "TrunHiuu Graduation Game",
  description: "Graduation Invitation Experience",
  icons: {
    icon: "/graduation_favicon_pixel.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${pressStart2P.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BackgroundMusic />
        {children}
      </body>
    </html>
  );
}
