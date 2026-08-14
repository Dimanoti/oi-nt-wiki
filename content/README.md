# 条目编辑指南

每个条目是 `content` 目录中的一个 Markdown 文件。文件名使用小写英文、数字和连字符，例如 `prime.md`、`euler-function.md`。新增文件后重新运行开发服务器，页面会自动生成在同名路径下。

## 基本格式

```md
---
title: 条目标题
description: 页面摘要
---

## 一级章节

Markdown 正文。
```

## KaTeX

行内公式写成 `$a^2+b^2=c^2$`，独立公式写成：

```md
$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$
```

## 原生 HTML

可信的条目文件可以直接插入 HTML：

```html
我们把字变成 <span style="color:red">红色</span>。
```

原生 HTML 不会经过清理，只应写入自己信任的内容。

## 折叠块

使用 `:::类型[标题]` 创建折叠块。没有 `{open}` 时默认关闭：

```md
:::info[折叠块]

这里可以继续使用 **Markdown**、$KaTeX$、代码块和 HTML。

:::
```

加上 `{open}` 后默认打开：

```md
:::warning[需要注意]{open}

这里默认展开。

:::
```

内置样式包括 `info`、`warning`、`caution`、`tip`、`success`、`danger`、`important` 和 `note`。其他英文类型也可以使用，并显示为通用样式。折叠块标记不会在代码围栏内部生效。

## 完整 HTML / JavaScript 可视化

将任意 HTML、CSS、JavaScript 页面放入 `public/embeds`，再在 Markdown 中嵌入：

```html
<iframe class="wiki-embed" src="embed:demo.html" title="演示"></iframe>
```

`embed:` 会自动处理 GitHub Pages 的仓库子路径。嵌入内容拥有完整 HTML 能力，只应加入自己信任的代码。
