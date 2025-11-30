"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useCategory } from "@/app/[locale]/provider/CategoryProvider";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

export const CategoryNameList = () => {
  const { category, loading } = useCategory();
  const router = useRouter();
  const { locale, t } = useI18n();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 text-gray-300 gap-2">
        <Loader2 className="animate-spin text-yellow-400 w-6 h-6" />
        <span>{t("loading_categories")}</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
        {category.map((c, index) => (
          <motion.div
            key={c.id || index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/${locale}/category-type/${c.id}`)}
            className="py-2 sm:py-3 px-4 sm:px-6 text-xs sm:text-sm md:text-base 
              rounded-full border border-gray-700 text-white
              bg-[#111]/90 backdrop-blur-md shadow-md hover:shadow-lg hover:border-[#facc15]
              transition-all cursor-pointer select-none min-w-[90px] sm:min-w-[100px]"
          >
            <span className="font-medium truncate">{c.categoryName}</span>
            <span className="text-[11px] bg-gray-800 rounded-full px-2 py-[1px]">
              {c.foodCount}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
