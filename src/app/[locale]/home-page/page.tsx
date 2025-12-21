import { AutoScrollProducts } from "@/components/homePage/AutoScrollProducts";
import { FoodCategoryList } from "@/components/homePage/FoodCategoryList";
import Image from "next/image";
import { HeroCategoryStrip } from "./HeroCategoryStrip";

export default function Home() {
  return (
    <div className="w-screen min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* HERO */}
      <div
        className="
          relative w-full
          h-[220px]
          sm:h-[300px]
          md:h-[420px]
          lg:h-[560px]
        "
      >
        <Image
          src="/BackMain.png"
          alt="Main Background"
          fill
          sizes="100vw"
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
