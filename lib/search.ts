import type { ArticleSearchEntry } from "./articles";

export function findArticles(entries: ArticleSearchEntry[], query: string): ArticleSearchEntry[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const terms = normalizedQuery.split(" ").filter(Boolean);

  return entries
    .map((entry) => {
      const title = normalizeSearchText(entry.title);
      const description = normalizeSearchText(entry.description);
      const slug = normalizeSearchText(entry.slug);
      const aliases = normalizeSearchText(entry.aliases.join(" "));
      const text = normalizeSearchText(entry.text);
      const searchable = `${title} ${description} ${slug} ${aliases} ${text}`;

      if (!terms.every((term) => searchable.includes(term))) return null;

      let score = 0;
      if (title === normalizedQuery) score += 100;
      if (title.startsWith(normalizedQuery)) score += 50;
      if (title.includes(normalizedQuery)) score += 30;
      if (slug.includes(normalizedQuery) || aliases.includes(normalizedQuery)) score += 20;
      if (description.includes(normalizedQuery)) score += 10;

      return { entry, score };
    })
    .filter((result): result is { entry: ArticleSearchEntry; score: number } => result !== null)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, "zh-CN"))
    .map(({ entry }) => entry);
}

function normalizeSearchText(value: string): string {
  return value.toLocaleLowerCase("zh-CN").trim().replace(/\s+/g, " ");
}
