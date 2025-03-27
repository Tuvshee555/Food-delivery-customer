import { FoodCategoryList } from "./FoodCategoryList";
import { useCategory } from "@/app/provider/CategoryProvider";
import { useFood } from "@/app/provider/FoodDataProvider";

export const CategoriesFoods = () => {
  const { category } = useCategory();
  const {foodData } = useFood() 

  return (
    <div className="w-full flex flex-col gap-[24px] mt-[20px]">
      {category.map((e) => (
        <FoodCategoryList
          key={e._id}
          category={e}
          foodData={foodData}
        />
      ))}
    </div>
  );
};
