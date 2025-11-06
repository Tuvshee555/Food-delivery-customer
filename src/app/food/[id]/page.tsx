import { FoodType } from "@/type/type";
import { AddFoodOrder } from "@/components/AddFoodOrder";

type FoodDetailPageProps = {
  params: { id: string };
};

async function getFood(id: string): Promise<FoodType | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/food/${id}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch food:", error);
    return null;
  }
}

export default async function FoodDetailPage({ params }: FoodDetailPageProps) {
  const food = await getFood(params.id);

  if (!food) {
    return (
      <div className="p-10 text-center text-gray-600">
        <h2 className="text-xl font-semibold">Food not found 😢</h2>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <img
        src={typeof food.image === "string" ? food.image : ""}
        alt={food.foodName}
        className="w-full h-[300px] rounded-2xl object-cover"
      />

      <div className="mt-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{food.foodName}</h1>
        <span className="text-xl font-semibold">${food.price}</span>
      </div>

      <p className="mt-2 text-gray-700">{food.ingredients}</p>

      <div className="mt-4">
        <AddFoodOrder food={food} />
      </div>
    </div>
  );
}
