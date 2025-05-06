// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWraper from "./SessionWraper";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "sonner";
import ReduxProvider from "./ReduxProvider";
import { ThemeProvider } from "./components/ThemeProvider";
import ClientWrapper from "./ClientWrapper";  // Import the ClientWrapper component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "My website is very fast response and beautiful UI and UX experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-zinc-800`}
        cz-shortcut-listen="true"
      >
        <ClientWrapper>  {/* Ensure everything is wrapped in ClientWrapper */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
         
          >
            <ReduxProvider>
              <SessionWraper>
                <Navbar />
                {children}
                <Toaster richColors position="top-center" />
                <Footer />
              </SessionWraper>
            </ReduxProvider>
          </ThemeProvider>
        </ClientWrapper>
      </body>
    </html>
  );
}
