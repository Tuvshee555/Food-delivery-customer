"use client";

import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { ArrowRight } from "lucide-react";

type BlogPost = {
  title: string;
  excerpt: string;
  date: string;
};

export default function BlogPage() {
  const { t } = useI18n();

  const posts: BlogPost[] = [
    {
      title: t("blog_post_1_title"),
      excerpt: t("blog_post_1_excerpt"),
      date: "2025.01.12",
    },
    {
      title: t("blog_post_2_title"),
      excerpt: t("blog_post_2_excerpt"),
      date: "2025.01.05",
    },
    {
      title: t("blog_post_3_title"),
      excerpt: t("blog_post_3_excerpt"),
      date: "2024.12.28",
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-6 py-20 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">{t("blog_title")}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{t("blog_subtitle")}</p>
      </div>

      {/* Posts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <div
            key={index}
            className="border rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition"
          >
            <div className="space-y-3">
              <span className="text-xs text-gray-400">{post.date}</span>
              <h2 className="font-semibold text-lg leading-snug">
                {post.title}
              </h2>
              <p className="text-gray-600 text-sm">{post.excerpt}</p>
            </div>

            <button
              className="mt-6 text-sm font-medium flex items-center gap-2 hover:underline"
              disabled
            >
              {t("blog_read_more")}
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
