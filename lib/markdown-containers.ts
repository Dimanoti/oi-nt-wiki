const defaultTitles: Record<string, string> = {
  info: "信息",
  warning: "警告",
  tip: "提示",
  note: "备注",
  success: "完成",
  danger: "危险",
  caution: "注意",
  important: "重要",
};

type CodeFence = {
  character: "`" | "~";
  length: number;
};

export function expandMarkdownContainers(markdown: string): string {
  const output: string[] = [];
  const containers: string[] = [];
  let codeFence: CodeFence | null = null;

  for (const line of markdown.split("\n")) {
    const fence = /^\s*(`{3,}|~{3,})/.exec(line)?.[1];

    if (fence) {
      const character = fence[0] as "`" | "~";
      if (!codeFence) {
        codeFence = { character, length: fence.length };
      } else if (codeFence.character === character && fence.length >= codeFence.length) {
        codeFence = null;
      }
      output.push(line);
      continue;
    }

    if (codeFence) {
      output.push(line);
      continue;
    }

    const opening = /^\s*:::\s*([a-z][a-z0-9-]*)\s*(?:\[([^\]]*)\])?\s*(?:\{(open)\})?\s*$/i.exec(line);
    if (opening) {
      const type = opening[1].toLowerCase();
      const title = opening[2]?.trim() || defaultTitles[type] || type;
      const open = opening[3] === "open" ? " open" : "";

      containers.push(type);
      output.push(
        `<details class="wiki-admonition wiki-admonition-${type}"${open}>`,
        `<summary>${escapeHtml(title)}</summary>`,
        "",
      );
      continue;
    }

    if (/^\s*:::\s*$/.test(line) && containers.length > 0) {
      containers.pop();
      output.push("", "</details>");
      continue;
    }

    output.push(line);
  }

  while (containers.length > 0) {
    containers.pop();
    output.push("", "</details>");
  }

  return output.join("\n");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
