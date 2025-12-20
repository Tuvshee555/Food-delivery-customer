import { AutoScrollProducts } from "@/components/homePage/AutoScrollProducts";
import { FoodCategoryList } from "@/components/homePage/FoodCategoryList";
import Image from "next/image";
import { HeroCategoryStrip } from "./HeroCategoryStrip";

export default function Home() {
  return (
    <div className="w-screen min-h-screen bg-background text-foreground">
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

      {/* CATEGORY STRIP */}
      <HeroCategoryStrip />

      {/* AUTO SCROLL PRODUCTS */}
      <AutoScrollProducts />

      {/* CATEGORY FOOD SECTIONS */}
      <FoodCategoryList />
    </div>
  );
}
