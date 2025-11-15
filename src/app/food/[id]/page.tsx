/* eslint-disable @next/next/no-img-element */
"use client";

import { use, useEffect, useState } from "react";
import { FoodType } from "@/type/type";
import { notFound } from "next/navigation";
import { FoodMedia } from "@/components/food/FoodMedia";
import { FoodInfo } from "@/components/food/FoodInfo";
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
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const savedAddress = localStorage.getItem("address");
    if (savedAddress) setAddress(savedAddress);

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
    <>
      <main className="min-h-screen w-full bg-[#0a0a0a] text-white relative pt-[90px] pb-20">
        <section className="flex flex-col lg:flex-row items-start justify-center gap-10 p-6 md:p-10 max-w-7xl mx-auto">
          <FoodMedia food={food} />
          <FoodInfo food={food} address={address} />
        </section>

        <SimilarFoods food={food} allFoods={allFoods} />
      </main>
    </>
  );
}
