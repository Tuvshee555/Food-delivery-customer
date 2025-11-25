/* eslint-disable react/no-unescaped-entities */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Truck, CreditCard } from "lucide-react";

export default function TermsDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0a0a0a] text-white border-gray-800 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold mb-4">
            Үйлчилгээний нөхцөл зөвшөөрөх
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 text-gray-300">
          <div>
            <p className="flex items-center gap-2 font-medium text-white mb-1">
              <ShieldCheck size={18} /> Үйлчилгээний нөхцөл
            </p>
            <p className="text-sm">
              Хэрэв манай онлайн дэлгүүрийн үйлчилгээтэй холбоотой санал хүсэлт,
              гомдол зэргийг мэдэгдэхийг хүсвэл манай Instagram, Facebook
              хаягийн чатаар холбогдоорой.
            </p>
          </div>

          <div>
            <p className="flex items-center gap-2 font-medium text-white mb-1">
              <Truck size={18} /> Хүргэлтийн нөхцөл
            </p>
            <p className="text-sm">
              Захиалга баталгаажсанаас хойш 24–72 цагийн дотор хүргэлт хийгдэнэ.
              Хүргэлтээр очсон бараа буцаалт болон размер солих нөхцөлгүй
              болохыг анхааруулж байна.
            </p>
          </div>

          <div>
            <p className="flex items-center gap-2 font-medium text-white mb-1">
              <CreditCard size={18} /> Төлбөрийн нөхцөл
            </p>
            <p className="text-sm">
              Та худалдан авалтын төлбөрөө зөвхөн "QPay" төлбөрийн системээр
              төлөх боломжтой.
            </p>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline" className="text-gray-300 border-gray-700">
              Цуцлах
            </Button>
          </DialogClose>
          <Button
            onClick={onConfirm}
            className="bg-gradient-to-r from-[#facc15] to-[#fbbf24] text-black font-semibold hover:brightness-110"
          >
            Үргэлжлүүлэх
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
