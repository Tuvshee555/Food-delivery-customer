"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Email = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("email");
    setUserEmail(email);
  }, []);

  const handleClick = () => {
    localStorage.removeItem("token");
    router.push(`/log-in`);
  };

  const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "?";

  return (
    <Dialog>
      {/* 🧍 Avatar Trigger */}
      <DialogTrigger asChild>
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
      </DialogTrigger>

      {/* ✉️ Dialog Content */}
      <AnimatePresence>
        <DialogContent
          className="w-[90%] max-w-[340px] bg-[#0e0e0e] text-white 
                     border border-gray-800 rounded-2xl shadow-[0_0_40px_-10px_rgba(250,204,21,0.1)] 
                     p-6 animate-in fade-in duration-300"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#facc15] truncate">
              {userEmail || "Guest Account"}
            </DialogTitle>
            <p className="text-sm text-gray-400 mt-1">
              {userEmail ? "Signed in to your account" : "Not signed in"}
            </p>
          </DialogHeader>

          {/* Divider */}
          <div className="h-[1px] bg-gray-800 my-4" />

          <DialogFooter className="flex flex-col gap-3 mt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleClick}
              className="w-full h-[42px] rounded-lg bg-gradient-to-r from-[#facc15] to-[#fbbf24]
                         text-black font-medium shadow-[0_0_15px_rgba(250,204,21,0.2)] 
                         hover:brightness-110 transition-all duration-200"
            >
              Sign out
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/profile")}
              className="w-full h-[42px] rounded-lg border border-gray-700 text-gray-300 
                         hover:border-[#facc15] hover:text-[#facc15] transition-all duration-200"
            >
              View Profile
            </motion.button>
          </DialogFooter>
        </DialogContent>
      </AnimatePresence>
    </Dialog>
  );
};
