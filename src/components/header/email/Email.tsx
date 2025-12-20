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
import { useI18n } from "@/components/i18n/ClientI18nProvider";

export const Email = () => {
  useFacebookSDK();

  const { t } = useI18n();
  const email = useEmailSync();
  const { token, setAuthToken } = useAuth();

  const firstLetter = email ? email[0].toUpperCase() : "?";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          aria-label={t("user")}
          className="
            w-[42px] h-[42px]
            rounded-full
            flex items-center justify-center
            bg-background
            border border-border
            text-foreground
            text-sm font-semibold
            transition
            hover:border-primary
            hover:shadow-[0_0_12px_hsl(var(--primary)/0.25)]
          "
        >
          {firstLetter}
        </motion.button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="
          fixed inset-y-0 right-0
          w-full sm:max-w-[538px]
          bg-card text-card-foreground
          border-l border-border
          p-0
          z-[9999]
          shadow-2xl
        "
      >
        <VisuallyHidden>
          <SheetTitle>{t("user_menu")}</SheetTitle>
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
