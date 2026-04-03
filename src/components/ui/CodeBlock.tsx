export function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="code-block overflow-hidden">
      {title && (
        <div className="px-4 py-2 border-b border-[#2A2A2A] text-xs font-mono text-[#8B949E] bg-[#222222]">
          {title}
        </div>
      )}
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm leading-relaxed">{children}</code>
      </pre>
    </div>
  );
}
