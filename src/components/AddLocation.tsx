"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, X, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/app/provider/AuthProvider";
import { motion } from "framer-motion";

export const AddLocation = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) => {
  const [address, setAddress] = useState("");
  const [storedAddress, setStoredAddress] = useState<string | null>(null);
  const { userId, token } = useAuth();

  useEffect(() => {
    const add = localStorage.getItem("address");
    if (add) setStoredAddress(add);
  }, []);

  const postAddress = async () => {
    if (!userId) {
      toast.error("User not authenticated!");
      return;
    }

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`,
        { address },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Successfully added location");
      localStorage.setItem("address", address);
      setStoredAddress(address);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("❌ Failed to add location");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="flex py-2 px-4 sm:px-5 gap-2 bg-black/90 hover:bg-black rounded-full text-sm sm:text-base items-center cursor-pointer shadow-lg transition-all"
        >
          <MapPin stroke="#EF4444" className="w-5 h-5 sm:w-6 sm:h-6" />
          {!address && !storedAddress ? (
            <span className="text-[#EF4444] font-medium tracking-wide">
              Delivery address
            </span>
          ) : (
            <div className="flex items-center gap-2 max-w-[150px] sm:max-w-[200px] truncate">
              <p className="text-white text-sm sm:text-base truncate">
                {address || storedAddress}
              </p>
              <X
                stroke="white"
                className="cursor-pointer hover:scale-110 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  setAddress("");
                  setStoredAddress(null);
                  localStorage.removeItem("address");
                }}
              />
            </div>
          )}
          <ChevronRight stroke="#a1a1aa" className="ml-1" />
        </motion.div>
      </DialogTrigger>

      <DialogContent className="w-full max-w-sm sm:max-w-md rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-lg shadow-2xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-800">
            Delivery address
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm sm:text-base">
            Please enter your address details below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-3">
          <textarea
            className="border border-gray-300 w-full rounded-xl h-[100px] sm:h-[120px] p-3 text-gray-800 text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
            placeholder={storedAddress || "Please provide your location"}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-2">
          <Button
            variant="outline"
            onClick={() => setAddress("")}
            className="w-full sm:w-1/2 border-gray-300 hover:bg-gray-100 text-gray-700 font-medium rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={postAddress}
            className="w-full sm:w-1/2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg"
          >
            Deliver here
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
