/* eslint-disable @typescript-eslint/no-explicit-any */

const DEFAULT_CLOTHING_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "4XL",
];

const CATEGORY_FALLBACKS: Record<
  string,
  { categoryName: string; imageUrl: string }
> = {
  d: { categoryName: "Жерси", imageUrl: "/food1.png" },
  s: { categoryName: "Аксессуар", imageUrl: "/food2.png" },
};

const normalize = (value?: string | null) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

export function sanitizeCategory<T extends { categoryName?: string; imageUrl?: string }>(
  category: T
): T {
  const key = normalize(category.categoryName);
  const fallback = CATEGORY_FALLBACKS[key];
  if (!fallback) return category;

  return {
    ...category,
    categoryName: fallback.categoryName,
    imageUrl: fallback.imageUrl,
  };
}

export function sanitizeCategoryList<T extends { categoryName?: string; imageUrl?: string }>(
  categories: T[] = []
): T[] {
  return categories.map(sanitizeCategory);
}

const looksLikeTestProduct = (food: any) => {
  const name = normalize(food?.foodName);
  const price = Number(food?.price ?? 0);
  const image = normalize(food?.image);
  const desc = normalize(food?.ingredients);

  return (
    name === "jkh" ||
    name === "test" ||
    price === 656565 ||
    image.includes("screenshot") ||
    desc.includes("saas")
  );
};

export function sanitizeFood<T extends Record<string, any>>(food: T): T {
  const source = food as Record<string, any>;
  const withCategoryName = source?.category?.categoryName
    ? {
        ...source,
        category: sanitizeCategory(source.category),
      }
    : source;

  if (!looksLikeTestProduct(withCategoryName)) {
    return withCategoryName as T;
  }

  const mergedExtras = Array.isArray(withCategoryName?.extraImages)
    ? withCategoryName.extraImages
    : [];

  return ({
    ...withCategoryName,
    foodName: "Nomad Edge Pro Jersey",
    price: 189000,
    oldPrice: 219000,
    discount: 14,
    ingredients:
      "Амьсгалдаг dry-fit материалтай, өдөр тутмын өмсгөл болон дэмжигчдийн хувцаслалтад зориулсан албан ёсны загвар.",
    image: "/food3.png",
    extraImages:
      mergedExtras.length > 0
        ? ["/food3.png", "/food4.png", "/food5.png", ...mergedExtras]
        : ["/food3.png", "/food4.png", "/food5.png"],
    sizes:
      Array.isArray(withCategoryName?.sizes) && withCategoryName.sizes.length > 0
        ? withCategoryName.sizes
        : DEFAULT_CLOTHING_SIZES,
  } as unknown) as T;
}

export function sanitizeFoodList<T extends Record<string, any>>(
  foods: T[] = []
): T[] {
  return foods.map((food) => sanitizeFood(food));
}

export function getDefaultClothingSizes() {
  return [...DEFAULT_CLOTHING_SIZES];
}
