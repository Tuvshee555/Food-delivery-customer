"use client";

import { Datas, FoodType } from "@/type/type";
import axios from "axios";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type FoodContextType = {
    // category: Datas[]
  foodData: any[];
  refreshFood: () => void;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined)

export const FoodDataProvider = ({children}:{children:ReactNode}) => {
  const [foodData, setFoodData] = useState<FoodType[]>([]);

  const getFoodData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/food");
      console.log(response.data);
      setFoodData(response.data);
    } catch (error) {
      console.log("Error fetching foodData", error);
    }
  };

  useEffect(() => {
    getFoodData();
  }, []);
  return (
    <FoodContext.Provider
    value={{ foodData, refreshFood: getFoodData}}>
        {children}
    </FoodContext.Provider>
  )
};

export const useFood = () => {
    const context = useContext(FoodContext)
    if(!context){
        throw new Error("useFood must be used within a FoodPrider")
    }
    return context
}