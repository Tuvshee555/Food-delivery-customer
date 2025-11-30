"use client";

import { FoodType } from "@/type/type";
import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type FoodContextType = {
  foodData: FoodType[];
  refreshFood: () => void;
};

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export const FoodDataProvider = ({ children }: { children: ReactNode }) => {
  const [foodData, setFoodData] = useState<FoodType[]>([]);

  const getFoodData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/food`
      );
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
    <FoodContext.Provider value={{ foodData, refreshFood: getFoodData }}>
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = () => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error("useFood must be used within a FoodPrider");
  }
  return context;
};
