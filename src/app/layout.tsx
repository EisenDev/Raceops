import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RaceOps | Infosoft Amazing Race 2026",
  description: "Official scoring and facilitation system for the Amazing Race.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUser } from "@/lib/session";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          inter.className,
          "h-full bg-[#FFFFFF] text-[#1A1A1A] antialiased"
        )}
      >
        <AppShell user={user}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
