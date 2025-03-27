import { useCategory } from "@/app/provider/CategoryProvider";
import { useRouter } from "next/navigation";

export const CategoryNameList = () => {
  const { category, loading } = useCategory();
  const router = useRouter();
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col gap-[16px] p-[24px] ">
          <div className="flex flex-wrap gap-[16px]">
            {category.map((c) => (
              <div
                key={c._id}
                className="py-2 px-4 text-sm rounded-[20px] border border-gray-400 flex gap-[8px] bg-[white] hover:cursor-pointer"
                onClick={() => router.push(`category-type/${c._id}`)}
              >
                <div> {c.categoryName}</div>

                <p className="text-gray-500">{c.foodCount}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
