import { AutoScrollProducts } from "@/components/homePage/AutoScrollProducts";
import { FoodCategoryList } from "@/components/homePage/FoodCategoryList";
import Image from "next/image";
import { HeroCategoryStrip } from "./HeroCategoryStrip";

export default function Home() {
  return (
    <div className="w-screen min-h-screen bg-[#0a0a0a]">
      {/* HERO */}
      <div className="relative w-full h-[668px]">
        <Image
          src="/BackMain.png"
          alt="Main Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Category Strip BELOW HERO */}
      <HeroCategoryStrip />

      {/* Auto Scroll Product Section */}
      <div className="px-6 mt-10">
        <AutoScrollProducts />
      </div>

      {/* Category Food Sections */}
      <div className="px-6 mt-10">
        <FoodCategoryList />
      </div>
    </div>
  );
}
