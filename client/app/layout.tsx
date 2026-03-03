import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/ui/Navigation";
import ReduxProvider from "@/store/provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MindCare - Your Mental Wellness Journey",
  description:
    "Professional mental health support and resources for your wellbeing journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased min-h-screen bg-mesh-gradient`}
      >
        <ReduxProvider>
          <Navigation />
          <main className="pt-20">{children}</main>
        </ReduxProvider>
      </body>
    </html>
  );
}
