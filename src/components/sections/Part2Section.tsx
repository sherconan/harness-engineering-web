"use client";
import { RevealSection, StaggerContainer, StaggerItem } from "../motion/RevealSection";
import { SectionHeader } from "../ui/SectionHeader";
import { AccentCard } from "../ui/Card";

const modules = [
  {
    tag: "HEART",
    title: "核心循环",
    subtitle: "Query Loop",
    color: "blue" as const,
    content: "User Input → Build System Prompt → Call LLM API (streaming) → Parse Response → tool_use? → Check Permission → Execute Tool → Append Result → Loop",
    detail: "这个循环由 Harness 控制，不是模型自己决定何时停止。Claude Code 用 async generator 模式实现：QueryEngine.ts + query.ts",
  },
  {
    tag: "BRAIN",
    title: "系统 Prompt",
    subtitle: "Dynamic Assembly",
    color: "purple" as const,
    content: "不是静态字符串，是 914 行的动态构建器。分层结构：",
    detail: "Static Cacheable Prefix → __DYNAMIC_BOUNDARY__ → Per-User Content → User Context (CLAUDE.md + MEMORY.md + git status)",
  },
  {
    tag: "LIMBS",
    title: "工具系统",
    subtitle: "Tool Registry",
    color: "orange" as const,
    content: "四层体系：原子工具 (Bash/File/Grep) + 元工具 (Agent/Skill/ToolSearch) + MCP 工具 + Feature-gated 工具",
    detail: "核心挑战：工具太多 → 上下文爆炸。解法：ToolSearchTool 两级索引 — 系统 prompt 放名称目录，模型按需搜索完整 schema",
  },
  {
    tag: "HIPPOCAMPUS",
    title: "记忆系统",
    subtitle: "Memory",
    color: "purple" as const,
    content: "三层记忆：CLAUDE.md (项目指令) + MEMORY.md (持久记忆, 200行/25KB) + 自动提取 (后台 agent)",
    detail: "弱点：无向量检索、200 文件上限、无遗忘机制。LLM 从 200 个记忆文件中选 5 个最相关的",
  },
  {
    tag: "SAFETY VALVE",
    title: "权限系统",
    subtitle: "Permission",
    color: "green" as const,
    content: "为什么不能做成 Tool？因为模型可以选择不调用 Tool。安全关键逻辑必须在 Harness 层强制执行。",
    detail: "三级决策链：Deny (硬拒绝) → Allow (自动放行) → Ask (AI 分类器 + 用户确认)",
  },
  {
    tag: "SHORT-TERM",
    title: "上下文管理",
    subtitle: "Context Management",
    color: "orange" as const,
    content: "四种压缩策略：Compact (定期摘要) + Reactive Compact (响应式) + Context Collapse (折叠) + History Snip (裁剪)",
    detail: "Prompt Caching 协同：缓存边界确保静态 prompt 不受压缩影响，只压缩动态区域",
  },
  {
    tag: "CLONES",
    title: "Multi-Agent",
    subtitle: "Coordination",
    color: "blue" as const,
    content: "三种模式：子 Agent (独立 QueryEngine + 工具子集) + Team (Coordinator 分发 + Worker 执行) + Fork (后台并行)",
    detail: "每个子 agent 有独立的系统 prompt 和工具白名单。搜索用 Haiku (快+便宜)，编码用 Opus (准)",
  },
  {
    tag: "BRIDGE",
    title: "连接层",
    subtitle: "Bridge / Runtime",
    color: "green" as const,
    content: "IDE Bridge (VS Code/JetBrains) + Remote Exec (云端 Agent) + MCP Protocol (外部工具标准) + Multi-Platform",
    detail: "Claude Code bridge/ 目录有 33 个文件，bridgeMain.ts 115KB，replBridge.ts 100KB",
  },
];

export function Part2Section() {
  return (
    <section className="py-20 md:py-32 border-t border-border" id="components">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <SectionHeader
          tag="PART 2"
          title="Harness 的组成部分"
          subtitle="一个完整的 Harness 包含 8 个核心模块，每个都不可或缺"
        />

        {/* Module Grid */}
        <StaggerContainer className="grid md:grid-cols-2 gap-5 mb-16">
          {modules.map((mod, i) => (
            <StaggerItem key={i}>
              <div className={`bg-bg-card rounded-xl border border-border p-6 h-full accent-top-${mod.color} hover:border-accent/40 transition-colors duration-300`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-mono tracking-wider text-accent-${mod.color} bg-accent-${mod.color}/10 px-2 py-0.5 rounded`}>
                    {mod.tag}
                  </span>
                  <span className="text-text-muted text-xs font-mono">{mod.subtitle}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{mod.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-3">{mod.content}</p>
                <p className="text-text-muted text-xs leading-relaxed">{mod.detail}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Harness vs Tool boundary */}
        <RevealSection>
          <AccentCard side="left" color="blue" className="overflow-hidden">
            <h3 className="text-lg font-bold mb-4">
              Harness vs Tool 的边界
            </h3>
            <p className="text-accent text-sm font-mono mb-5">
              判断标准：系统必须强制执行的 → Harness &nbsp;|&nbsp; 模型主动发起的 → Tool
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-accent-green mb-3 font-mono">HARNESS (强制执行)</h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  {[
                    ["权限检查", "必须在 tool 执行前强制拦截"],
                    ["Prompt 组装", "API 调用前完成，模型还没开始思考"],
                    ["Token 预算", "API 层面控制，模型感知不到"],
                    ["上下文压缩", "消息裁剪在模型看到之前发生"],
                  ].map(([name, reason], i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-accent-green shrink-0">&bull;</span>
                      <span><span className="text-text-primary">{name}</span> &mdash; {reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-accent-orange mb-3 font-mono">TOOL (模型主动发起)</h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  {[
                    ["文件操作", "模型主动决定读/写文件"],
                    ["搜索", "模型决定何时需要搜索"],
                    ["Agent 派生", "模型决定是否需要子 agent"],
                    ["记忆写入", "模型判断什么值得记住"],
                  ].map(([name, reason], i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-accent-orange shrink-0">&bull;</span>
                      <span><span className="text-text-primary">{name}</span> &mdash; {reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AccentCard>
        </RevealSection>
      </div>
    </section>
  );
}
