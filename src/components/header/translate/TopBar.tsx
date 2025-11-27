/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import TranslateButton from "../translate/TranslateButton";
import { Facebook, Instagram, Youtube } from "lucide-react";

export default function TopBar() {
  return (
    <div className="w-full bg-[#0c0c0c] border-b border-gray-800 text-white text-[13px] select-none z-[99999]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-10 py-1.5">
        {/* Left links */}
        <div className="flex items-center gap-4">
          <Link href="/contact" className="hover:text-amber-400 transition">
            Холбоо барих
          </Link>
          <Link href="/branches" className="hover:text-amber-400 transition">
            Салбарууд
          </Link>
          <Link href="/jobs" className="hover:text-amber-400 transition">
            Ажлын байр
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <TranslateButton />

          <div className="hidden sm:flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              className="hover:text-amber-400 transition"
            >
              <Facebook size={16} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              className="hover:text-amber-400 transition"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              className="hover:text-amber-400 transition"
            >
              <Youtube size={18} />
            </a>
          </div>

          <Link
            href="/auth"
            className="hover:text-amber-400 transition hidden sm:block"
          >
            Нэвтрэх
          </Link>
        </div>
      </div>
    </div>
  );
}
