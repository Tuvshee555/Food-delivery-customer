/* eslint-disable @next/next/no-img-element */
import { useCategory } from "@/app/provider/CategoryProvider";
import { useFood } from "@/app/provider/FoodDataProvider";
import { FoodCard } from "./FoodCard";

export const FoodCategoryList = () => {
  const { category } = useCategory();
  const { foodData } = useFood();

  return (
    <div className="w-full flex flex-col gap-10 mt-10 px-6 md:px-10">
      {category.map((cat) => {
        const catId = cat._id || cat.id;

        const filteredFood = foodData.filter(
          (dish) => dish.category === catId || dish.categoryId === catId
        );

        return (
          <section
            key={catId}
            className="w-full bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
          >
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-8">
              <img
                src="/order.png"
                alt="Category icon"
                className="w-[28px] h-[28px] opacity-80"
              />
              <h2 className="text-2xl font-semibold text-white tracking-tight">
                {cat.categoryName}
                <span className="text-gray-500 text-[15px] ml-2">
                  ({filteredFood.length})
                </span>
              </h2>
            </div>

            {/* Food Grid */}
            {filteredFood.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                {filteredFood.map((dish) => (
                  <FoodCard key={dish._id || dish.id} food={dish} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic">
                No food items available in this category.
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
};
