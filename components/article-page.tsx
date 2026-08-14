import { ArticleMarkdown } from "@/components/article-markdown";
import { WikiArticleShell } from "@/components/wiki-article-shell";
import type { Article } from "@/lib/articles";

export function ArticlePage({ article }: { article: Article }) {
  return (
    <WikiArticleShell title={article.title} sections={article.sections}>
      <ArticleMarkdown markdown={article.body} sections={article.sections} />
    </WikiArticleShell>
  );
}
