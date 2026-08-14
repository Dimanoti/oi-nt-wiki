"use client";

import { useEffect, useState } from "react";

type TextSize = "small" | "standard" | "large";
type ContentWidth = "standard" | "wide";

const sections = [
  { id: "article-start", label: "开头" },
  { id: "article-section", label: "1　章节标题" },
  { id: "article-extensions", label: "2　扩展模块" },
];

function PlaceholderLines({ count = 4, short = false }: { count?: number; short?: boolean }) {
  return (
    <div className="placeholder-lines" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span key={index} style={{ width: index === count - 1 || (short && index === 1) ? "62%" : "100%" }} />
      ))}
    </div>
  );
}

export default function Home() {
  const [textSize, setTextSize] = useState<TextSize>("standard");
  const [contentWidth, setContentWidth] = useState<ContentWidth>("standard");
  const [tocOpen, setTocOpen] = useState(true);
  const [appearanceOpen, setAppearanceOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("article-start");

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
  }, []);

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
            <div><h1>条目标题</h1><p>来自 信息学数论百科</p></div>
          </header>

          <div className="content-columns">
            <article className="article-content">
              <div className="content-placeholder lead-placeholder">
                <span className="placeholder-label">Markdown 正文区域</span>
                <PlaceholderLines count={5} />
              </div>

              <section className="template-section" id="article-section">
                <div className="section-title-row"><h2>章节标题</h2></div>
                <PlaceholderLines count={4} short />
              </section>

              <section className="template-section" id="article-extensions">
                <div className="section-title-row"><h2>扩展模块</h2></div>
                <div className="extension-grid">
                  <div className="extension-block formula-block">
                    <span className="extension-label">KaTeX</span>
                    <div className="formula-placeholder"><i /><i /><i /></div>
                  </div>
                  <div className="extension-block code-block">
                    <span className="extension-label">代码</span>
                    <div className="code-placeholder"><i /><i /><i /><i /></div>
                  </div>
                  <div className="extension-block visual-block">
                    <span className="extension-label">HTML / 可视化</span>
                    <div className="visual-placeholder"><span>+</span></div>
                  </div>
                </div>
              </section>
            </article>
          </div>
        </main>

        <aside className="right-sidebar">
          <section className={!tocOpen ? "sidebar-collapsed" : ""}>
            <h2>目录 <button type="button" aria-expanded={tocOpen} onClick={() => setTocOpen((open) => !open)}>{tocOpen ? "隐藏" : "显示"}</button></h2>
            {tocOpen && (
              <nav className="toc-list" aria-label="本页目录">
                {sections.map((section) => (
                  <a
                    className={activeSection === section.id ? "current" : ""}
                    href={`#${section.id}`}
                    key={section.id}
                    onClick={(event) => { event.preventDefault(); scrollToSection(section.id); }}
                  >{section.label}</a>
                ))}
              </nav>
            )}
          </section>

          <section className={!appearanceOpen ? "sidebar-collapsed" : ""}>
            <h2>外观 <button type="button" aria-expanded={appearanceOpen} onClick={() => setAppearanceOpen((open) => !open)}>{appearanceOpen ? "隐藏" : "显示"}</button></h2>
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
