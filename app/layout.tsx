import type { Metadata } from "next";
import AuthProvider from '@/components/AuthProvider'
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"

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
      <head>
        {/* Add your favicon here */}
        <link rel="icon" href="/logo.png" />
        {/* Optional: Add support for other favicon formats */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </head>
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
        <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

// 