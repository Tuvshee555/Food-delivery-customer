"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";

const languages = [
  { code: "mn", name: "Монгол", flag: "🇲🇳" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
];

export default function TranslateButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const currentLocale = pathname.split("/")[1] || "mn";

  const changeLang = (code: string) => {
    const withoutLocale = pathname.replace(/^\/(mn|en|ko)/, "");
    const newPath = `/${code}${withoutLocale}`;
    router.push(newPath);
    setOpen(false);
  };

  const currentFlag =
    languages.find((l) => l.code === currentLocale)?.flag ?? "🌐";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-black/60 border border-gray-500
        rounded-md px-3 py-1.5 text-white hover:border-gray-200 transition text-sm"
      >
        <Globe size={16} />
        <span className="text-sm">{currentFlag}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[99999]
          flex justify-center items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-[#111] text-white rounded-xl p-5 w-[90%] max-w-[400px]
            shadow-xl border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 text-center">
              Хэлээ сонгоно уу
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => changeLang(l.code)}
                  className="flex items-center gap-3 bg-black/40 border
                  border-gray-700 hover:border-amber-400 rounded-md px-4 py-3
                  transition text-base justify-center"
                >
                  <span className="text-xl">{l.flag}</span>
                  {l.name}
                </button>
              ))}
            </div>

            <button
              className="w-full mt-6 py-2 border border-gray-600 rounded-md
              hover:border-gray-300 transition"
              onClick={() => setOpen(false)}
            >
              Болих
            </button>
          </div>
        </div>
      )}
    </>
  );
}
