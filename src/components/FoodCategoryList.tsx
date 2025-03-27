import { useCategory } from "@/app/provider/CategoryProvider";
import { FoodCard } from "./FoodCard";
import { useFood } from "@/app/provider/FoodDataProvider";

export const FoodCategoryList = () => {
  const { category } = useCategory(); // category is an array
  const { foodData } = useFood();

  return (
    <div className="flex flex-col gap-4 bg-[#404040] rounded-md p-5">
      {category.map((cat) => {
        const filteredFood = foodData.filter((dish) => dish.category === cat._id);

        return (
          <div key={cat._id}>
            <h2 className="text-2xl font-semibold text-white">
              {cat.categoryName}{" "}
              <span className="text-gray-500">({filteredFood.length})</span>
            </h2>

            {filteredFood.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredFood.map((dish) => (
                  <FoodCard key={dish._id} food={dish} category={cat} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No food items available in this category.</p>
            )}
          </div>
        );
      })}
    </div>
  );
};
