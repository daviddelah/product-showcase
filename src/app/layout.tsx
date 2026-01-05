import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Product Showcase",
  description: "A minimalist showcase of product concepts",
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
      </body>
    </html>
  );
}
