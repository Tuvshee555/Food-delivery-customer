"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

export function HomeBlogSection() {
  const { locale, t } = useI18n();

  const posts = [
    {
      date: "2026-05-01",
      title: t("blog_post_1_title"),
      excerpt: t("blog_post_1_excerpt"),
    },
    {
      date: "2026-04-18",
      title: t("blog_post_2_title"),
      excerpt: t("blog_post_2_excerpt"),
    },
    {
      date: "2026-04-02",
      title: t("blog_post_3_title"),
      excerpt: t("blog_post_3_excerpt"),
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("blog_title")}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t(
              "blog_subtitle",
              "Хувцас арчилгаа, сонголтын зөвлөгөө, хүргэлтийн шинэчлэл.",
            )}
          </p>
        </div>
        <Link
          href={`/${locale}/blog`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {t("view_all")}
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.title}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <p className="text-xs text-muted-foreground mb-2">{post.date}</p>
            <h3 className="font-semibold mb-2">{post.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
            <Link
              href={`/${locale}/blog`}
              className="text-sm font-medium hover:underline"
            >
              {t("blog_read_more", "Read")} →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
