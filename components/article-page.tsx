import { ArticleMarkdown } from "@/components/article-markdown";
import { WikiArticleShell } from "@/components/wiki-article-shell";
import { getArticleSearchIndex, type Article } from "@/lib/articles";

export function ArticlePage({ article }: { article: Article }) {
  return (
    <WikiArticleShell title={article.title} sections={article.sections} searchEntries={getArticleSearchIndex()}>
      <ArticleMarkdown markdown={article.body} sections={article.sections} />
    </WikiArticleShell>
  );
}
