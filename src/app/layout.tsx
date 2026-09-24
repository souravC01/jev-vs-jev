import type { Metadata } from "next";
import "./globals.css";
import { SITE_METADATA } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://jev-vs-jev.vercel.app"),
  title: SITE_METADATA.title,
  description: SITE_METADATA.description,
  openGraph: {
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    type: "website",
    images: ["/og"],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    images: ["/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="selection:bg-[#f68d1f] selection:text-[#21242e]">{children}</body>
    </html>
  );
}
