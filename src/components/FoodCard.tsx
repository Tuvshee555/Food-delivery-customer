import { FoodCardPropsType } from "@/type/type";
import { AddFoodOrder } from "./AddFoodOrder";

export const FoodCard: React.FC<FoodCardPropsType> = ({ food }) => {
  console.log(food);

  
  
  return (
    <div className="bg-white shadow-md p-4 gap-5 border-[1px] rounded-2xl flex flex-col items-center w-[271px] max-w-[241px]">
      <div className="relative">
        <img
          src={
            typeof food.image === "string"
              ? food.image
              : food.image
              ? URL.createObjectURL(food.image)
              : ""
          }
          className="w-[240px] h-[130px] gap-2 rounded-2xl object-cover"
          alt={food.foodName}
        />
        <AddFoodOrder food={food} />
      </div>

      <div className="text-center mt-2 w-full g-[8px]">
        <div className="flex justify-between">
          <h3 className="text-red-500 font-500">{food.foodName}</h3>
          <h3 className="text-[black] font-[500]">${food.price}</h3>
        </div>
        <p className="text-[black] line-clamp-2 text-start">
          {food.ingredients}
        </p>
      </div>
    </div>
  );
};
