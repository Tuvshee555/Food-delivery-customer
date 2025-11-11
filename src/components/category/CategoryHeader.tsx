"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CategoryHeader = ({
  title,
  count,
  onSortChange,
}: {
  title: string;
  count: number;
  onSortChange: (sortType: string) => void;
}) => {
  const [sort, setSort] = useState("newest");

  const handleChange = (value: string) => {
    setSort(value);
    onSortChange(value);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800 pb-4 gap-3">
      {/* 🏷️ Title */}
      <h1 className="text-2xl font-bold tracking-tight text-white">
        {title}
        <span className="text-gray-400 text-sm ml-2">({count})</span>
      </h1>

      {/* 🔽 Sort Select */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Эрэмбэлэх:</span>
        <Select value={sort} onValueChange={handleChange}>
          <SelectTrigger className="w-[180px] bg-[#111] border border-gray-700 text-gray-300 rounded-lg focus:ring-1 focus:ring-[#facc15] focus:border-[#facc15] transition-all duration-200 hover:border-[#facc15]/50">
            <SelectValue placeholder="Эрэмбэлэх" />
          </SelectTrigger>
          <SelectContent className="bg-[#111] border border-gray-700 text-gray-300 shadow-lg rounded-lg">
            <SelectItem
              value="newest"
              className="hover:bg-[#1a1a1a] hover:text-[#facc15] cursor-pointer"
            >
              🕓 Шинэ нь эхэндээ
            </SelectItem>
            <SelectItem
              value="oldest"
              className="hover:bg-[#1a1a1a] hover:text-[#facc15] cursor-pointer"
            >
              🕰 Хуучин нь эхэндээ
            </SelectItem>
            <SelectItem
              value="low"
              className="hover:bg-[#1a1a1a] hover:text-[#facc15] cursor-pointer"
            >
              💸 Үнэ багаас их
            </SelectItem>
            <SelectItem
              value="high"
              className="hover:bg-[#1a1a1a] hover:text-[#facc15] cursor-pointer"
            >
              💰 Үнэ ихээс бага
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
