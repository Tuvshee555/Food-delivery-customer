"use client";

import { User, Package, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";

export const MenuButtons = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col px-6 py-5 gap-4">
      <button
        onClick={() => router.push("/profile?tab=profile")}
        className="flex items-start gap-3 p-4 rounded-xl bg-[#111]/90 border border-gray-800 hover:border-[#facc15] transition"
      >
        <User className="w-5 h-5 text-[#facc15]" />
        <div>
          <p className="font-semibold">Профайл</p>
          <p className="text-gray-400 text-sm">Таны мэдээлэл</p>
        </div>
      </button>

      <button
        onClick={() => router.push("/profile?tab=orders")}
        className="flex items-start gap-3 p-4 rounded-xl bg-[#111]/90 border border-gray-800 hover:border-[#facc15] transition"
      >
        <Package className="w-5 h-5 text-[#facc15]" />
        <div>
          <p className="font-semibold">Захиалгууд</p>
          <p className="text-gray-400 text-sm">Захиалгын түүх</p>
        </div>
      </button>

      <button
        onClick={() => router.push("/profile?tab=tickets")}
        className="flex items-start gap-3 p-4 rounded-xl bg-[#111]/90 border border-gray-800 hover:border-[#facc15] transition"
      >
        <Ticket className="w-5 h-5 text-[#facc15]" />
        <div>
          <p className="font-semibold">Миний тасалбар</p>
          <p className="text-gray-400 text-sm">Тасалбарууд</p>
        </div>
      </button>
    </div>
  );
};
