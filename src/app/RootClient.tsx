"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId="424549876529-sln60g4usp2b71ijfihqs96o01qhogko.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
}
