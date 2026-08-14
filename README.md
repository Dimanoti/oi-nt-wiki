# oi-nt-wiki

“信息学数论百科”的 Wikipedia 风格前端模板。目前刻意不包含任何数论条目，只用于确认布局、字体和交互基调。

## 当前包含

- Wikipedia 风格的站名、搜索框与条目排版
- 可折叠、可平滑定位并跟随阅读位置的目录
- 小 / 标准 / 大三档正文字号
- 标准 / 宽两档内容宽度
- Markdown、KaTeX、代码与 HTML / 可视化的空模块样式
- 响应式布局
- GitHub Pages 自动发布工作流

## 本地运行

需要 Node.js 22.13 或更高版本：

```bash
npm install
npm run dev
```

主要页面位于 `app/page.tsx`，全局样式位于 `app/globals.css`。

## 发布到 GitHub Pages

1. 新建 GitHub 仓库并推送本项目。
2. 在 **Settings → Pages → Build and deployment** 中将 Source 设为 **GitHub Actions**。
3. 推送到 `main` 后，`.github/workflows/deploy-pages.yml` 会自动构建并发布。

工作流默认使用仓库名作为 `basePath`。使用自定义域名时，可将工作流中的 `BASE_PATH` 改为空字符串。

## 内容层

项目已保留 KaTeX、Markdown 解析与原生 HTML 所需依赖，但当前版本没有预置文章。确认模板后，可以再接入 Markdown 文件与自动路由，而不需要重做视觉框架。
