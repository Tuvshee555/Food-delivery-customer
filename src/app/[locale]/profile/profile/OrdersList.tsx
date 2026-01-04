"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Clock, MapPin, Receipt } from "lucide-react";

import { useAuth } from "../../provider/AuthProvider";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

export type OrderStatus = "PENDING" | "DELIVERED" | "CANCELLED";

export type OrderItem = {
  id: string;
  quantity: number;
  food: {
    id: string;
    foodName: string;
  };
};

export type Order = {
  id: string;
  totalPrice: number;
  createdAt: string;
  status: OrderStatus;

  // OLD (legacy)
  location?: string | null;

  // NEW (structured)
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  city?: string | null;
  district?: string | null;
  khoroo?: string | null;
  address?: string | null;
  notes?: string | null;

  foodOrderItems: OrderItem[];
};

export const OrdersList = () => {
  const { userId, token } = useAuth();
  const router = useRouter();
  const { locale, t } = useI18n();

  const fetchOrders = async (): Promise<Order[]> => {
    if (!userId || !token) return [];

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/user/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.data?.orders ?? res.data ?? [];
  };

  const {
    data: orders = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["orders", userId],
    queryFn: fetchOrders,
    enabled: Boolean(userId && token),
    refetchInterval: 10000,
  });

  const statusStyle: Record<OrderStatus, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    DELIVERED: "bg-green-500/10 text-green-600 border-green-500/20",
    CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  const statusLabel: Record<OrderStatus, string> = {
    PENDING: t("order_status_pending"),
    DELIVERED: t("order_status_delivered"),
    CANCELLED: t("order_status_cancelled"),
  };

  /* ---------- Loading ---------- */
  if (isLoading) {
    return (
      <div className="space-y-4 mt-6 px-4 sm:px-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-card border border-border animate-pulse"
          />
        ))}
      </div>
    );
  }

  /* ---------- Empty ---------- */
  if (!orders.length) {
    return (
      <div className="text-center mt-16 space-y-2">
        <Receipt className="mx-auto w-6 h-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{t("orders_empty")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-5 sm:mt-0 px-4 sm:px-0 pb-[260px] sm:pb-0">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Receipt className="w-5 h-5" />
        <h1 className="text-lg font-semibold">{t("my_orders")}</h1>
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {orders.map((order, i) => {
          // 🔹 Build readable address
          const locationLines = [
            order.city && `${t("city")}: ${order.city}`,
            order.district && `${t("district")}: ${order.district}`,
            order.khoroo && `${t("khoroo")}: ${order.khoroo}`,
            order.address && `${t("address")}: ${order.address}`,
            order.firstName && `${t("first_name")}: ${order.firstName}`,
            order.lastName && `${t("last_name")}: ${order.lastName}`,
            order.phone && `${t("phone_number")}: ${order.phone}`,
          ].filter(Boolean);

          const displayLocation =
            locationLines.length > 0
              ? locationLines.join(" • ")
              : order.location ?? "";

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4"
            >
              {/* Top */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    {t("order_id")}
                  </p>
                  <p className="text-sm font-medium truncate">{order.id}</p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-md border whitespace-nowrap ${
                    statusStyle[order.status]
                  }`}
                >
                  {statusLabel[order.status]}
                </span>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={14} />
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>

                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin size={14} className="mt-0.5" />
                  <div className="space-y-1">
                    <div className="whitespace-pre-line">{displayLocation}</div>

                    {order.notes && (
                      <div className="italic text-muted-foreground/80">
                        {t("additional_info")}: {order.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Items */}
              {order.foodOrderItems?.length > 0 && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {order.foodOrderItems
                    .map((item) => `${item.quantity}× ${item.food.foodName}`)
                    .join(" · ")}
                </p>
              )}

              {/* Bottom */}
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <p className="text-base font-semibold">
                  {order.totalPrice.toLocaleString()}₮
                </p>

                <button
                  onClick={() =>
                    router.push(`/${locale}/profile/orders/${order.id}`)
                  }
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {t("view_details")}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Background refresh */}
      {isFetching && (
        <p className="text-xs text-center text-muted-foreground">
          {t("refreshing")}
        </p>
      )}
    </div>
  );
};

// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { Clock, MapPin, Receipt, ChevronDown, ChevronUp } from "lucide-react";

// import { useAuth } from "../../provider/AuthProvider";
// import { useI18n } from "@/components/i18n/ClientI18nProvider";

// export type OrderStatus = "PENDING" | "DELIVERED" | "CANCELLED";

// export type Food = {
//   id: string;
//   foodName: string;
//   image?: string | null;
//   extraImages?: string[];
//   ingredients?: string | null;
//   price?: number | null;
//   oldPrice?: number | null;
//   discount?: number | null;
//   isFeatured?: boolean;
//   salesCount?: number | null;
// };

// export type OrderItem = {
//   id: string;
//   quantity: number;
//   foodId?: string | null;
//   food: Food;
// };

// export type Order = {
//   id: string;
//   totalPrice: number;
//   createdAt: string;
//   status: OrderStatus;
//   firstName?: string | null;
//   lastName?: string | null;
//   phone?: string | null;
//   city?: string | null;
//   district?: string | null;
//   khoroo?: string | null;
//   address?: string | null;
//   notes?: string | null;
//   discount?: number | null;
//   foodOrderItems: OrderItem[];
// };

// const statusStyle: Record<OrderStatus, string> = {
//   PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
//   DELIVERED: "bg-green-500/10 text-green-600 border-green-500/20",
//   CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20",
// };

// export default function OrdersList() {
//   const { userId, token } = useAuth();
//   const router = useRouter();
//   const { locale, t } = useI18n();
//   const [expanded, setExpanded] = useState<Record<string, boolean>>({});

//   const fetchOrders = async (): Promise<Order[]> => {
//     if (!userId || !token) return [];
//     const res = await axios.get(
//       `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/user/${userId}`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return res.data?.orders ?? res.data ?? [];
//   };

//   const {
//     data: orders = [],
//     isLoading,
//     isFetching,
//   } = useQuery({
//     queryKey: ["orders", userId],
//     queryFn: fetchOrders,
//     enabled: Boolean(userId && token),
//     refetchInterval: 10000,
//   });

//   if (isLoading) {
//     return (
//       <div className="space-y-4 mt-6 px-4 sm:px-0">
//         {[...Array(3)].map((_, i) => (
//           <div
//             key={i}
//             className="h-28 rounded-xl bg-card border border-border animate-pulse"
//           />
//         ))}
//       </div>
//     );
//   }

//   if (!orders.length) {
//     return (
//       <div className="text-center mt-16 space-y-2">
//         <Receipt className="mx-auto w-6 h-6 text-muted-foreground" />
//         <p className="text-sm text-muted-foreground">{t("orders_empty")}</p>
//       </div>
//     );
//   }

//   const fmtDate = (iso?: string) =>
//     iso
//       ? new Date(iso).toLocaleString(locale ?? "en-US", {
//           year: "numeric",
//           month: "short",
//           day: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       : "";

//   const fmtCurrency = (n = 0) => `${n.toLocaleString()}₮`;

//   return (
//     <div className="space-y-6 mt-5 sm:mt-0 px-4 sm:px-0">
//       <div className="flex items-center gap-2">
//         <Receipt className="w-5 h-5" />
//         <h1 className="text-lg font-semibold">{t("my_orders")}</h1>
//       </div>

//       <div className="space-y-4">
//         {orders.map((order, i) => {
//           const locationLines = [
//             order.city && `${t("city")}: ${order.city}`,
//             order.district && `${t("district")}: ${order.district}`,
//             order.khoroo && `${t("khoroo")}: ${order.khoroo}`,
//             order.address && `${t("address")}: ${order.address}`,
//             order.firstName && `${t("first_name")}: ${order.firstName}`,
//             order.lastName && `${t("last_name")}: ${order.lastName}`,
//             order.phone && `${t("phone_number")}: ${order.phone}`,
//           ].filter(Boolean);

//           const displayLocation =
//             locationLines.length > 0 ? locationLines.join(" • ") : "";

//           const isExpanded = Boolean(expanded[order.id]);

//           return (
//             <motion.article
//               key={order.id}
//               initial={{ opacity: 0, y: 6 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.2, delay: i * 0.03 }}
//               className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4"
//               role="button"
//               onClick={(e) => {
//                 // allow clicks on action buttons to not trigger navigation
//                 const target = e.target as HTMLElement;
//                 if (target.closest("button")) return;
//                 router.push(`/${locale}/profile/orders/${order.id}`);
//               }}
//             >
//               <div className="flex items-start justify-between gap-3">
//                 <div className="min-w-0">
//                   <p className="text-xs text-muted-foreground">
//                     {t("order_id")}
//                   </p>
//                   <p className="text-sm font-medium truncate">{order.id}</p>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <span
//                     className={`text-xs px-2 py-1 rounded-md border whitespace-nowrap ${
//                       statusStyle[order.status]
//                     }`}
//                   >
//                     {t(`order_status_${order.status.toLowerCase()}`)}
//                   </span>

//                   <button
//                     onClick={(ev) => {
//                       ev.stopPropagation();
//                       setExpanded((s) => ({ ...s, [order.id]: !s[order.id] }));
//                     }}
//                     aria-expanded={isExpanded}
//                     className="p-1 rounded-md hover:bg-muted/10"
//                   >
//                     {isExpanded ? <ChevronUp /> : <ChevronDown />}
//                   </button>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
//                 <div className="flex items-center gap-2 text-muted-foreground">
//                   <Clock size={14} />
//                   <span>{fmtDate(order.createdAt)}</span>
//                 </div>

//                 <div className="flex items-start gap-2 text-muted-foreground">
//                   <MapPin size={14} className="mt-0.5" />
//                   <div className="space-y-1">
//                     <div className="whitespace-pre-line">{displayLocation}</div>
//                     {order.notes && (
//                       <div className="italic text-muted-foreground/80">
//                         {t("additional_info")}: {order.notes}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 {order.foodOrderItems?.map((item) => (
//                   <div
//                     key={item.id}
//                     className="flex items-start gap-3"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted/5 flex-shrink-0">
//                       {item.food.image ? (
//                         // next/image with fixed layout inside a small box
//                         <Image
//                           src={item.food.image}
//                           alt={item.food.foodName}
//                           width={64}
//                           height={64}
//                           className="object-cover w-full h-full"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
//                           {t("no_image")}
//                         </div>
//                       )}
//                     </div>

//                     <div className="min-w-0 flex-1">
//                       <div className="flex items-center justify-between gap-2">
//                         <div className="truncate">
//                           <p className="text-sm font-medium">
//                             {item.food.foodName}
//                           </p>
//                           {item.food.ingredients && (
//                             <p className="text-xs text-muted-foreground truncate">
//                               {item.food.ingredients}
//                             </p>
//                           )}
//                         </div>

//                         <div className="text-right">
//                           <div className="text-sm font-semibold">
//                             {fmtCurrency(
//                               (item.food.price ?? 0) * item.quantity
//                             )}
//                           </div>
//                           <div className="text-xs text-muted-foreground">
//                             {item.quantity}× {fmtCurrency(item.food.price ?? 0)}
//                           </div>
//                         </div>
//                       </div>

//                       {item.food.extraImages?.length ? (
//                         <div className="mt-2 flex gap-2 overflow-auto">
//                           {item.food.extraImages.map((src, idx) => (
//                             <div
//                               key={idx}
//                               className="w-12 h-8 flex-shrink-0 rounded overflow-hidden border border-border/50"
//                             >
//                               <Image
//                                 src={src}
//                                 alt={`extra-${idx}`}
//                                 width={48}
//                                 height={32}
//                                 className="object-cover w-full h-full"
//                               />
//                             </div>
//                           ))}
//                         </div>
//                       ) : null}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {isExpanded && (
//                 <div className="pt-3 border-t border-border/50 space-y-2 text-sm">
//                   <div className="flex items-center justify-between">
//                     <div className="text-muted-foreground">
//                       {t("items_total")}
//                     </div>
//                     <div className="font-medium">
//                       {fmtCurrency(
//                         order.foodOrderItems.reduce(
//                           (s, it) => s + (it.food.price ?? 0) * it.quantity,
//                           0
//                         )
//                       )}
//                     </div>
//                   </div>

//                   {order.discount ? (
//                     <div className="flex items-center justify-between text-sm text-muted-foreground">
//                       <div>{t("discount")}</div>
//                       <div>-{fmtCurrency(order.discount)}</div>
//                     </div>
//                   ) : null}

//                   <div className="flex items-center justify-between text-base font-semibold">
//                     <div>{t("total")}</div>
//                     <div>{fmtCurrency(order.totalPrice)}</div>
//                   </div>

//                   <div className="pt-2 flex items-center justify-between">
//                     <div className="text-xs text-muted-foreground">
//                       {order.firstName || order.lastName ? (
//                         <div>
//                           {`${order.firstName ?? ""} ${
//                             order.lastName ?? ""
//                           }`.trim()}
//                         </div>
//                       ) : null}
//                       {order.phone ? (
//                         <div>
//                           {t("phone")}: {order.phone}
//                         </div>
//                       ) : null}
//                     </div>

//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() =>
//                           router.push(`/${locale}/profile/orders/${order.id}`)
//                         }
//                         className="text-sm font-medium text-primary hover:underline"
//                       >
//                         {t("view_details")}
//                       </button>

//                       <button
//                         onClick={() => navigator.clipboard?.writeText(order.id)}
//                         className="text-sm text-muted-foreground px-2 py-1 rounded-md border border-border/40"
//                       >
//                         {t("copy_id")}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </motion.article>
//           );
//         })}
//       </div>

//       {isFetching && (
//         <p className="text-xs text-center text-muted-foreground">
//           {t("refreshing")}
//         </p>
//       )}
//     </div>
//   );
// }
