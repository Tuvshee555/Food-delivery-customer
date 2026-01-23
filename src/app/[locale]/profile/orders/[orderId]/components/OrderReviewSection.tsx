/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { OrderDetails } from "./types";

type Props = {
  order: OrderDetails;
  token: string | null;
};

type Draft = {
  rating: number;
  comment: string;
  images: string[];
  posting: boolean;
};

const clampRating = (n: number) => Math.max(1, Math.min(5, Math.floor(n)));

const safeToken = (token: string | null) => {
  if (!token) return null;
  const t = token.trim();
  if (!t || t === "null" || t === "undefined") return null;
  // optional sanity check: JWT usually has 2 dots
  if (t.split(".").length < 3) return null;
  return t;
};

export const OrderReviewSection = ({ order, token }: Props) => {
  const { t } = useI18n();

  const usableToken = useMemo(() => safeToken(token), [token]);

  // Only show after paid/delivered/etc
  const canReview = useMemo(() => {
    return ["PAID", "DELIVERING", "DELIVERED"].includes(order.status);
  }, [order.status]);

  const initialDrafts = useMemo(() => {
    const map: Record<string, Draft> = {};
    for (const item of order.items) {
      map[item.food.id] = {
        rating: 5,
        comment: "",
        images: [],
        posting: false,
      };
    }
    return map;
  }, [order.items]);

  const [drafts, setDrafts] = useState<Record<string, Draft>>(initialDrafts);

  // keep drafts in sync if order.items changes
  useEffect(() => {
    setDrafts((prev) => {
      const next: Record<string, Draft> = { ...prev };

      // add missing
      for (const item of order.items) {
        if (!next[item.food.id]) {
          next[item.food.id] = {
            rating: 5,
            comment: "",
            images: [],
            posting: false,
          };
        }
      }

      // remove old drafts that no longer exist in order
      const ids = new Set(order.items.map((x) => x.food.id));
      for (const k of Object.keys(next)) {
        if (!ids.has(k)) delete next[k];
      }

      return next;
    });
  }, [order.items]);

  const uploadImage = async (file: File) => {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`, {
      method: "POST",
      body: form,
    });

    const data = await res.json().catch(() => ({}));
    const url = data?.url || data?.secure_url || data?.image;

    if (!res.ok || !url) throw new Error("upload_failed");
    return String(url);
  };

  const submit = async (foodId: string) => {
    const d = drafts[foodId];

    if (!usableToken) {
      toast.error(t("login_to_review") ?? "Please login to leave a review.");
      return;
    }

    if (!d) return;

    // stop double submit
    if (d.posting) return;

    const trimmed = d.comment.trim();
    if (trimmed.length < 2) {
      toast.error(
        t("review_min_chars") ?? "Please write at least 2 characters.",
      );
      return;
    }

    setDrafts((prev) => ({
      ...prev,
      [foodId]: { ...prev[foodId], posting: true },
    }));

    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      headers.Authorization = `Bearer ${usableToken}`;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/review/food/${foodId}`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            rating: clampRating(d.rating),
            comment: trimmed,
            images: d.images,
          }),
        },
      );

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(
          json?.message ||
            (t("failed_to_post_review") ?? "Failed to post review"),
        );
        return;
      }

      toast.success(t("review_posted") ?? "Review posted");

      // reset form for this item
      setDrafts((prev) => ({
        ...prev,
        [foodId]: {
          rating: 5,
          comment: "",
          images: [],
          posting: false,
        },
      }));
    } catch (err) {
      console.error(err);
      toast.error(t("server_error") ?? "Server error");
    } finally {
      setDrafts((prev) => ({
        ...prev,
        [foodId]: prev[foodId]
          ? { ...prev[foodId], posting: false }
          : prev[foodId],
      }));
    }
  };

  if (!canReview) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <div className="text-sm font-semibold">
          {t("write_review") ?? "Write a review"}
        </div>
        <div className="mt-2 text-xs text-muted-foreground leading-relaxed">
          {t("review_available_after_paid") ??
            "Reviews are available after your order is paid/delivered."}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6 space-y-5">
      <div>
        <div className="text-sm font-semibold">
          {t("write_review") ?? "Write a review"}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {t("review_only_buyers") ??
            "Only customers who purchased can review. Reviews are verified automatically."}
        </div>
      </div>

      <div className="space-y-6">
        {order.items.map((item) => {
          const foodId = item.food.id;
          const d = drafts[foodId] ?? {
            rating: 5,
            comment: "",
            images: [],
            posting: false,
          };

          return (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-background p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">
                    {item.food.foodName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("quantity") ?? "Qty"}: {item.quantity}
                  </div>
                </div>

                <select
                  value={d.rating}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setDrafts((prev) => ({
                      ...prev,
                      [foodId]: { ...prev[foodId], rating: v },
                    }));
                  }}
                  className="h-[40px] px-3 rounded-md border border-border bg-background text-sm"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r}★
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                value={d.comment}
                onChange={(e) =>
                  setDrafts((prev) => ({
                    ...prev,
                    [foodId]: { ...prev[foodId], comment: e.target.value },
                  }))
                }
                className="mt-3 min-h-[110px] w-full rounded-md border border-border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
                placeholder={
                  t("review_placeholder") ?? "Share your experience..."
                }
                maxLength={800}
              />

              {/* upload */}
              <div className="mt-3">
                <div className="text-xs font-medium">
                  {t("add_photos") ?? "Add photos"}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 text-sm"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    // reset input so the same file can be selected again
                    e.currentTarget.value = "";

                    // limit 6 images
                    if (d.images.length >= 6) {
                      toast.error(t("max_photos_6") ?? "Max 6 photos");
                      return;
                    }

                    try {
                      const url = await uploadImage(file);

                      setDrafts((prev) => {
                        const current = prev[foodId];
                        const nextImages = [...current.images, url].slice(0, 6);
                        return {
                          ...prev,
                          [foodId]: { ...current, images: nextImages },
                        };
                      });
                    } catch (err) {
                      console.error(err);
                      toast.error(t("upload_failed") ?? "Upload failed");
                    }
                  }}
                />

                {!!d.images.length && (
                  <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {d.images.map((img) => (
                      <div key={img} className="relative">
                        <img
                          src={img}
                          alt="review"
                          className="w-full aspect-square object-cover rounded-md border border-border"
                        />
                        <button
                          onClick={() =>
                            setDrafts((prev) => ({
                              ...prev,
                              [foodId]: {
                                ...prev[foodId],
                                images: prev[foodId].images.filter(
                                  (x) => x !== img,
                                ),
                              },
                            }))
                          }
                          className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-foreground text-background text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-2 text-[11px] text-muted-foreground">
                  {t("max_photos_6") ?? "Max 6 photos"}
                </div>
              </div>

              <button
                onClick={() => submit(foodId)}
                disabled={d.posting || d.comment.trim().length < 2}
                className="mt-4 h-[44px] w-full rounded-md bg-foreground text-background text-sm font-medium disabled:opacity-50"
              >
                {d.posting
                  ? (t("posting") ?? "Posting...")
                  : (t("post_review") ?? "Post review")}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
