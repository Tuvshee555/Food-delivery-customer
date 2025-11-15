/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { CategoryNameList } from "@/components/CategoryNameList";
import { FoodCategoryList } from "@/components/FoodCategoryList";

export default function Home() {
  return (
    <>
      <div className="w-screen min-h-screen bg-[#404040]">
        <img src="./BackMain.png" className="h-[668px] w-full object-cover" />

        <div className="bg-[#404040] rounded-[8px] p-[24px]">
          <FoodCategoryList />
        </div>
      </div>
    </>
  );
}

{
  /* <div className="text-[20px] font-semibold text-[white]">
  Categories
</div> */
}
{
  /* <div className="flex"><CategoryNameList /></div> */
}
