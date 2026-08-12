import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Savora Restaurant",
  description: "Fine dining reservations and staff management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
