'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { CategoryProvider } from "../app/provider/CategoryProvider";
import { FoodDataProvider } from "./provider/FoodDataProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import { useState } from "react";
import { AuthProvider } from "./provider/AuthProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>  {/* Wrap your existing providers with AuthProvider */}
            <CategoryProvider>
              <FoodDataProvider>
                {children}
                <Toaster /> 
              </FoodDataProvider>
            </CategoryProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
