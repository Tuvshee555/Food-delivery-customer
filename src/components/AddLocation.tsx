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
import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/app/provider/AuthProvider";

export const AddLocation = () => {
  const [address, setAddress] = useState("");
  const { userId, token } = useAuth();

  const postAddress = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/user/${userId}`,
        { address: address },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Successfully added location");
      console.log("Address updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to add location");
    } finally {
      localStorage.setItem("address", address);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex py-2 px-3 gap-2 bg-black rounded-full text-sm items-center cursor-pointer">
          <MapPin stroke="#EF4444" />
          {!address ? (
            <>
              <span className="text-[#EF4444]">Delivery address</span>
              <span className="text-[#71717a]">Add location</span>
              <ChevronRight stroke="#71717a" />
            </>
          ) : (
            <div className="flex items-center gap-2 max-w-[200px] truncate">
              <p className="text-white text-sm truncate">{address}</p>
              <X
                stroke="white"
                className="cursor-pointer"
                onClick={() => setAddress("")}
              />
            </div>
          )}
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
            placeholder="Provide building number, entrance, and apartment number"
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
