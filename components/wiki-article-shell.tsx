"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import type { ArticleSearchEntry, ArticleSection } from "@/lib/articles";
import { findArticles } from "@/lib/search";

type TextSize = "small" | "standard" | "large";
type ContentWidth = "standard" | "wide";

type WikiArticleShellProps = {
  title: string;
  sections: ArticleSection[];
  searchEntries: ArticleSearchEntry[];
  children: ReactNode;
};

export function WikiArticleShell({ title, sections, searchEntries, children }: WikiArticleShellProps) {
  const router = useRouter();
  const [textSize, setTextSize] = useState<TextSize>("standard");
  const [contentWidth, setContentWidth] = useState<ContentWidth>("standard");
  const [tocOpen, setTocOpen] = useState(true);
  const [appearanceOpen, setAppearanceOpen] = useState(true);
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const sectionKey = useMemo(() => sections.map(({ id }) => id).join("|"), [sections]);
  const searchResults = useMemo(
    () => findArticles(searchEntries, searchQuery).slice(0, 8),
    [searchEntries, searchQuery],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 },
    );

    sections.forEach(({ id }) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, [sectionKey, sections]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  return (
    <div className={`wiki-app text-${textSize} width-${contentWidth}`}>
      <header className="global-header">
        <Link className="wordmark" href="/" aria-label="信息学数论百科首页">
          <span className="wordmark-symbol">NT</span>
          <strong>信息学数论百科</strong>
        </Link>
        <form
          className="global-search"
          role="search"
          onFocus={() => setSearchOpen(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setSearchOpen(false);
          }}
          onSubmit={(event) => {
            event.preventDefault();
            const firstResult = searchResults[0];
            if (firstResult) router.push(`/${firstResult.slug}`);
          }}
        >
          <span aria-hidden="true">⌕</span>
          <input
            aria-label="搜索条目"
            aria-autocomplete="list"
            aria-controls="article-search-results"
            aria-expanded={searchOpen && searchQuery.trim().length > 0}
            placeholder="搜索条目"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setSearchOpen(true);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") setSearchOpen(false);
            }}
          />
          <button type="submit">搜索</button>
          {searchOpen && searchQuery.trim().length > 0 && (
            <div className="search-results" id="article-search-results" role="listbox" aria-label="搜索结果">
              {searchResults.length > 0 ? searchResults.map((entry) => (
                <Link
                  className="search-result"
                  href={`/${entry.slug}`}
                  key={entry.slug}
                  role="option"
                  aria-selected="false"
                  onClick={() => setSearchOpen(false)}
                >
                  <strong>{entry.title}</strong>
                  {entry.description && <span>{entry.description}</span>}
                </Link>
              )) : <p className="search-empty">未找到条目</p>}
            </div>
          )}
        </form>
      </header>

      <div className="wiki-layout">
        <main className="article-page">
          <header className="article-heading" id="article-start">
            <div>
              <h1>{title}</h1>
              <p>来自 信息学数论百科</p>
            </div>
          </header>

          <div className="content-columns">
            <article className="article-content">{children}</article>
          </div>
        </main>

        <aside className="right-sidebar">
          <section className={!tocOpen ? "sidebar-collapsed" : ""}>
            <h2>
              目录
              <button type="button" aria-expanded={tocOpen} onClick={() => setTocOpen((open) => !open)}>
                {tocOpen ? "隐藏" : "显示"}
              </button>
            </h2>
            {tocOpen && (
              <nav className="toc-list" aria-label="本页目录">
                {sections.map((section) => (
                  <a
                    className={`${activeSection === section.id ? "current" : ""}${section.level === 3 ? " toc-subsection" : ""}`}
                    href={`#${section.id}`}
                    key={section.id}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToSection(section.id);
                    }}
                  >
                    {section.label}
                  </a>
                ))}
              </nav>
            )}
          </section>

          <section className={!appearanceOpen ? "sidebar-collapsed" : ""}>
            <h2>
              外观
              <button type="button" aria-expanded={appearanceOpen} onClick={() => setAppearanceOpen((open) => !open)}>
                {appearanceOpen ? "隐藏" : "显示"}
              </button>
            </h2>
            {appearanceOpen && (
              <div className="appearance-controls">
                <fieldset>
                  <legend>文字</legend>
                  <label><input type="radio" name="text-size" checked={textSize === "small"} onChange={() => setTextSize("small")} /> 小</label>
                  <label><input type="radio" name="text-size" checked={textSize === "standard"} onChange={() => setTextSize("standard")} /> 标准</label>
                  <label><input type="radio" name="text-size" checked={textSize === "large"} onChange={() => setTextSize("large")} /> 大</label>
                </fieldset>
                <fieldset>
                  <legend>宽度</legend>
                  <label><input type="radio" name="width" checked={contentWidth === "standard"} onChange={() => setContentWidth("standard")} /> 标准</label>
                  <label><input type="radio" name="width" checked={contentWidth === "wide"} onChange={() => setContentWidth("wide")} /> 宽</label>
                </fieldset>
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
