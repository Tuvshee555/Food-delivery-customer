/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

declare global {
  interface Window {
    google?: any;
    GTranslateInit?: () => void;
  }
}

const languages = [
  { code: "mn", name: "Монгол", flag: "🇲🇳" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
];

export default function TranslateButton() {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (!window.GTranslateInit) {
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=GTranslateInit";
      document.body.appendChild(script);

      window.GTranslateInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "mn",
            includedLanguages: languages.map((l) => l.code).join(","),
            autoDisplay: false,
          },
          "google_translate_element"
        );
      };
    }

    const savedLang = localStorage.getItem("preferred_lang");
    if (savedLang) {
      setTimeout(() => applyLanguage(savedLang), 600);
    }

    // 🔪 HARD-KILL GOOGLE BANNER IFRAMES REPEATEDLY
    const killer = setInterval(() => {
      const iframes = Array.from(document.querySelectorAll("iframe"));

      iframes.forEach((frame) => {
        const src = frame.getAttribute("src") || "";
        const style = frame.getAttribute("style") || "";

        // banner frames usually have these
        if (
          src.includes("translate.googleapis.com") ||
          src.includes("translate.google.com") ||
          style.includes("height: 39px") ||
          frame.className.includes("goog-te-banner-frame")
        ) {
          frame.remove();
        }
      });

      const banner = document.querySelector(".goog-te-banner-frame");
      if (banner && banner.parentNode) {
        banner.parentNode.removeChild(banner);
      }
    }, 500);

    return () => clearInterval(killer);
  }, []);

  const applyLanguage = (lang: string) => {
    localStorage.setItem("preferred_lang", lang);

    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");

    if (!select) return;

    select.value = lang;
    select.dispatchEvent(new Event("change"));

    // Prevent Google from proxying the page and adding banner
    const googBar = document.querySelector("iframe.goog-te-banner-frame");
    if (googBar) googBar.remove();

    document.body.style.top = "0px";
    window.location.hash = "no-proxy"; // ensure no Google translate wrapper URL
  };

  return (
    <>
      {/* Hidden div required by Google */}
      <div id="google_translate_element" className="hidden" />

      <button
        onClick={() => setShowOverlay(true)}
        className="flex items-center gap-2 text-white px-3 py-1.5 bg-black/60
        border border-gray-500 rounded-lg hover:border-gray-200
        transition text-sm"
      >
        <Globe size={16} />
        Орчуулах
      </button>

      {showOverlay && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999999]
            flex justify-center items-center animate-fadeIn"
          onClick={() => setShowOverlay(false)}
        >
          <div
            className="bg-[#111] text-white rounded-xl p-6 w-[90%] max-w-[450px]
            shadow-xl border border-gray-700 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 text-center">
              Орчуулах хэлээ сонгоно уу
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    applyLanguage(lang.code);
                    setShowOverlay(false);
                  }}
                  className="flex items-center gap-2 bg-black/40 border
                  border-gray-700 hover:border-amber-400 rounded-md px-3 py-2
                  transition text-sm"
                >
                  <span className="text-lg">{lang.flag}</span>
                  {lang.name}
                </button>
              ))}
            </div>

            <button
              className="w-full mt-6 py-2 border border-gray-600 rounded-md
              hover:border-gray-300 transition"
              onClick={() => setShowOverlay(false)}
            >
              Болих
            </button>
          </div>
        </div>
      )}
    </>
  );
}
