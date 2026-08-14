"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import type { ArticleSection } from "@/lib/articles";

type TextSize = "small" | "standard" | "large";
type ContentWidth = "standard" | "wide";

type WikiArticleShellProps = {
  title: string;
  sections: ArticleSection[];
  children: ReactNode;
};

export function WikiArticleShell({ title, sections, children }: WikiArticleShellProps) {
  const [textSize, setTextSize] = useState<TextSize>("standard");
  const [contentWidth, setContentWidth] = useState<ContentWidth>("standard");
  const [tocOpen, setTocOpen] = useState(true);
  const [appearanceOpen, setAppearanceOpen] = useState(true);
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "");
  const sectionKey = useMemo(() => sections.map(({ id }) => id).join("|"), [sections]);

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
        <a className="wordmark" href="#article-start" aria-label="信息学数论百科首页">
          <span className="wordmark-symbol">NT</span>
          <strong>信息学数论百科</strong>
        </a>
        <form className="global-search" role="search" onSubmit={(event) => event.preventDefault()}>
          <span aria-hidden="true">⌕</span>
          <input aria-label="搜索条目" placeholder="搜索条目" />
          <button type="submit">搜索</button>
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
