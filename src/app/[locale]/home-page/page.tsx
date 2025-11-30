import Image from "next/image";
import { FoodCategoryList } from "@/components/FoodCategoryList";

export default function Home() {
  return (
    <div className="w-screen min-h-screen bg-[#404040]">
      <div className="relative w-full h-[668px]">
        <Image
          src="/BackMain.png"
          alt="Main Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="bg-[#404040] rounded-[8px] p-[24px]">
        <FoodCategoryList />
      </div>
    </div>
  );
}
