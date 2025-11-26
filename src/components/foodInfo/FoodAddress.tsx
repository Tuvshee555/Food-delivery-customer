"use client";

import { ShareButton } from "@/components/ShareButton";

export const FoodAddress = ({
  foodName,
  address,
}: {
  foodName: string;
  address: string | null;
}) => {
  return (
    <div className="flex justify-between items-center text-gray-400 text-sm pt-5 border-t border-gray-800 mt-6">
      <span className="truncate max-w-[65%]">
        📍 Хаяг:{" "}
        <span className="text-gray-300">
          {address || "Хаяг оруулаагүй байна"}
        </span>
      </span>

      <ShareButton title={foodName} />
    </div>
  );
};
