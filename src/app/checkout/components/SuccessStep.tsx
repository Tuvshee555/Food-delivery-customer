"use client";

import { motion } from "framer-motion";

export default function SuccessStep() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
        className="bg-green-500 rounded-full p-8 mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </motion.div>
      <h1 className="text-2xl font-bold mb-2">Захиалга амжилттай 🎉</h1>
      <p className="text-gray-400">Бид таны захиалгыг баталгаажууллаа.</p>
    </main>
  );
}
