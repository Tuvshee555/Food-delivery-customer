"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/provider/AuthProvider";
import { toast } from "sonner";
import { QPayDialog } from "@/app/qpay/QPayDialog";

export default function PaymentStep({
  cart,
  router,
}: {
  cart: any[];
  router: any;
}) {
  const { userId, token } = useAuth();
  const [info, setInfo] = useState<any>(null);
  const [showQR, setShowQR] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const total =
    cart.reduce((sum, i) => sum + i.food.price * i.quantity, 0) + 9000;

  useEffect(() => {
    const i = localStorage.getItem("checkout_info");
    if (i) setInfo(JSON.parse(i));
    setOrderId(`ORDER_${Date.now()}`);
  }, []);

  const handleShowQPay = () => {
    if (!info) return toast.error("Хүргэлтийн мэдээлэл дутуу байна.");
    if (!cart.length) return toast.error("Сагс хоосон байна.");
    setShowQR(true);
  };

  return (
    <main className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
      <div className="max-w-md w-full bg-[#111] p-6 rounded-2xl text-center">
        <h2 className="text-2xl font-semibold mb-4">Төлбөрийн хэсэг</h2>
        <p className="text-gray-400 mb-6">
          Нийт дүн: {total.toLocaleString()}₮
        </p>

        {!showQR ? (
          <button
            onClick={handleShowQPay}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-6 rounded-lg w-full font-semibold"
          >
            QPay-р төлөх
          </button>
        ) : (
          <QPayDialog
            open={true}
            onOpenChange={() => router.push("/checkout?step=done")}
            amount={total}
            orderId={orderId!}
            onSuccess={async () => {
              // ✅ Only create order AFTER payment is confirmed
              try {
                const res = await fetch(
                  `${process.env.NEXT_PUBLIC_BACKEND_URL}/order`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      userId,
                      totalPrice: total,
                      location: info.address,
                      items: cart.map((item) => ({
                        foodId: item.food._id || item.food.id,
                        quantity: item.quantity,
                      })),
                    }),
                  }
                );

                if (!res.ok)
                  throw new Error("Failed to create order after payment.");

                toast.success("Захиалга амжилттай төлөгдлөө! 🎉");
                router.push("/checkout?step=done");
              } catch (err: any) {
                toast.error(err.message);
              }
            }}
          />
        )}
      </div>
    </main>
  );
}
