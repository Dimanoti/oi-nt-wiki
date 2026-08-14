import { articleSources } from "@/content/generated";

export type ArticleSection = {
  id: string;
  label: string;
  level: 2 | 3;
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  body: string;
  sections: ArticleSection[];
};

export const articleSlugs = Object.keys(articleSources);

export function getArticle(slug: string): Article | null {
  const source = articleSources[slug as keyof typeof articleSources];
  if (!source) return null;

  const { data, content } = parseFrontMatter(source);
  const title = data.title || slug;
  const description = data.description || "";

  return {
    slug,
    title,
    description,
    body: content,
    sections: extractSections(content),
  };
}

function parseFrontMatter(source: string): { data: Record<string, string>; content: string } {
  if (!source.startsWith("---\n")) return { data: {}, content: source };

  const closingMarker = source.indexOf("\n---", 4);
  if (closingMarker === -1) return { data: {}, content: source };

  const data: Record<string, string> = {};
  const frontMatter = source.slice(4, closingMarker);

  for (const line of frontMatter.split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^(["'])(.*)\1$/, "$2");
    if (key) data[key] = value;
  }

  return {
    data,
    content: source.slice(closingMarker + 4).replace(/^\r?\n/, ""),
  };
}

function extractSections(markdown: string): ArticleSection[] {
  const sections: ArticleSection[] = [];
  const usedIds = new Map<string, number>();

  for (const line of markdown.split("\n")) {
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    const label = stripInlineMarkdown(match[2]);
    const baseId = headingId(label) || `section-${sections.length + 1}`;
    const count = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, count + 1);

    sections.push({
      id: count === 0 ? baseId : `${baseId}-${count + 1}`,
      label,
      level,
    });
  }

  return sections;
}

function stripInlineMarkdown(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function headingId(value: string): string {
  return value
    .toLocaleLowerCase("zh-CN")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}
