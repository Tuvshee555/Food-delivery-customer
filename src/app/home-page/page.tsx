"use client";

import { Datas } from "@/type/type";
import axios from "axios";
import { useEffect, useState } from "react";
import { CategoryNameList } from "@/components/CategoryNameList";
import { CategoriesFoods } from "@/components/CateforiesFoods";
import { Header } from "@/components/Header";

export default function Home() {
  const [category, setCategory] = useState<Datas[]>([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/category");
      setCategory(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
            <CategoryNameList category={category} loading={loading} />
          </div>
          <CategoriesFoods category={category} />
        </div>
      </div>
    </>
  );
}
