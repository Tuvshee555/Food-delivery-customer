"use client";

import { useEffect, useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import axios from "axios";

type OrderData = {
  id?: string;
  totalPrice?: number;
  deliveryFee?: number;
  productTotal?: number;
  createdAt?: string;
  items?: {
    id?: string;
    quantity: number;
    food: {
      foodName: string;
      price: number;
      image: string;
    };
  }[];
};

export default function PaymentPendingInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [qrText, setQrText] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [status, setStatus] = useState("⌛ Төлбөр үүсгэж байна...");

  const hasRequestedInvoice = useRef(false);

  useEffect(() => {
    if (!orderId) return;
    (async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${orderId}`
        );
        setOrder(res.data.order || res.data);
      } catch {
        toast.error("Захиалгын мэдээлэл олдсонгүй.");
      }
    })();
  }, [orderId]);

  useEffect(() => {
    if (!orderId || !order?.totalPrice) return;
    if (hasRequestedInvoice.current) return;
    hasRequestedInvoice.current = true;

    const createInvoice = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/qpay/create`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId,
              amount: order.totalPrice,
            }),
          }
        );

        const data = await res.json();

        if (!data.qr_text) {
          toast.error("Төлбөрийн QR үүсгэсэнгүй.");
          return;
        }

        setQrText(data.qr_text);
        setInvoiceId(data.invoice_id);
        setStatus("⌛ Төлбөр хүлээж байна...");
      } catch (err) {
        toast.error("QPay төлбөр үүсгэхэд алдаа гарлаа.");
        console.error(err);
      }
    };

    createInvoice();
  }, [order, orderId]);

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
          setStatus("✅ Төлбөр амжилттай хийгдлээ!");
          clearInterval(interval);
        }
      } catch {
        console.log("Checking payment...");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [invoiceId, paid]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-[130px] pb-24">
      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-10">
        {/* LEFT: QR SECTION */}
        <div className="flex-1 bg-white border border-gray-800 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">
            {paid ? "Төлбөр амжилттай хийгдлээ 🎉" : "Төлбөр хүлээгдэж байна"}
          </h2>

          <p className="text-gray-400 mb-8">
            Төлбөр төлөгдсөний дараа таны захиалга баталгаажих болно.
          </p>

          {!paid && qrText && (
            <div className="flex flex-col items-center gap-6">
              <QRCodeCanvas value={qrText} size={240} />
              <a
                href={`https://qpay.mn/q?q=${encodeURIComponent(qrText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2563eb] text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                QPay апп-аар төлөх
              </a>
              <div className="text-gray-400 mt-4 text-sm">{status}</div>
            </div>
          )}

          {paid && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="flex flex-col items-center gap-4 mt-10"
            >
              <div className="bg-green-500 text-white rounded-full p-6">✔</div>
              <p className="text-green-400 text-lg font-semibold">
                Төлбөр амжилттай хийгдлээ!
              </p>
            </motion.div>
          )}
        </div>

        {order?.items?.length ? (
          <div className="w-full lg:w-[400px] bg-[#111]/90 border border-gray-800 rounded-3xl p-8">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-800 pb-3">
              Захиалгын дэлгэрэнгүй
            </h3>

            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border-b border-gray-800 pb-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.food.image}
                      alt={item.food.foodName}
                      className="w-[64px] h-[64px] object-cover rounded-lg border border-gray-700"
                    />
                    <div>
                      <p className="font-medium">{item.food.foodName}</p>
                      <p className="text-gray-400 text-sm">
                        Тоо ширхэг: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <span className="text-[#facc15] font-semibold">
                    ₮{(item.food.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
