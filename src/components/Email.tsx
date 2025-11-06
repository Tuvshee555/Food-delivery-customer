"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
      {/* Avatar Button */}
      <DialogTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="border border-gray-200 rounded-full h-[44px] w-[44px] flex items-center 
                     justify-center bg-gradient-to-r from-orange-100 to-red-100 shadow-sm 
                     hover:shadow-md transition-all duration-200"
        >
          <span className="text-lg font-semibold text-red-600">
            {firstLetter}
          </span>
        </motion.button>
      </DialogTrigger>

      {/* Dialog */}
      <AnimatePresence>
        <DialogContent
          className="w-[90%] max-w-[320px] p-6 rounded-2xl shadow-2xl border border-gray-100
                     bg-white text-center sm:w-[280px] animate-in fade-in duration-200"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800 break-words">
              {userEmail || "Your Email"}
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              Signed in to your account
            </p>
          </DialogHeader>

          <DialogFooter className="flex flex-col gap-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleClick}
              className="w-full h-[42px] rounded-lg bg-gradient-to-r from-red-500 to-orange-500 
                         hover:from-red-600 hover:to-orange-600 text-white font-medium 
                         shadow-md hover:shadow-lg transition-all duration-200"
            >
              Sign out
            </motion.button>
          </DialogFooter>
        </DialogContent>
      </AnimatePresence>
    </Dialog>
  );
};
