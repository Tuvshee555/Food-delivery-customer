"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { QPayDialog } from "@/app/qpay/QPayDialog";

export default function InfoStep({ router }: { router: any }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [openQPay, setOpenQPay] = useState(false);
  const [amount, setAmount] = useState<number>(0);

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleContinue = () => {
    if (!form.name || !form.phone || !form.address)
      return toast.error("📋 Мэдээлэл бүрэн оруулна уу.");

    // Save info
    localStorage.setItem("checkout_info", JSON.stringify(form));

    // Calculate total from localStorage cart
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!cart.length) return toast.error("🛒 Сагс хоосон байна.");
    const total = cart.reduce(
      (sum: number, item: any) => sum + item.food.price * item.quantity,
      0
    );
    const delivery = 9000;
    const grandTotal = total + delivery;

    setAmount(grandTotal);
    setOpenQPay(true);
  };

  const handlePaymentSuccess = () => {
    toast.success("✅ Төлбөр амжилттай хийгдлээ!");
    setOpenQPay(false);
    router.push("/checkout?step=payment");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl bg-[#0e0e0e]/90 border border-gray-800 rounded-3xl p-8 shadow-[0_0_40px_-10px_rgba(250,204,21,0.1)]"
      >
        <div className="mb-8 border-b border-gray-800 pb-3">
          <h1 className="text-3xl font-bold text-[#facc15]">
            🚚 Хүргэлтийн мэдээлэл
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Захиалгаа хүргүүлэхдээ оруулах мэдээллээ бөглөнө үү.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Овог нэр</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Жишээ: Бат-Эрдэнэ"
              className="w-full bg-[#1a1a1a] border border-gray-700 p-3 rounded-lg outline-none focus:border-[#facc15] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Утасны дугаар
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Жишээ: 99112233"
              className="w-full bg-[#1a1a1a] border border-gray-700 p-3 rounded-lg outline-none focus:border-[#facc15] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Хүргэлтийн хаяг
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Жишээ: Баянзүрх дүүрэг, 13-р хороолол, 10-р байр"
              className="w-full bg-[#1a1a1a] border border-gray-700 p-3 rounded-lg outline-none focus:border-[#facc15] transition-all h-[100px]"
            />
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-between mt-10">
          <Button
            variant="outline"
            onClick={() => router.push("/checkout")}
            className="border-gray-600 text-gray-300 hover:border-[#facc15] hover:text-[#facc15]"
          >
            Буцах
          </Button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleContinue}
            className="w-44 py-3 rounded-xl font-semibold text-black text-lg shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all bg-gradient-to-r from-[#facc15] to-[#fbbf24] hover:brightness-110"
          >
            Төлбөр хийх
          </motion.button>
        </div>
      </motion.div>

      {/* ✅ Integrate QPayDialog */}
      <QPayDialog
        open={openQPay}
        onOpenChange={setOpenQPay}
        amount={amount}
        orderId={`ORDER-${Date.now()}`}
        onSuccess={handlePaymentSuccess}
      />
    </main>
  );
}
