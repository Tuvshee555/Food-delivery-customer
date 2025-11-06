import { useCategory } from "@/app/provider/CategoryProvider";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export const CategoryNameList = () => {
  const { category, loading } = useCategory();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin text-red-500 w-6 h-6" />
        <span className="ml-2 text-gray-600">Loading categories...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
        {category.map((c, index) => (
          <motion.div
            key={c._id || index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`category-type/${c._id}`)}
            className="py-2 sm:py-3 px-4 sm:px-6 text-xs sm:text-sm md:text-base 
              rounded-full border border-gray-300 flex items-center gap-2 
              bg-white/90 backdrop-blur-md shadow-md hover:shadow-lg hover:border-red-500 
              transition-all cursor-pointer select-none min-w-[80px] sm:min-w-[100px]"
          >
            <span className="font-medium text-gray-800 truncate">
              {c.categoryName}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-[1px]">
              {c.foodCount}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
