"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { useFacebookSDK } from "./hooks/useFacebookSDK";
import { useEmailSync } from "./hooks/useEmailSync";
import { EmailLoggedOut } from "./EmailLoggedOut";
import { EmailLoggedIn } from "./EmailLoggedIn";
import { useAuth } from "@/app/[locale]/provider/AuthProvider";

export const Email = () => {
  useFacebookSDK();

  const email = useEmailSync();
  const { token, setAuthToken } = useAuth();

  const firstLetter = email ? email[0].toUpperCase() : "?";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-[42px] h-[42px] rounded-full border border-gray-700 bg-[#1a1a1a] text-[#facc15] text-lg font-bold"
        >
          {firstLetter}
        </motion.button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="fixed inset-y-0 right-0 w-full sm:max-w-[420px]
          bg-[#0a0a0a] text-white border-l border-gray-800 p-0
          z-[9999]"
      >
        <VisuallyHidden>
          <SheetTitle>User Menu</SheetTitle>
        </VisuallyHidden>

        {!token ? (
          <EmailLoggedOut />
        ) : (
          <EmailLoggedIn
            email={email ?? ""}
            firstLetter={firstLetter}
            clearToken={() => setAuthToken(null)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
