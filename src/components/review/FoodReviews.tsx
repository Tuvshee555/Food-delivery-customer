/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

type ReviewUser = { id: string; name: string };

type Review = {
  id: string;
  rating: number;
  comment: string;
  images: string[];
  verifiedPurchase: boolean;
  createdAt: string;
  user: ReviewUser;
};

type ReviewsResponse = {
  avgRating: number;
  reviewCount: number;
  ratingCount: Record<1 | 2 | 3 | 4 | 5, number>;
  reviews: Review[];
};

const TOKEN_KEY = "token"; // change if you store it differently

const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
};

const StarRow = ({ rating }: { rating: number }) => {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={
            i < full
              ? "text-yellow-500 text-sm"
              : "text-muted-foreground text-sm"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
};

const RatingBar = ({
  star,
  count,
  total,
}: {
  star: 1 | 2 | 3 | 4 | 5;
  count: number;
  total: number;
}) => {
  const percent = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-8 text-muted-foreground">{star}★</span>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-foreground"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-10 text-right text-muted-foreground">{count}</span>
    </div>
  );
};

export const FoodReviews = ({ foodId }: { foodId: string }) => {
  const { t } = useI18n();

  const [data, setData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = useMemo(() => getToken(), []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/review/food/${foodId}`,
        { cache: "no-store" },
      );
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("fetchReviews error:", err);
      setData({
        avgRating: 0,
        reviewCount: 0,
        ratingCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        reviews: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foodId]);

  const handleSubmit = async () => {
    if (!token) return;

    const trimmed = comment.trim();
    if (trimmed.length < 2) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/review/food/${foodId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating,
            comment: trimmed,
            images: [],
          }),
        },
      );

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(json?.message || "Failed to post review");
        return;
      }

      setComment("");
      setRating(5);
      await fetchReviews();
    } catch (err) {
      console.error("create review error:", err);
      alert("Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const avg = data?.avgRating ?? 0;
  const count = data?.reviewCount ?? 0;
  const ratingCount = data?.ratingCount ?? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  return (
    <div className="w-full">
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Left: summary */}
          <div className="w-full lg:w-[340px]">
            <h2 className="text-base font-semibold">
              {t("reviews") ?? "Reviews"}
            </h2>

            <div className="mt-3 flex items-center gap-3">
              <div className="text-3xl font-bold">{avg.toFixed(1)}</div>
              <div className="flex flex-col gap-1">
                <StarRow rating={avg} />
                <div className="text-xs text-muted-foreground">
                  {count} {t("reviews") ?? "reviews"}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {[5, 4, 3, 2, 1].map((s) => (
                <RatingBar
                  key={s}
                  star={s as 1 | 2 | 3 | 4 | 5}
                  count={ratingCount[s as 1 | 2 | 3 | 4 | 5] ?? 0}
                  total={count}
                />
              ))}
            </div>

            {/* Write review */}
            <div className="mt-6">
              <div className="text-sm font-medium">
                {t("write_review") ?? "Write a review"}
              </div>

              {!token ? (
                <div className="mt-2 text-xs text-muted-foreground">
                  {t("login_to_review") ?? "Login to leave a review."}
                </div>
              ) : (
                <div className="mt-3 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {t("rating") ?? "Rating"}:
                    </span>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="h-[40px] px-3 rounded-md border border-border bg-background text-sm"
                    >
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[90px] w-full rounded-md border border-border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
                    placeholder={
                      t("review_placeholder") ?? "Share your experience..."
                    }
                    maxLength={800}
                  />

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || comment.trim().length < 2}
                    className="h-[44px] rounded-md bg-foreground text-background text-sm font-medium disabled:opacity-50"
                  >
                    {isSubmitting
                      ? (t("posting") ?? "Posting...")
                      : (t("post_review") ?? "Post review")}
                  </button>

                  <div className="text-[11px] text-muted-foreground">
                    {t("verified_purchase_info") ??
                      "Only customers who purchased can review. Reviews are verified automatically."}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: list */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">
                {t("customer_reviews") ?? "Customer Reviews"}
              </div>

              {loading && (
                <div className="text-xs text-muted-foreground">
                  {t("loading") ?? "Loading..."}
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-4">
              {!loading &&
                (!data?.reviews?.length ? (
                  <div className="text-sm text-muted-foreground">
                    {t("no_reviews") ?? "No reviews yet."}
                  </div>
                ) : (
                  data.reviews.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-xl border border-border bg-background p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col gap-1">
                          <div className="text-sm font-medium">
                            {r.user?.name ?? "User"}
                          </div>
                          <div className="flex items-center gap-2">
                            <StarRow rating={r.rating} />
                            {r.verifiedPurchase && (
                              <span className="text-[11px] px-2 py-1 rounded-full bg-muted border border-border text-muted-foreground">
                                {t("verified_purchase") ?? "Verified purchase"}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(r.createdAt)}
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-foreground leading-relaxed whitespace-pre-line">
                        {r.comment}
                      </p>

                      {!!r.images?.length && (
                        <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {r.images.map((img) => (
                            <img
                              key={img}
                              src={img}
                              alt="review"
                              className="w-full aspect-square object-cover rounded-md border border-border"
                              loading="lazy"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
