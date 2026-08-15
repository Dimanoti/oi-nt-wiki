import type { ArticleSearchEntry } from "./articles";

export function findArticles(
  entries: ArticleSearchEntry[],
  query: string,
): ArticleSearchEntry[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const terms = normalizedQuery.split(" ").filter(Boolean);

  return entries
    .map((entry) => {
      const title = normalizeSearchText(entry.title);
      const slug = normalizeSearchText(entry.slug);
      const aliases = entry.aliases.map(normalizeSearchText);
      const searchable = [title, slug, ...aliases].join(" ");

      if (!terms.every((term) => searchable.includes(term))) {
        return null;
      }

      let score = 0;

      if (title === normalizedQuery) {
        score += 100;
      } else if (title.startsWith(normalizedQuery)) {
        score += 50;
      } else if (title.includes(normalizedQuery)) {
        score += 30;
      }

      if (slug === normalizedQuery) {
        score += 80;
      } else if (slug.startsWith(normalizedQuery)) {
        score += 40;
      } else if (slug.includes(normalizedQuery)) {
        score += 20;
      }

      if (aliases.some((alias) => alias === normalizedQuery)) {
        score += 80;
      } else if (aliases.some((alias) => alias.startsWith(normalizedQuery))) {
        score += 40;
      } else if (aliases.some((alias) => alias.includes(normalizedQuery))) {
        score += 20;
      }

      return { entry, score };
    })
    .filter(
      (result): result is {
        entry: ArticleSearchEntry;
        score: number;
      } => result !== null,
    )
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.entry.title.localeCompare(b.entry.title, "zh-CN"),
    )
    .map(({ entry }) => entry);
}

function normalizeSearchText(value: string): string {
  return value
    .toLocaleLowerCase("zh-CN")
    .trim()
    .replace(/\s+/g, " ");
}