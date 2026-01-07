"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { FoodType } from "@/type/type";

import { FoodMedia } from "@/components/food/FoodMedia";
import { FoodInfo } from "@/components/foodInfo/FoodInfo";
import { SimilarFoods } from "@/components/food/SimilarFoods";

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
    <main className="min-h-screen w-full bg-background text-foreground pt-0 lg:pt-[90px] pb-20">
      <section className=" grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-10 items-start px-0 lg:px-10">
        <FoodMedia food={food} />
        <div className="px-4 sm:px-6 lg:px-0">
          <FoodInfo food={food} />
        </div>
      </section>

      <SimilarFoods food={food} allFoods={allFoods} />
    </main>
  );
}
