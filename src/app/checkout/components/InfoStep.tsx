"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function InfoStep({ router }: { router: any }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleContinue = () => {
    if (!form.name || !form.phone || !form.address)
      return toast.error("Мэдээлэл бүрэн оруулна уу.");
    localStorage.setItem("checkout_info", JSON.stringify(form));
    router.push("/checkout?step=payment");
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto bg-[#111] p-6 rounded-2xl">
        <h2 className="text-2xl font-semibold mb-6">Хүргэлтийн мэдээлэл</h2>
        <div className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Овог нэр"
            className="w-full bg-[#222] p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Утасны дугаар"
            className="w-full bg-[#222] p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
          />
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Хүргэлтийн хаяг"
            className="w-full bg-[#222] p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500 h-[100px]"
          />
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => router.push("/checkout")}
            className="border-gray-600 text-gray-300"
          >
            Буцах
          </Button>
          <Button
            onClick={handleContinue}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white"
          >
            Үргэлжлүүлэх
          </Button>
        </div>
      </div>
    </main>
  );
}
