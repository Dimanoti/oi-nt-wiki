import type { Metadata } from "next";
import { ArticlePage } from "@/components/article-page";
import { getArticle } from "@/lib/articles";

const article = getArticle("素数");

export const metadata: Metadata = {
  title: article?.title,
  description: article?.description,
};

export default function Home() {
  if (!article) return null;
  return <ArticlePage article={article} />;
}
