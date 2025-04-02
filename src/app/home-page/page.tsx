"use client"
import { CategoryNameList } from "@/components/CategoryNameList";
import { FoodCategoryList } from "@/components/FoodCategoryList";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <>
      <div className="w-screen h-screen bg-[#404040]">
        <Header />
        <img src="./BackMain.png" className="h-[668px] w-full" />
        <div className="bg-[#404040] rounded-[8px] p-[24px]">
          <div className="text-[20px] font-semibold text-[white]">
            Categories
          </div>
          <div className="flex">
            <CategoryNameList />
          </div>
          <FoodCategoryList />
        </div>
      </div>
    </>
  );
}
