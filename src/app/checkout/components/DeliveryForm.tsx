/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function DeliveryForm({
  form,
  setForm,
  errors,
}: {
  form: any;
  setForm: any;
  errors: Record<string, boolean>;
}) {
  const handleChange = (key: string, value: string) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-[#111]/90 border border-gray-800 rounded-3xl p-8 shadow-[0_0_40px_-10px_rgba(250,204,21,0.15)]">
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
            value={form.lastName || ""}
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
            value={form.phonenumber || ""}
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
            value={form.city || ""}
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
            value={form.district || ""}
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
            value={form.khoroo || ""}
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
            value={form.address || ""}
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
          value={form.notes || ""}
          onChange={(e) => handleChange("notes", e.target.value)}
          className="bg-[#1a1a1a] border-gray-700 text-white mt-1 h-[90px] focus:border-[#facc15]"
        />
      </div>
    </div>
  );
}
