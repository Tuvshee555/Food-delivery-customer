"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/provider/AuthProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AddLocation = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) => {
  const { userId, token } = useAuth();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Load saved address on mount
  useEffect(() => {
    const saved = localStorage.getItem("address");
    if (saved) setAddress(saved);
  }, []);

  // ✅ Save to backend + local storage
  const handleSave = async () => {
    if (!address.trim()) {
      toast.error("Please enter a valid address.");
      return;
    }
    if (!userId || !token) {
      toast.error("You must be logged in.");
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`,
        { address },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("address", address);
      toast.success("✅ Address saved successfully!");

      // ✅ Close dialog and reload smoothly
      onOpenChange(false);
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      console.error(error);
      toast.error("❌ Could not save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Clear stored address
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.removeItem("address");
    setAddress("");
    toast.info("Address cleared");
    setTimeout(() => window.location.reload(), 400);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* 🧭 Trigger - Matches Email/Search/Cart Style */}
      <DialogTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-auto sm:w-auto px-4 h-[42px] rounded-full 
                     border border-gray-700 bg-[#1a1a1a] hover:border-[#facc15] transition-all duration-300 
                     hover:shadow-[0_0_12px_rgba(250,204,21,0.3)] text-sm text-gray-200"
        >
          <MapPin className="text-[#facc15] w-5 h-5 mr-2" />
          <span className="truncate max-w-[150px] sm:max-w-[220px] text-gray-300">
            {address ? address : "Add delivery address"}
          </span>
          {address && (
            <X
              className="text-gray-400 hover:text-[#facc15] w-4 h-4 ml-2 cursor-pointer transition"
              onClick={handleClear}
            />
          )}
          <ChevronRight className="text-gray-500 w-4 h-4 ml-1" />
        </motion.button>
      </DialogTrigger>

      {/* 📍 Dialog */}
      <AnimatePresence>
        <DialogContent
          className="w-[90%] max-w-[420px] bg-[#0e0e0e] text-white border border-gray-800 
                     rounded-2xl shadow-[0_0_40px_-10px_rgba(250,204,21,0.15)] p-6 animate-in fade-in duration-300"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#facc15]">
              Delivery Address
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-sm mt-1">
              Please enter your delivery address below.
            </DialogDescription>
          </DialogHeader>

          {/* Address input */}
          <div className="py-4">
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your delivery address..."
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl p-3 text-sm text-gray-200
                         focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15] outline-none resize-none
                         h-[100px] transition-all"
            />
          </div>

          {/* Footer buttons */}
          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="w-full sm:w-1/2 h-[42px] rounded-lg border border-gray-700 text-gray-300 
                         hover:border-[#facc15] hover:text-[#facc15] transition-all duration-200"
            >
              Cancel
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              disabled={loading}
              className="w-full sm:w-1/2 h-[42px] rounded-lg bg-gradient-to-r from-[#facc15] to-[#fbbf24] 
                         text-black font-semibold shadow-[0_0_15px_rgba(250,204,21,0.2)] hover:brightness-110 
                         transition-all duration-200"
            >
              {loading ? "Saving..." : "Deliver Here"}
            </motion.button>
          </DialogFooter>
        </DialogContent>
      </AnimatePresence>
    </Dialog>
  );
};
