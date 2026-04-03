import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harness Engineering — 从 Claude Code 源码深度解析顶级 Agent 编排架构",
  description: "When the Model is Not Enough. 深度剖析 Claude Code 泄露源码中的 Harness 设计哲学。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
