"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AuthDrawer() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<"idle" | "sent" | "verifying">("idle");
  const [isLoading, setIsLoading] = useState(false);

  const [digits, setDigits] = useState(Array(6).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [cooldown, setCooldown] = useState<number>(0);
  const COOLDOWN_SECONDS = 30;

  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [cooldown]);

  const validateEmail = (e: string) =>
    /^\S+@\S+\.\S+$/.test(e.trim().toLowerCase());

  const resetCodes = () => {
    setDigits(Array(6).fill(""));
    inputsRef.current = [];
  };

  const handleSendCode = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!validateEmail(trimmed)) {
      toast.error("Имэйл буруу байна");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/email/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmed }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        toast.error(err?.message || "Илгээхэд алдаа гарлаа");
        setIsLoading(false);
        return;
      }

      toast.success("Баталгаажуулах код илгээлээ");
      setPhase("sent");
      setCooldown(COOLDOWN_SECONDS);
      resetCodes();

      setTimeout(() => inputsRef.current[0]?.focus(), 50);
    } catch (err) {
      toast.error("Сервертэй холбогдох үед алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    await handleSendCode();
  };

  const handleDigitChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const newDigits = [...digits];
    newDigits[i] = val;
    setDigits(newDigits);

    if (val && i < 5) {
      inputsRef.current[i + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    i: number
  ) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length !== 6) {
      toast.error("6 оронтой код оруулна уу");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/email/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            code,
            role: "USER", // 🔥 FIXED → send role
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Код буруу байна");
        setIsLoading(false);
        return;
      }

      // 🔥 FIXED → use data.userId (not _id)
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("userId", data.user.id);

      // localStorage.setItem("token", data.token);
      // localStorage.setItem("email", data.user.email);
      // localStorage.setItem("userId", data.user._id);

      window.dispatchEvent(new Event("auth-changed"));
      toast.success("Амжилттай нэвтэрлээ");

      setTimeout(() => window.location.reload(), 300);
      router.push("/home-page");
    } catch (err) {
      toast.error("Сервер алдаа");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md">
      {/* ========== PHASE 1 → EMAIL INPUT ========== */}
      {phase === "idle" && (
        <>
          <h2 className="text-2xl font-bold mb-4">Нэвтрэх</h2>

          <label className="block text-sm mb-2">Имэйл</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Имэйл"
            className="w-full px-4 py-3 rounded-xl bg-[#111] border border-gray-700 text-white mb-4"
          />

          <button
            onClick={handleSendCode}
            className="w-full bg-white text-black py-3 rounded-xl font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Түр хүлээнэ үү..." : "Үргэлжлүүлэх"}
          </button>
        </>
      )}

      {/* ========== PHASE 2 → OTP INPUT ========== */}
      {phase === "sent" && (
        <>
          <h2 className="text-2xl font-bold mb-2">Баталгаажуулах код</h2>
          <p className="text-sm text-gray-400 mb-4">
            {email} хаяг руу 6 оронтой код илгээлээ.
          </p>

          <div className="flex gap-2 mb-4">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                value={d}
                maxLength={1}
                className="w-12 h-12 text-center rounded-xl bg-[#111] border border-gray-700 text-white text-lg"
              />
            ))}
          </div>

          <div className="flex justify-between mb-4">
            <button
              className="px-4 py-2 border border-gray-700 rounded-xl"
              onClick={() => {
                setPhase("idle");
                setEmail("");
                resetCodes();
              }}
            >
              Буцах
            </button>

            <button
              onClick={handleResend}
              disabled={cooldown > 0}
              className={`underline text-sm ${
                cooldown > 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Дахин илгээх {cooldown > 0 && `(${cooldown}s)`}
            </button>
          </div>

          <button
            onClick={handleVerify}
            disabled={isLoading}
            className="w-full bg-white text-black py-3 rounded-xl font-semibold"
          >
            Баталгаажуулах
          </button>
        </>
      )}
    </div>
  );
}
