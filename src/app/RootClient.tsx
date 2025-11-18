"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import Providers from "./provider/Providers";
import { Header } from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

export default function RootClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId="424549876529-sln60g4usp2b71ijfihqs96o01qhogko.apps.googleusercontent.com">
      <Providers>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </Providers>
    </GoogleOAuthProvider>
  );
}
