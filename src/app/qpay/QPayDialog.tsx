"use client";

import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type QPayDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  orderId: string;
  onSuccess?: () => void;
};

type QPayCreateResponse = {
  qr_text: string;
  qr_image: string;
  invoice_id: string;
};

type QPayCheckResponse = {
  paid: boolean;
};

export const QPayDialog = ({
  open,
  onOpenChange,
  amount,
  orderId,
  onSuccess,
}: QPayDialogProps) => {
  const [qrText, setQrText] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Ready to create invoice");
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  const createPayment = async () => {
    if (amount <= 0) return setStatus("❌ Invalid amount");
    setLoading(true);
    setStatus("Creating invoice...");
    setPaid(false);
    setQrText(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/qpay/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, amount }),
        }
      );
      const data: QPayCreateResponse = await res.json();
      if (!res.ok) throw new Error(data?.qr_text || "Failed to create invoice");

      setQrText(data.qr_text);
      setInvoiceId(data.invoice_id);
      setStatus("⌛ Waiting for payment...");
    } catch (err: any) {
      setStatus(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!invoiceId || paid) return;
    let interval: number | null = null; // ✅ browser-safe

    const checkPayment = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/qpay/check`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ invoiceId }),
          }
        );
        const data: QPayCheckResponse = await res.json();
        if (data.paid) {
          setPaid(true);
          setStatus("✅ Payment successful!");
          onSuccess?.();
          setTimeout(() => onOpenChange(false), 2000);
          if (interval) clearInterval(interval);
        }
      } catch {
        setStatus("⚠️ Retrying payment check...");
      }
    };

    interval = window.setInterval(checkPayment, 5000); // ✅ use window.setInterval
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [invoiceId, paid, onOpenChange, onSuccess]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md flex flex-col items-center gap-4">
        <DialogHeader>
          <DialogTitle>QPay Checkout</DialogTitle>
        </DialogHeader>

        {!paid && !qrText && (
          <button
            onClick={createPayment}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : `Pay ₮${amount}`}
          </button>
        )}

        {!paid && qrText && (
          <div className="flex flex-col items-center gap-3 mt-2">
            <QRCodeCanvas value={qrText} size={220} />
            <p className="text-lg font-medium">{status}</p>
          </div>
        )}

        {paid && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 10 }}
            className="flex flex-col items-center gap-4 mt-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="bg-green-500 text-white rounded-full p-6"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
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
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl font-semibold text-green-600"
            >
              Payment Successful 🎉
            </motion.p>
          </motion.div>
        )}

        <p className="text-gray-600">{status}</p>
      </DialogContent>
    </Dialog>
  );
};
