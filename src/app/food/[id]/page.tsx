/* eslint-disable @next/next/no-img-element */
"use client";

import { use, useEffect, useState } from "react";
import { FoodType } from "@/type/type";
import { notFound } from "next/navigation";
import { ShareButton } from "@/components/ShareButton";
import { Header } from "@/components/Header";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Fetch food item from backend
async function getFood(id: string): Promise<FoodType | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/food/${id}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch food:", error);
    return null;
  }
}

// Helper for File/String to image URL
const getMediaUrl = (media?: string | File): string => {
  if (!media) return "/placeholder.png";
  return typeof media === "string" ? media : URL.createObjectURL(media);
};

export default function FoodDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ unwrap params safely with React.use()
  const { id } = use(params);

  const [food, setFood] = useState<FoodType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [mainMedia, setMainMedia] = useState<{
    type: "image" | "video";
    src: string;
  }>({
    type: "image",
    src: "",
  });

  useEffect(() => {
    setAddress(localStorage.getItem("address"));
    (async () => {
      const data = await getFood(id);
      if (!data) notFound();
      setFood(data);
      const mainImage = getMediaUrl(data.image);
      setMainMedia({ type: "image", src: mainImage });
    })();
  }, [id]);

  if (!food) return null;

  const extraImages =
    Array.isArray(food.extraImages) && food.extraImages.length > 0
      ? food.extraImages.map(getMediaUrl)
      : [];

  const videoSrc =
    typeof food.video === "string"
      ? food.video
      : food.video
      ? URL.createObjectURL(food.video)
      : undefined;

  const totalPrice = food.price * quantity;

  // ✅ Fixed Add to Cart
  const handleAddToCart = () => {
    if (!address || address.trim() === "") {
      toast.error(
        "❌ No address found. Please add your delivery address first."
      );
      return;
    }

    if (Array.isArray(food.sizes) && food.sizes.length > 0 && !selectedSize) {
      toast.error("⚠️ Please select a size before adding to cart.");
      return;
    }

    // ✅ Cart item formatted correctly for PayFood
    const newCartItem = {
      food: {
        id: food.id,
        _id: food._id,
        foodName: food.foodName,
        price: food.price,
        image:
          typeof food.image === "string"
            ? food.image
            : food.image
            ? URL.createObjectURL(food.image)
            : "",
      },
      quantity,
      selectedSize: selectedSize || null,
    };

    try {
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      localStorage.setItem(
        "cart",
        JSON.stringify([...existingCart, newCartItem])
      );
      toast.success("✅ Added to cart successfully!");
      const item = localStorage.getItem("cart");
      console.log(item, "item");
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to add to cart");
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#0d0d0d] to-[#1a1a1a] text-white">
      {/* Header */}
      <Header />

      <section className="flex flex-col lg:flex-row gap-10 p-6 md:p-10 mt-4">
        {/* LEFT SIDE - MEDIA GALLERY */}
        <div className="flex-1 flex flex-col items-center gap-6">
          <div className="w-full max-w-[600px] rounded-2xl bg-[#1a1a1a] border border-gray-800 shadow-md overflow-hidden flex justify-center items-center">
            {mainMedia.type === "image" ? (
              <img
                src={mainMedia.src}
                alt={food.foodName}
                className="rounded-2xl object-contain w-full h-[400px] md:h-[500px] hover:scale-[1.02] transition-transform duration-300"
              />
            ) : (
              <video
                src={mainMedia.src}
                controls
                className="rounded-2xl object-contain w-full h-[400px] md:h-[500px] border border-gray-800"
              />
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto max-w-full mt-2 px-2">
            {[getMediaUrl(food.image), ...extraImages].map((img, i) => (
              <img
                key={`img-${i}`}
                src={img}
                alt={`Food image ${i + 1}`}
                onClick={() => setMainMedia({ type: "image", src: img })}
                className={`w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl border ${
                  mainMedia.src === img ? "border-[#facc15]" : "border-gray-700"
                } hover:border-[#facc15] cursor-pointer transition-all`}
              />
            ))}

            {videoSrc && (
              <div
                onClick={() => setMainMedia({ type: "video", src: videoSrc })}
                className={`w-24 h-24 md:w-28 md:h-28 rounded-xl border flex items-center justify-center cursor-pointer ${
                  mainMedia.src === videoSrc
                    ? "border-[#facc15]"
                    : "border-gray-700"
                } hover:border-[#facc15] transition-all bg-black relative`}
              >
                <video
                  src={videoSrc}
                  className="w-full h-full object-cover rounded-xl opacity-80"
                />
                <span className="absolute text-xs text-white font-semibold bg-black/50 px-2 py-1 rounded">
                  ▶ Video
                </span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE - DETAILS */}
        <div className="flex-1 flex flex-col justify-start gap-8 bg-[#141414]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 md:p-8 shadow-lg">
          {/* Title + Price */}
          <div className="flex flex-col gap-3 border-b border-gray-800 pb-5">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {food.foodName}
            </h1>
            <p className="text-3xl font-semibold text-[#facc15] drop-shadow-sm">
              {totalPrice.toLocaleString()}₮
            </p>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="text-gray-400 mb-2 text-sm uppercase tracking-wide">
              Орц (Ingredients)
            </h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {food.ingredients}
            </p>
          </div>

          {/* Sizes */}
          {Array.isArray(food.sizes) && food.sizes.length > 0 && (
            <div>
              <h3 className="text-gray-400 mb-2 text-sm uppercase tracking-wide">
                Хэмжээ (Sizes)
              </h3>
              <div className="flex flex-wrap gap-3">
                {food.sizes.map((size: any, index: number) => {
                  const label = size.label || size;
                  const isActive = selectedSize === label;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(label)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isActive
                          ? "bg-[#facc15] text-black"
                          : "bg-[#222] text-gray-300 hover:bg-[#333]"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-5 mt-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-full bg-[#222] flex items-center justify-center text-lg hover:bg-[#333] transition"
            >
              −
            </motion.button>

            <span className="text-xl font-semibold">{quantity}</span>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity((q) => q + 1)}
              className="w-9 h-9 rounded-full bg-[#222] flex items-center justify-center text-lg hover:bg-[#333] transition"
            >
              +
            </motion.button>
          </div>

          {/* Add to Cart Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAddToCart}
            className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            🛒 Add to Cart
          </motion.button>

          {/* Footer */}
          <div className="flex justify-between items-center text-gray-400 text-sm pt-5 border-t border-gray-800">
            <span className="truncate max-w-[60%]">
              📍 Хаяг: {food.address || "Тодорхойгүй"}
            </span>
            <ShareButton title={food.foodName} />
          </div>
        </div>
      </section>
    </main>
  );
}
