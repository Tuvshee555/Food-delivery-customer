"use client";

import Link from "next/link";
import { SheetRight } from "./SheetRight";
import { Email } from "./Email";
import { AddLocation } from "./AddLocation";

export const Header = () => {
  return (
    <>
      <div className="w-screen h-[68px] py-[12px] px-[88px] flex justify-between">
        <Link href={""} className="flex  items-center">
          <img src="/order.png" className="w-[36px] h-[30px]" />
          <div className="ml-2">
            <div className="text-[18px] font-semibold">NomNom</div>
            <div className="text-[12px] font-medium text-[#71717a]">
              Swift delivery
            </div>
          </div>
        </Link>
        <div className="flex gap-[8px]">
          <AddLocation />
          <SheetRight />
          <Email />
        </div>
      </div>
    </>
  );
};
