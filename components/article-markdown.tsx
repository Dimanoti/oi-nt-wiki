import ReactMarkdown, { defaultUrlTransform, type Components } from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import type { ArticleSection } from "@/lib/articles";
import { expandMarkdownContainers } from "@/lib/markdown-containers";

type ArticleMarkdownProps = {
  markdown: string;
  sections: ArticleSection[];
};

export function ArticleMarkdown({ markdown, sections }: ArticleMarkdownProps) {
  let headingIndex = 0;
  const basePath = process.env.BASE_PATH ?? "";
  const expandedMarkdown = expandMarkdownContainers(markdown);

  const nextHeading = (level: 2 | 3) => {
    const section = sections[headingIndex];
    headingIndex += 1;
    return section?.level === level ? section.id : undefined;
  };

  const components: Components = {
    h2: ({ children }) => <h2 id={nextHeading(2)}>{children}</h2>,
    h3: ({ children }) => <h3 id={nextHeading(3)}>{children}</h3>,
    iframe: ({ src, title, ...props }) => {
      const resolvedSource = src?.startsWith("embed:")
        ? `${basePath}/embeds/${src.slice("embed:".length).replace(/^\/+/, "")}`
        : src;

      return <iframe {...props} src={resolvedSource} title={title ?? "嵌入内容"} loading="lazy" />;
    },
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeKatex]}
      components={components}
      urlTransform={(url) => url.startsWith("embed:") ? url : defaultUrlTransform(url)}
    >
      {expandedMarkdown}
    </ReactMarkdown>
  );
}
