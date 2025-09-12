"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "./AuthProvider";
import { CategoryProvider } from "./CategoryProvider";
import { FoodDataProvider } from "./FoodDataProvider";
import { Toaster } from "sonner";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CategoryProvider>
            <FoodDataProvider>
              {children}
              <Toaster />
            </FoodDataProvider>
          </CategoryProvider>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}
