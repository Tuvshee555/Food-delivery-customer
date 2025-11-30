"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { Clock, DollarSign } from "lucide-react";

export const CategoryHeader = ({
  title,
  count,
  onSortChange,
}: {
  title: string;
  count: number;
  onSortChange: (sortType: string) => void;
}) => {
  const { t } = useI18n();
  const [sort, setSort] = useState("newest");

  const handleChange = (value: string) => {
    setSort(value);
    onSortChange(value);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800 pb-4 gap-3">
      {/* 🏷️ Title Section */}
      <h1 className="text-2xl font-bold tracking-tight text-white">
        {title}
        <span className="text-gray-400 text-sm ml-2">({count})</span>
      </h1>

      {/* 🔽 Sort Dropdown */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400 font-medium">
          {t("sort_by")}:
        </span>

        <Select value={sort} onValueChange={handleChange}>
          <SelectTrigger className="w-[200px] bg-[#1a1a1a] border border-gray-700 rounded-lg text-gray-300 font-medium shadow-sm hover:border-[#facc15]/40 transition-all focus:ring-1 focus:ring-[#facc15] focus:border-[#facc15]">
            <SelectValue placeholder={t("sorting")} />
          </SelectTrigger>

          <SelectContent className="bg-[#111] border border-gray-700 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.55)] backdrop-blur-sm overflow-hidden">
            <SelectItem
              value="newest"
              className="flex items-center gap-2 hover:bg-[#1a1a1a] cursor-pointer"
            >
              <Clock className="w-4 h-4 text-[#facc15]" />
              {t("sort_newest")}
            </SelectItem>

            <SelectItem
              value="oldest"
              className="flex items-center gap-2 hover:bg-[#1a1a1a] cursor-pointer"
            >
              <Clock className="w-4 h-4 text-[#71717a]" />
              {t("sort_oldest")}
            </SelectItem>

            <SelectItem
              value="low"
              className="flex items-center gap-2 hover:bg-[#1a1a1a] cursor-pointer"
            >
              <DollarSign className="w-4 h-4 text-green-400" />
              {t("sort_price_low")}
            </SelectItem>

            <SelectItem
              value="high"
              className="flex items-center gap-2 hover:bg-[#1a1a1a] cursor-pointer"
            >
              <DollarSign className="w-4 h-4 text-red-400" />
              {t("sort_price_high")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
