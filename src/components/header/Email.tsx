"use client";

import { useEffect, useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { User, Package, Ticket, LogOut } from "lucide-react";

export const Email = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  // ✅ Load saved email from localStorage
  useEffect(() => {
    const email = localStorage.getItem("email");
    setUserEmail(email);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/log-in");
  };

  const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "?";

  return (
    <Sheet>
      {/* 🟡 Avatar Trigger */}
      <SheetTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-[42px] h-[42px] 
                     rounded-full border border-gray-700 bg-[#1a1a1a] 
                     hover:border-[#facc15] transition-all duration-300 
                     hover:shadow-[0_0_12px_rgba(250,204,21,0.3)]"
        >
          <span className="text-lg font-semibold text-[#facc15]">
            {firstLetter}
          </span>
        </motion.button>
      </SheetTrigger>

      {/* 📩 Sheet Content */}
      <SheetContent
        side="right"
        className="w-full sm:max-w-[420px] bg-[#0a0a0a] text-white border-l border-gray-800 
                   flex flex-col justify-between p-0 overflow-hidden"
      >
        {/* ✅ Hidden accessible title (fixes Radix warning) */}
        <VisuallyHidden>
          <SheetTitle>User Profile Menu</SheetTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="flex flex-col items-center pt-8 pb-6 border-b border-gray-800">
          <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-semibold text-[#facc15]">
            {firstLetter}
          </div>
          <h2 className="mt-3 font-medium text-gray-300 text-sm">
            {userEmail || "Guest"}
          </h2>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col px-6 py-5 gap-4">
          <button
            onClick={() => router.push("/profile")}
            className="flex items-start gap-3 p-4 rounded-xl bg-[#111]/80 border border-gray-800 hover:border-[#facc15] transition-all"
          >
            <User className="w-5 h-5 text-[#facc15]" />
            <div className="text-left">
              <p className="font-semibold text-white text-[15px]">Профайл</p>
              <p className="text-gray-400 text-sm">
                Овог нэр, утас болон хүргэлтийн хаяг солих
              </p>
            </div>
          </button>

          <button
            onClick={() => router.push("/orders")}
            className="flex items-start gap-3 p-4 rounded-xl bg-[#111]/80 border border-gray-800 hover:border-[#facc15] transition-all"
          >
            <Package className="w-5 h-5 text-[#facc15]" />
            <div className="text-left">
              <p className="font-semibold text-white text-[15px]">Захиалгууд</p>
              <p className="text-gray-400 text-sm">
                Захиалгын түүх харах, захиалгаа хянах
              </p>
            </div>
          </button>

          <button
            onClick={() => router.push("/tickets")}
            className="flex items-start gap-3 p-4 rounded-xl bg-[#111]/80 border border-gray-800 hover:border-[#facc15] transition-all"
          >
            <Ticket className="w-5 h-5 text-[#facc15]" />
            <div className="text-left">
              <p className="font-semibold text-white text-[15px]">
                Миний тасалбар
              </p>
              <p className="text-gray-400 text-sm">
                Худалдан авсан тасалбараа харах, ашиглах
              </p>
            </div>
          </button>
        </div>

        {/* Footer */}
        <SheetFooter className="border-t border-gray-800 p-5 bg-[#111]/80">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 
                       text-white py-3 rounded-xl font-semibold text-[15px] transition-all"
          >
            <LogOut className="w-4 h-4" /> Системээс гарах
          </motion.button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
