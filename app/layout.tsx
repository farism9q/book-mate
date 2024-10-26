import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Open_Sans } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/components/providers/modal-provider";
import QueryProvider from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { Check, Loader, X } from "lucide-react";
import { SheetProvider } from "@/components/providers/sheet-provider";
import { SidebarProvider } from "@/components/ui/sidebar";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Book Mate",
    template: `%s | Book Mate`,
  },
  description: "Search for books and know more about them",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "bg-white dark:bg-[#080808]")}>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={true}
              storageKey="book-mate-theme"
            >
              <SidebarProvider>
                {/* <AppSidebar /> */}
                <ModalProvider />
                <SheetProvider />
                <Toaster
                  toastOptions={{
                    classNames: {
                      error: "border border-rose-500",
                      loading: "border border-zinc-700",
                      success: "border border-emerald-500",
                    },
                  }}
                  icons={{
                    success: (
                      <Check className="bg-emerald-500 text-white w-5 h-5 p-[2px] rounded-full" />
                    ),
                    loading: (
                      <Loader className="bg-zinc-700 text-white w-5 h-5 p-[2px] rounded-full animate-spin" />
                    ),
                    error: (
                      <X className="bg-rose-500 text-white w-5 h-5 p-[2px] rounded-full" />
                    ),
                  }}
                />

                {children}
              </SidebarProvider>
            </ThemeProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
