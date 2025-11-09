"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; // ✅ Added
import { useAuth } from "@/app/provider/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRight, MapPin, X } from "lucide-react";

export const AddLocation = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) => {
  const { userId, token } = useAuth();
  const router = useRouter(); // ✅ Router for soft refresh
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Load saved address on mount
  useEffect(() => {
    const saved = localStorage.getItem("address");
    if (saved) setAddress(saved);
  }, []);

  // ✅ Save to backend + local
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

      // ✅ Close dialog first for smooth UX
      onOpenChange(false);

      // ✅ Wait a bit for dialog to close, then refresh
      setTimeout(() => {
        router.refresh(); // soft refresh — best for Next.js
        // window.location.reload(); // alternative: full reload
      }, 400);
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
    router.refresh(); // ✅ Refresh after clearing too
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 py-2 px-4 bg-neutral-900 hover:bg-neutral-800 rounded-full shadow-md cursor-pointer transition-all"
        >
          <MapPin className="text-red-500 w-5 h-5" />
          <p className="text-sm sm:text-base text-white truncate max-w-[160px] sm:max-w-[220px]">
            {address || "Add delivery address"}
          </p>
          {address && (
            <X
              className="text-gray-300 hover:text-white w-4 h-4 cursor-pointer transition"
              onClick={handleClear}
            />
          )}
          <ChevronRight className="text-gray-400 w-4 h-4" />
        </motion.div>
      </DialogTrigger>

      <DialogContent className="w-full max-w-md rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-lg shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-800">
            Delivery address
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm sm:text-base">
            Please enter your delivery address below.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your delivery address..."
            className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none h-[100px] transition-all"
          />
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="w-full sm:w-1/2 border-gray-300 hover:bg-gray-100 text-gray-700 font-medium rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full sm:w-1/2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition"
          >
            {loading ? "Saving..." : "Deliver here"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
