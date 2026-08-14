import type { Metadata } from "next";
import { IBM_Plex_Mono, Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";

const sans = Noto_Sans_SC({ variable: "--font-sans", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const serif = Noto_Serif_SC({ variable: "--font-serif", subsets: ["latin"], weight: ["600", "700", "900"] });
const mono = IBM_Plex_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: {
    default: "信息学数论百科",
    template: "%s - 信息学数论百科",
  },
  description: "面向信息学竞赛的数论百科。",
  other: { "codex-preview": "development" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className={`${sans.variable} ${serif.variable} ${mono.variable}`}>{children}</body></html>;
}
