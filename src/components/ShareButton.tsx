"use client";

import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { toast } from "sonner";

export const ShareButton = ({ title, url }: { title: string; url: string }) => {
  const { t } = useI18n();

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: title,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success(t("copied_link"));
      }
    } catch {
      // user cancelled — do nothing
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="
        inline-flex items-center gap-2
        text-sm font-medium
        text-muted-foreground
        hover:text-foreground
        transition-colors
        active:scale-[0.97]
        focus:outline-none
      "
      aria-label={t("share")}
    >
      {/* icon */}
      <span className="text-base leading-none">↗</span>
      {t("share")}
    </button>
  );
};
