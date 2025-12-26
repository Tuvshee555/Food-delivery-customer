import { AutoScrollProducts } from "@/components/homePage/AutoScrollProducts";
import { FoodCategoryList } from "@/components/homePage/FoodCategoryList";
import { HeroCategoryStrip } from "./HeroCategoryStrip";
import { HeroCarousel } from "@/components/HeroCarousel";

export default function Home() {
  return (
    <div className="w-screen min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* HERO CAROUSEL */}
      <HeroCarousel />

      {/* CATEGORY STRIP */}
      <HeroCategoryStrip />

      {/* AUTO SCROLL PRODUCTS */}
      <AutoScrollProducts />

      {/* CATEGORY FOOD SECTIONS */}
      <FoodCategoryList />
    </div>
  );
}
