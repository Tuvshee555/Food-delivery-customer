"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/app/provider/AuthProvider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { QPayDialog } from "@/app/qpay/QPayDialog";
import { Header } from "@/components/header/Header";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function InfoStep({ router }: { router: any }) {
  const { userId, token } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phonenumber: "",
    city: "Улаанбаатар",
    district: "",
    khoroo: "",
    address: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [cart, setCart] = useState<any[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [openQPay, setOpenQPay] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("qpay");

  useEffect(() => {
    if (!userId || !token) return;
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success && res.data.user) {
          const u = res.data.user;
          setForm({
            firstName: u.firstName || "",
            lastName: u.lastName || "",
            phonenumber: u.phonenumber || "",
            city: u.city || "Улаанбаатар",
            district: u.district || "",
            khoroo: u.khoroo || "",
            address: u.address || "",
            notes: u.notes || "",
          });
        }
      } catch {
        toast.error("❌ Хэрэглэгчийн мэдээлэл ачаалахад алдаа гарлаа.");
      }
    };
    fetchUser();

    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, [userId, token]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const total = cart.reduce((sum, i) => sum + i.food.price * i.quantity, 0);
  const delivery = 9000;
  const grandTotal = total + delivery;

  const requiredFields = [
    "lastName",
    "phonenumber",
    "city",
    "district",
    "khoroo",
    "address",
  ];

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    requiredFields.forEach((key) => {
      if (!form[key as keyof typeof form]) newErrors[key] = true;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error("⚠️ Бүх шаардлагатай талбаруудыг бөглөнө үү.");
      return;
    }

    if (!cart.length) return toast.error("🛒 Сагс хоосон байна.");

    localStorage.setItem("checkout_info", JSON.stringify(form));
    setAmount(grandTotal);
    setOpenQPay(true);
  };

  const handlePaymentSuccess = () => {
    toast.success("✅ Төлбөр амжилттай хийгдлээ!");
    setOpenQPay(false);
    router.push("/checkout?step=payment");
  };

  return (
    <>
      <Header compact />

      <main className="min-h-screen bg-[#0a0a0a] text-white pt-[130px] pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col lg:flex-row gap-10">
          {/* 💳 LEFT: PAYMENT SUMMARY */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full lg:w-[400px] bg-[#111]/90 border border-gray-800 rounded-3xl p-8 shadow-[0_0_40px_-10px_rgba(250,204,21,0.15)] h-fit"
          >
            <h2 className="text-xl font-semibold mb-6 border-b border-gray-800 pb-3">
              Төлбөрийн мэдээлэл
            </h2>

            <div className="flex justify-between text-gray-300 mb-3">
              <span>Бүтээгдэхүүний дүн</span>
              <span>{total.toLocaleString()}₮</span>
            </div>
            <div className="flex justify-between text-gray-300 mb-3">
              <span>Хүргэлтийн дүн</span>
              <span>{delivery.toLocaleString()}₮</span>
            </div>
            <div className="border-t border-gray-700 my-4" />
            <div className="flex justify-between items-center font-semibold text-lg">
              <span>Нийт дүн</span>
              <span className="text-[#facc15] text-2xl">
                {grandTotal.toLocaleString()}₮
              </span>
            </div>

            <div className="flex mt-6 gap-2">
              <input
                type="text"
                placeholder="Купон код"
                className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#facc15] outline-none transition"
              />
              <button className="bg-[#facc15] text-black px-5 py-2 rounded-lg font-semibold hover:brightness-110 transition">
                Шалгах
              </button>
            </div>

            <div className="flex gap-3 mt-8">
              <Button
                variant="outline"
                onClick={() => router.push("/checkout")}
                className="border-gray-600 text-gray-300 hover:border-[#facc15] hover:text-[#facc15] w-full"
              >
                Буцах
              </Button>

              <Button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-[#facc15] to-[#fbbf24] text-black font-semibold hover:brightness-110"
              >
                Захиалах
              </Button>
            </div>

            <p className="text-gray-500 text-sm mt-6 leading-snug flex gap-2 items-start">
              ⚠️ Хүргэлтийн бүсээс хамаарч хүргэлтийн төлбөрт өөрчлөлт орж
              болохыг анхаарна уу.
            </p>
          </motion.section>

          {/* 🚚 RIGHT: DELIVERY FORM */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 bg-[#111]/90 border border-gray-800 rounded-3xl p-8 shadow-[0_0_40px_-10px_rgba(250,204,21,0.15)]"
          >
            <h2 className="text-xl font-semibold mb-6 border-b border-gray-800 pb-3">
              Захиалагчийн мэдээлэл
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  className={`text-sm ${
                    errors.lastName ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  Овог нэр *
                </label>
                <Input
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className={`bg-[#1a1a1a] mt-1 ${
                    errors.lastName
                      ? "border-red-500"
                      : "border-gray-700 focus:border-[#facc15]"
                  } text-white`}
                />
              </div>
              <div>
                <label
                  className={`text-sm ${
                    errors.phonenumber ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  Утасны дугаар *
                </label>
                <Input
                  value={form.phonenumber}
                  onChange={(e) => handleChange("phonenumber", e.target.value)}
                  className={`bg-[#1a1a1a] mt-1 ${
                    errors.phonenumber
                      ? "border-red-500"
                      : "border-gray-700 focus:border-[#facc15]"
                  } text-white`}
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold mt-10 mb-4 border-b border-gray-800 pb-3">
              Хүргэлтийн мэдээлэл
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mt-2">
              <div>
                <label
                  className={`text-sm ${
                    errors.city ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  Хот / Аймаг *
                </label>
                <Input
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className={`bg-[#1a1a1a] mt-1 ${
                    errors.city
                      ? "border-red-500"
                      : "border-gray-700 focus:border-[#facc15]"
                  } text-white`}
                />
              </div>
              <div>
                <label
                  className={`text-sm ${
                    errors.district ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  Сум / Дүүрэг *
                </label>
                <Input
                  value={form.district}
                  onChange={(e) => handleChange("district", e.target.value)}
                  className={`bg-[#1a1a1a] mt-1 ${
                    errors.district
                      ? "border-red-500"
                      : "border-gray-700 focus:border-[#facc15]"
                  } text-white`}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <label
                  className={`text-sm ${
                    errors.khoroo ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  Баг / Хороо *
                </label>
                <Input
                  value={form.khoroo}
                  onChange={(e) => handleChange("khoroo", e.target.value)}
                  className={`bg-[#1a1a1a] mt-1 ${
                    errors.khoroo
                      ? "border-red-500"
                      : "border-gray-700 focus:border-[#facc15]"
                  } text-white`}
                />
              </div>
              <div>
                <label
                  className={`text-sm ${
                    errors.address ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  Хүргэлтийн хаяг *
                </label>
                <Textarea
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className={`bg-[#1a1a1a] mt-1 h-[90px] ${
                    errors.address
                      ? "border-red-500"
                      : "border-gray-700 focus:border-[#facc15]"
                  } text-white`}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm text-gray-400">Нэмэлт мэдээлэл</label>
              <Textarea
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="bg-[#1a1a1a] border-gray-700 text-white mt-1 h-[90px] focus:border-[#facc15]"
              />
            </div>

            {/* 💰 Payment method section */}
            <h2 className="text-xl font-semibold mt-10 mb-4 border-b border-gray-800 pb-3">
              Төлбөрийн хэрэгсэл
            </h2>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3">
                <RadioGroupItem value="qpay" id="qpay" />
                <Label htmlFor="qpay" className="flex items-center gap-2">
                  <img src="/icons/qpay.svg" alt="QPay" className="w-6 h-6" />
                  <span className="text-gray-300">QPay</span>
                </Label>
              </div>
            </RadioGroup>
          </motion.section>
        </div>
      </main>

      <QPayDialog
        open={openQPay}
        onOpenChange={setOpenQPay}
        amount={amount}
        orderId={`ORDER-${Date.now()}`}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}
