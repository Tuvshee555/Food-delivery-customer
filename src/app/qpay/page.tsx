"use client";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QPayPage() {
  const [qrText, setQrText] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [status, setStatus] = useState("Ready to create invoice");
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  const createPayment = async (amount = 10000) => {
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
          body: JSON.stringify({ orderId: `ORDER_${Date.now()}`, amount }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create invoice");

      setQrText(data.qr_text);
      setInvoiceId(data.invoice_id);
      setStatus("⌛ Waiting for payment...");
    } catch (err: any) {
      setStatus(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Poll payment status
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

        const data = await res.json();
        if (data.paid) {
          setPaid(true);
          setStatus("✅ Payment successful!");
          clearInterval(interval);
        }
      } catch {
        setStatus("⚠️ Retrying payment check...");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [invoiceId, paid]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <h1 className="text-2xl font-bold">QPay Integration</h1>

      <button
        onClick={() => createPayment(10000)}
        disabled={loading || !!invoiceId}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : paid ? "Paid ✅" : "Pay 10,000₮"}
      </button>

      {qrText && (
        <div className="flex flex-col items-center gap-3 mt-4">
          <QRCodeCanvas value={qrText} size={220} />
          <p className="text-lg font-medium">{status}</p>
        </div>
      )}

      {!qrText && <p className="text-gray-600">{status}</p>}
    </div>
  );
}

// import { QRCodeCanvas } from "qrcode.react";

// export const QPayPage = ({ qr_text }: { qr_text: string }) => {
//   return (
//     <div className="flex flex-col items-center">
//       <QRCodeCanvas value={qr_text} size={220} />
//       <p className="mt-2 text-sm text-gray-500">Scan to pay</p>
//     </div>
//   );
// };
