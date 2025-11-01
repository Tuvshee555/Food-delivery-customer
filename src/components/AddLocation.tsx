// AddLocation.tsx
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
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`,
        { address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Successfully added location");
      localStorage.setItem("address", address);
      setStoredAddress(address);
      onOpenChange(false); // ✅ close after saving
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to add location");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div className="flex py-2 px-3 gap-2 bg-black rounded-full text-sm items-center cursor-pointer">
          <MapPin stroke="#EF4444" />
          {!address && !storedAddress ? (
            <span className="text-[#EF4444]">Delivery address</span>
          ) : (
            <div className="flex items-center gap-2 max-w-[200px] truncate">
              <p className="text-white text-sm truncate">
                {address || storedAddress}
              </p>
              <X
                stroke="white"
                className="cursor-pointer"
                onClick={() => {
                  setAddress("");
                  setStoredAddress(null);
                  localStorage.removeItem("address");
                }}
              />
            </div>
          )}
          <ChevronRight stroke="#71717a" />
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delivery address</DialogTitle>
          <DialogDescription>
            Please enter your address details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <textarea
            className="border w-full rounded-md h-[100px] p-2 text-black focus:ring-2 focus:ring-black"
            placeholder={storedAddress || "Please provide your location"}
            rows={5}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setAddress("")}>
            Cancel
          </Button>
          <Button onClick={postAddress}>Deliver here</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
