"use client";

import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { toast } from "sonner";

export const ShareButton = ({ title, url }: { title: string; url: string }) => {
  const { t } = useI18n();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: title,
          url,
        });
      } catch (err) {
        console.log("Share canceled", err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success(t("copied_link"));
    }
  };

  return (
    <button
      onClick={handleShare}
      className="text-[#facc15] hover:text-[#ffdd4d] font-semibold transition"
    >
      🔗 {t("share")}
    </button>
  );
};
