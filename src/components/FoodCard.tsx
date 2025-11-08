/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FoodCardPropsType } from "@/type/type";
// import { AddFoodOrder } from "./AddFoodOrder";

export const FoodCard: React.FC<FoodCardPropsType> = ({ food }) => {
  return (
    <Link href={`/food/${food.id}`} className="w-full max-w-[271px]">
      <div className="bg-white shadow-md p-4 gap-5 border border-gray-200 rounded-2xl flex flex-col items-center hover:shadow-lg transition-all duration-200 cursor-pointer">
        {/* Food Image */}
        <div className="relative w-full">
          <img
            src={
              typeof food.image === "string"
                ? food.image
                : food.image
                ? URL.createObjectURL(food.image)
                : ""
            }
            className="w-full h-[130px] rounded-2xl object-cover"
            alt={food.foodName}
          />
          {/* <AddFoodOrder food={food} /> */}
        </div>

        {/* Food Info */}
        <div className="text-center mt-2 w-full gap-[8px]">
          <div className="flex justify-between">
            <h3 className="text-red-500 font-semibold">{food.foodName}</h3>
            <h3 className="text-black font-semibold">${food.price}</h3>
          </div>
          <p className="text-gray-700 text-sm line-clamp-2 text-start">
            {food.ingredients}
          </p>
        </div>
      </div>
    </Link>
  );
};
