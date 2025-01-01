import type { Metadata } from "next";
import AuthProvider from '@/components/AuthProvider'
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-provider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "School Legal Dashboard",
  description: "This website is proudly created by three dedicated individuals, Shaheer Yousuf (@shaheer__yousuf),Emroze Khan (@notemrozekhan) and Saim Khalid (@i_saim_khalid). Follow them on Instagram to visualize your dreams into!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
