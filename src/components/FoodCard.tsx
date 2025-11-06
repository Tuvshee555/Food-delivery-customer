/* eslint-disable @next/next/no-img-element */
import { FoodCardPropsType } from "@/type/type";
import { AddFoodOrder } from "./AddFoodOrder";

export const FoodCard: React.FC<FoodCardPropsType> = ({ food }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex flex-col items-center w-full max-w-[271px]">
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
          alt={food.foodName}
          className="w-full h-[130px] rounded-2xl object-cover"
        />
        <AddFoodOrder food={food} />
      </div>

      {/* Food Info */}
      <div className="mt-3 w-full flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3 className="text-gray-800 font-semibold text-base">
            {food.foodName}
          </h3>
          <span className="text-gray-700 font-medium text-sm">
            ${food.price}
          </span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2">{food.ingredients}</p>
      </div>
    </div>
  );
};
