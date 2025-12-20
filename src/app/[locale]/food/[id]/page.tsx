"use client";

import { use, useEffect, useState } from "react";
import { FoodType } from "@/type/type";
import { notFound } from "next/navigation";
import { FoodMedia } from "@/components/food/FoodMedia";
import { SimilarFoods } from "@/components/food/SimilarFoods";
import { FoodInfo } from "@/components/foodInfo/FoodInfo";

async function getFood(id: string): Promise<FoodType | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/food/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default function FoodDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [food, setFood] = useState<FoodType | null>(null);
  const [allFoods, setAllFoods] = useState<FoodType[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getFood(id);
      if (!data) notFound();
      setFood(data);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/food`);
      const all = await res.json();
      if (Array.isArray(all)) setAllFoods(all);
    })();
  }, [id]);

  if (!food) return null;

  return (
    <main
      className="
        min-h-screen w-full
        bg-background text-foreground
        relative pt-[90px] pb-20
      "
    >
      {/* MAIN PRODUCT */}
      <section
        className="
    max-w-7xl mx-auto
    px-4 sm:px-6 md:px-10
    grid grid-cols-1 lg:grid-cols-2
    gap-8 lg:gap-10
    items-start
  "
      >
        <FoodMedia food={food} />
        <FoodInfo food={food} />
      </section>

      {/* SIMILAR PRODUCTS */}
      <SimilarFoods food={food} allFoods={allFoods} />
    </main>
  );
}
