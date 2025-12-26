"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

import { classes } from "./styles";
import { CartList } from "./CartList";
import { CartSummary } from "./CartSummary";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { useCartLogic } from "./components/useCartLogic";

export default function CartStep() {
  const router = useRouter();
  const { locale, t } = useI18n();

  const { items, loading, total, updateQuantity, removeItem, clearCart } =
    useCartLogic();

  if (loading) {
    return <p className="p-10 text-muted-foreground">{t("loading")}</p>;
  }

  return (
    <main className={classes.page}>
      <div className={classes.wrapper}>
        {/* LEFT – CART ITEMS */}
        <motion.section
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className={classes.leftCard}
        >
          <div className="flex justify-between items-center mb-6 border-b border-border pb-3">
            <h1 className="text-xl sm:text-2xl font-semibold">
              {t("cart2.yourCart")}
            </h1>

            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition"
              >
                <Trash2 className="w-4 h-4" />
                {t("cart2.clear")}
              </button>
            )}
          </div>

          <CartList
            items={items}
            onUpdateQty={updateQuantity}
            onRemove={removeItem}
          />
        </motion.section>

        {/* RIGHT – SUMMARY */}
        <motion.section
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          className={classes.rightCard}
        >
          <CartSummary
            total={total}
            delivery={100}
            onCheckout={() => router.push(`/${locale}/checkout?step=info`)}
            onClear={items.length > 0 ? clearCart : undefined}
          />
        </motion.section>
      </div>
    </main>
  );
}
