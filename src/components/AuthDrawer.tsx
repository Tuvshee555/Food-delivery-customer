"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { saveAuth } from "@/utils/auth";

export default function AuthDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<"idle" | "otp">("idle");
  const [loading, setLoading] = useState(false);
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [isCorrect, setIsCorrect] = useState<null | boolean>(null);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const sendOTP = async () => {
    const normalized = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalized)) {
      toast.error("Имэйл буруу байна");
      return;
    }

    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/email/send-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized }),
      }
    );
    setLoading(false);

    if (!res.ok) return toast.error("Код илгээхэд алдаа гарлаа");

    toast.success("Код илгээлээ");
    setPhase("otp");

    setTimeout(() => inputsRef.current[0]?.focus(), 50);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text");
    if (/^\d{6}$/.test(paste)) {
      const arr = paste.split("");
      setDigits(arr);
      autoVerify(arr.join(""));
    }
  };

  const handleDigitChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;

    const next = [...digits];
    next[i] = val;
    setDigits(next);

    if (val && i < 5) inputsRef.current[i + 1]?.focus();

    const full = next.join("");
    if (full.length === 6) autoVerify(full);
  };

  const autoVerify = async (code: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/email/verify-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, code }),
      }
    );

    if (!res.ok) {
      setIsCorrect(false);
      return;
    }

    const data = await res.json();
    setIsCorrect(true);

    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.user.email);
    localStorage.setItem("userId", data.user.id);

    saveAuth(data);

    // 🔥 IMPORTANT: Tell AuthProvider to update
    window.dispatchEvent(new Event("auth-changed"));

    toast.success("Амжилттай нэвтэрлээ!");

    const redirect =
      new URLSearchParams(window.location.search).get("redirect") ||
      "/home-page";

    // 🔥 SAFE redirect (NO RELOAD)
    window.location.href = redirect;
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {/* Background Blur */}
      <motion.div
        key="bg"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-lg p-8 text-white relative shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Нэвтрэх</h2>
            <button onClick={onClose} className="text-xl">
              ×
            </button>
          </div>

          {/* ------------------- PHASE 1: EMAIL ------------------- */}
          {phase === "idle" && (
            <>
              <label className="text-sm mb-2 block">Имэйл</label>
              <input
                className="w-full px-4 py-3 rounded-xl bg-[#111] border border-gray-700 mb-6"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Имэйл"
              />

              <button
                onClick={sendOTP}
                disabled={loading}
                className="w-full bg-[#fff] text-black py-3 rounded-xl font-semibold"
              >
                {loading ? "Түр хүлээнэ үү..." : "Үргэлжлүүлэх"}
              </button>
            </>
          )}

          {/* ------------------- PHASE 2: OTP ------------------- */}
          {phase === "otp" && (
            <>
              <label className="text-sm mb-2 block">Баталгаажуулах код</label>

              {/* Centered OTP box container */}
              <div className="flex justify-center gap-3 mb-3">
                {digits.map((d, i) => (
                  <motion.input
                    key={i}
                    ref={(el) => {
                      inputsRef.current[i] = el;
                    }}
                    onPaste={handlePaste}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    value={d}
                    maxLength={1}
                    className={`
      w-14 h-14 text-center text-lg rounded-xl bg-[#111] border 
      transition-all duration-200
      ${
        isCorrect === true
          ? "border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
          : isCorrect === false
          ? "border-red-500"
          : "border-gray-700"
      }
    `}
                    animate={
                      isCorrect === false ? { x: [-5, 5, -5, 5, 0] } : {}
                    }
                  />
                ))}
              </div>

              <p className="text-gray-400 text-sm mb-6 text-center">
                Таны <span className="text-white">{email}</span> хаяг руу 6
                оронтой код илгээлээ.
              </p>

              <div className="flex justify-between mb-4">
                <button
                  onClick={() => {
                    setPhase("idle");
                    setDigits(Array(6).fill(""));
                  }}
                  className="px-4 py-2 border border-gray-700 rounded-xl"
                >
                  Буцах
                </button>

                <button
                  onClick={sendOTP}
                  className="flex items-center gap-1 text-gray-300 underline"
                >
                  ⟳ Дахин илгээх
                </button>
              </div>

              <button
                onClick={() => autoVerify(digits.join(""))}
                className="w-full bg-white text-black py-3 rounded-xl font-semibold"
              >
                Баталгаажүүлэх
              </button>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
    //
  );
}
