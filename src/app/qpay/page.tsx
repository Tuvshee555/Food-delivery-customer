"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function QPayPage() {
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const createPayment = async (amount = 10000) => {
    setLoading(true);
    setStatus("");
    setPaid(false);
    setQrImage(null);
    setInvoiceId(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/qpay/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: `ORDER_${Date.now()}`, amount }),
        }
      );

      if (!res.ok) throw new Error("Failed to create invoice");

      const data = await res.json();
      setQrImage(`data:image/png;base64,${data.qr_image}`);
      setInvoiceId(data.invoice_id);
      setStatus("⌛ Waiting for payment...");
    } catch (err: any) {
      console.error("Create payment error:", err.message);
      setStatus("❌ Failed to create payment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!invoiceId || paid) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/qpay/check`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ invoiceId }),
          }
        );

        if (!res.ok) throw new Error("Failed to check payment");

        const data = await res.json();
        if (data.paid) {
          setPaid(true);
          setStatus("✅ Payment received!");
          clearInterval(interval);
        }
      } catch (err: any) {
        console.error("Check payment error:", err.message);
        setStatus("⚠️ Checking payment failed, retrying...");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [invoiceId, paid]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <h1 className="text-2xl font-bold">QPay Integration</h1>

      <button
        onClick={() => createPayment(10000)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50 transition-all hover:bg-blue-700"
        disabled={loading || !!invoiceId}
      >
        {loading ? "Processing..." : paid ? "Paid ✅" : "Pay 10,000₮"}
      </button>

      {qrImage && (
        <div className="flex flex-col items-center gap-3 mt-4">
          <Image
            src={qrImage}
            alt="QR Code"
            width={200}
            height={200}
            className="rounded-md shadow-md"
          />
          <p className="text-lg font-medium">{status}</p>

          {!paid && (
            <button
              onClick={() => setInvoiceId(null)}
              className="mt-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel / Retry
            </button>
          )}
        </div>
      )}

      {!qrImage && status && <p className="text-lg mt-4">{status}</p>}
    </div>
  );
}
