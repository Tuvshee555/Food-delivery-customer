import { useCategory } from "@/app/provider/CategoryProvider";
import { useFood } from "@/app/provider/FoodDataProvider";
import { FoodCard } from "./FoodCard";

export const FoodCategoryList = () => {
  const { category } = useCategory();
  const { foodData } = useFood();

  return (
    <div className="w-full flex flex-col gap-[24px] mt-[20px]">
      <div className="flex flex-col gap-4 bg-[#404040] rounded-md p-5">
        {category.map((cat) => {
          const catId = cat._id || cat.id;

          const filteredFood = foodData.filter(
            (dish) => dish.category === catId || dish.categoryId === catId
          );

          return (
            <div key={catId}>
              <h2 className="text-2xl font-semibold text-white">
                {cat.categoryName}{" "}
                <span className="text-gray-500">({filteredFood.length})</span>
              </h2>

              {filteredFood.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredFood.map((dish) => (
                    <FoodCard key={dish._id || dish.id} food={dish} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">
                  No food items available in this category.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
