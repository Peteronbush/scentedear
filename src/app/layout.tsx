import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scentedeer",
  description: "Discover your perfect fragrance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-stone-50 text-stone-800 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
