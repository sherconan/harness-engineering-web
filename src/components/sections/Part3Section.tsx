"use client";
import { RevealSection, StaggerContainer, StaggerItem } from "../motion/RevealSection";
import { SectionHeader } from "../ui/SectionHeader";
import { AccentCard } from "../ui/Card";
import { CodeBlock } from "../ui/CodeBlock";

const designs = [
  {
    num: "#1",
    title: "工具延迟加载",
    subtitle: "ToolSearchTool",
    color: "green" as const,
    problem: "40+ 内置工具 + 无限 MCP 工具，每个工具描述占 200-500 tokens，全部塞进系统 prompt 会导致上下文爆炸",
    solution: "工具数量超过上下文 10% 时自动启用延迟加载。系统 prompt 只放工具名目录，模型通过 ToolSearchTool 按需搜索完整 schema。模糊匹配 + 加权评分（名称 10-12 分，描述 2 分），跨 turn 追踪已发现工具避免重复搜索。",
    code: `// 内置工具默认不延迟（除非 shouldDefer: true）
// MCP 工具默认全部延迟（数量不可控）
if (toolTokens > contextWindow * 0.1) {
  enableDeferredLoading()
  // System prompt 只写: "AgentTool, BashTool, ..."
  // 模型需要时: ToolSearchTool("file editing")
  // → 返回 FileEditTool 完整 schema
}`,
  },
  {
    num: "#2",
    title: "Prompt Cache 边界",
    subtitle: "SYSTEM_PROMPT_DYNAMIC_BOUNDARY",
    color: "blue" as const,
    problem: "每次 API 调用都发送完整系统 prompt，token 成本和延迟都很高",
    solution: "用 __DYNAMIC_BOUNDARY__ 标记把 prompt 分成两半。边界之前是所有用户共享的内容（身份+行为准则），可做全局 prompt cache。边界之后是每个用户不同的内容（工具+MCP+设置），每次重新编码。工具排序策略保证内置工具作为连续前缀，MCP 变化不破坏缓存。",
    code: `// constants/prompts.ts
export const SYSTEM_PROMPT_DYNAMIC_BOUNDARY =
  '__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__'

// assembleToolPool() 排序策略：
// 1. 内置工具按名称排序 → 作为连续前缀
// 2. MCP 工具按名称排序 → 附加在后面
// 3. uniqBy('name') → 名称冲突时内置优先
// → MCP 增减不打乱内置工具排序 → 缓存稳定`,
  },
  {
    num: "#3",
    title: "Feature Flag 编译时裁剪",
    subtitle: "bun:bundle · 95 个 Feature Flags",
    color: "orange" as const,
    problem: "内部版本有很多实验功能（语音、主动模式、多 agent 协调），不应出现在公开版本中",
    solution: "Bun 的 feature() 在编译时决定代码是否存在 — 不是运行时不执行，是从二进制里完全删除。95 个 flag 控制功能灰度发布。不同构建版本有不同的功能集。比运行时 flag 更安全（代码不存在）且更小（包体积）。",
    code: `import { feature } from 'bun:bundle'

// VOICE_MODE = false 时，下面代码从二进制完全删除
const voiceCmd = feature('VOICE_MODE')
  ? require('./voice/index.js')  // 编译时包含
  : null                         // 编译时删除

// 95 个 Flag 示例：
// KAIROS — 常驻助手模式（推送/频道/webhook）
// COORDINATOR_MODE — 多 Agent 协调器
// PROACTIVE — 主动执行模式
// TRANSCRIPT_CLASSIFIER — AI 权限分类器`,
  },
  {
    num: "#4",
    title: "权限的 AI 分类器",
    subtitle: "非阻塞并行设计",
    color: "purple" as const,
    problem: "每次工具调用都弹权限确认框，用户体验差；但全部自动放行又不安全",
    solution: "TRANSCRIPT_CLASSIFIER：两阶段异步分类（fast + thinking）。BASH_CLASSIFIER：bash 命令专用安全分析。关键设计是非阻塞并行 — 分类器和用户提示框同时启动，分类器判定安全就自动通过，用户无需点击。",
    code: `// 模型请求 tool_use
// ├── 同时启动 AI 分类器（后台异步）
// └── 同时弹出用户权限对话框
//
// → 分类器先返回 "安全" → 自动通过
// → 分类器返回 "不确定" → 等用户确认
// → 分类器返回 "危险" → 自动拒绝`,
  },
  {
    num: "#5",
    title: "系统 Prompt 行为校准",
    subtitle: "不是教模型写代码，是校准行为空间",
    color: "red" as const,
    problem: "模型越强，教它怎么做的 prompt 越不需要。但完全不给 prompt 又会导致行为不可预测",
    solution: "Claude Code 的 prompt 做的是行为校准，不是能力教学：定义安全边界、设定工具使用偏好、给模型信心、鼓励主动判断。914 行 prompts.ts 不写 how-to，写 boundary + preference。",
    code: `// 安全边界
"NEVER generate URLs unless confident..."

// 工具偏好
"Do NOT use Bash when a dedicated tool exists"

// 给予信心
"You are highly capable and often allow users
 to complete ambitious tasks..."

// 鼓励判断
"If you notice the user's request is based on
 a misconception, say so."`,
  },
];

export function Part3Section() {
  return (
    <section className="py-20 md:py-32 border-t border-border" id="claude-code">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <SectionHeader
          tag="PART 3"
          title="Claude Code 源码深度剖析"
          subtitle="2026.03.31 源码泄露事件，让我们得以窥见顶级 Harness 的内部设计"
        />

        {/* Leak event overview */}
        <RevealSection className="mb-16">
          <AccentCard side="left" color="red" className="mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-accent-red font-mono text-sm font-bold">2026.03.31</span>
              <span className="text-text-muted text-sm">npm 包的 .map 文件暴露了完整 TypeScript 源码</span>
            </div>
            <p className="text-text-secondary text-sm">
              指向 Anthropic R2 存储桶中的未混淆源文件，~1,900 个文件，512,000+ 行代码
            </p>
          </AccentCard>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "~1,900", label: "TypeScript 文件", color: "text-accent" },
              { value: "512K+", label: "行代码", color: "text-accent-purple" },
              { value: "42", label: "工具实现", color: "text-accent-orange" },
              { value: "87", label: "Slash 命令", color: "text-accent-green" },
            ].map((stat, i) => (
              <StaggerItem key={i}>
                <div className="bg-bg-card rounded-xl border border-border p-4 text-center">
                  <div className={`text-2xl md:text-3xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
                  <div className="text-text-muted text-xs mt-1">{stat.label}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </RevealSection>

        {/* Five-layer architecture */}
        <RevealSection className="mb-16">
          <h3 className="text-xl font-bold mb-6">五层架构</h3>
          <div className="space-y-2">
            {[
              { name: "入口层", files: "main.tsx, entrypoints/", desc: "CLI 解析、初始化、启动", color: "text-text-muted" },
              { name: "编排层", files: "QueryEngine.ts, query.ts", desc: "会话管理、循环控制 — 核心心脏", color: "text-accent" },
              { name: "提示层", files: "constants/prompts.ts", desc: "系统 Prompt 动态组装 — 914 行构建器", color: "text-accent-purple" },
              { name: "执行层", files: "tools.ts, Tool.ts, tools/", desc: "工具注册、权限检查、调度执行", color: "text-accent-orange" },
              { name: "连接层", files: "bridge/, server/", desc: "IDE 桥接、远程执行、多端适配", color: "text-accent-green" },
            ].map((layer, i) => (
              <div key={i} className="bg-bg-card rounded-lg border border-border p-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                <span className={`font-bold shrink-0 w-16 ${layer.color}`}>{layer.name}</span>
                <code className="font-mono text-xs text-text-primary shrink-0">{layer.files}</code>
                <span className="text-text-secondary text-sm">{layer.desc}</span>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* 5 Designs */}
        <div className="space-y-12">
          {designs.map((d, i) => (
            <RevealSection key={i}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-sm font-mono font-bold text-accent-${d.color}`}>{d.num}</span>
                <h3 className="text-xl md:text-2xl font-bold">{d.title}</h3>
                <span className="text-text-muted text-xs font-mono hidden md:inline">{d.subtitle}</span>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <AccentCard side="left" color="red">
                    <h4 className="text-xs font-mono text-accent-red mb-2">PROBLEM</h4>
                    <p className="text-text-secondary text-sm leading-relaxed">{d.problem}</p>
                  </AccentCard>
                  <AccentCard side="left" color="green">
                    <h4 className="text-xs font-mono text-accent-green mb-2">SOLUTION</h4>
                    <p className="text-text-secondary text-sm leading-relaxed">{d.solution}</p>
                  </AccentCard>
                </div>
                <CodeBlock title={`design-${d.num.replace("#", "")}.ts`}>
                  {d.code}
                </CodeBlock>
              </div>
            </RevealSection>
          ))}
        </div>

        {/* Token Economics */}
        <RevealSection className="mt-16 mb-16">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">Token 都烧在哪了？</h3>
          <p className="text-text-secondary text-sm mb-8">每次 API 调用的 Token 分布与成本结构</p>

          {/* Token distribution */}
          <StaggerContainer className="grid md:grid-cols-2 gap-5 mb-8">
            <StaggerItem>
              <div className="bg-bg-card rounded-xl border border-border p-6">
                <h4 className="text-sm font-mono text-accent mb-4">TOKEN 分布</h4>
                <div className="space-y-4">
                  {[
                    { label: "系统 Prompt（身份+行为）", tokens: "~2,500", pct: 13, color: "bg-accent" },
                    { label: "工具定义（42 个 Schema）", tokens: "14,000-17,000", pct: 85, color: "bg-accent-orange" },
                    { label: "CLAUDE.md / 记忆", tokens: "~500-2,000", pct: 10, color: "bg-accent-purple" },
                    { label: "对话历史", tokens: "累积增长", pct: 60, color: "bg-accent-green" },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-text-secondary">{item.label}</span>
                        <span className="font-mono text-text-primary">{item.tokens}</span>
                      </div>
                      <div className="h-2 bg-border rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full opacity-60`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-border">
                  <p className="text-xs text-accent-red font-medium">
                    真正的成本大户：工具定义占系统 prompt 的 85%+
                  </p>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-bg-card rounded-xl border border-border p-6">
                <h4 className="text-sm font-mono text-accent-orange mb-4">成本是乘法，不是加法</h4>
                <p className="text-text-muted text-xs mb-3">每轮对话都要重传全部历史 — 成本几何级增长</p>
                <div className="space-y-1.5">
                  {[
                    { round: "第 1 轮", input: "~20K", cumul: "~2万", intensity: "10" },
                    { round: "第 3 轮", input: "~40K", cumul: "~10万", intensity: "30" },
                    { round: "第 5 轮", input: "~60K", cumul: "~26万", intensity: "50" },
                    { round: "第 8 轮", input: "~90K", cumul: "~55万", intensity: "70" },
                    { round: "第 10 轮", input: "~110K", cumul: "~75万", intensity: "90" },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-3 text-sm py-1.5 border-b border-border/50 last:border-0">
                      <span className="font-mono text-text-primary">{row.round}</span>
                      <span className="font-mono text-text-secondary">{row.input}</span>
                      <span className="font-mono text-accent-red">{row.cumul}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-border">
                  <p className="text-xs text-accent font-medium">
                    Auto-Compact：上下文达 ~83%（167K）时自动压缩
                  </p>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Cache boundary + tips */}
          <div className="grid md:grid-cols-2 gap-5">
            <AccentCard side="top" color="green">
              <h4 className="text-sm font-mono text-accent-green mb-2">DYNAMIC_BOUNDARY 之上 — 可缓存 (10% 价格)</h4>
              <ul className="space-y-1 text-sm text-text-secondary">
                <li>身份定义 + 行为准则 + 能力声明</li>
                <li>所有用户共享 → 全局 Prompt Cache</li>
                <li>工具排序策略保证缓存稳定性</li>
              </ul>
            </AccentCard>
            <AccentCard side="top" color="red">
              <h4 className="text-sm font-mono text-accent-red mb-2">DYNAMIC_BOUNDARY 之下 — 全价</h4>
              <ul className="space-y-1 text-sm text-text-secondary">
                <li>工具定义（14K-17K tokens）</li>
                <li>CLAUDE.md 内容 — 每轮全价计费</li>
                <li>用户设置 / 记忆 / MCP 工具</li>
              </ul>
            </AccentCard>
          </div>

          {/* Cost saving tips */}
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[
              { tip: "精简 CLAUDE.md", detail: "< 50 行，位于全价区", color: "text-accent" },
              { tip: "任务间 /clear", detail: "切断乘法累积效应", color: "text-accent-green" },
              { tip: "禁用闲置 MCP", detail: "每个工具 200-500 tokens", color: "text-accent-orange" },
              { tip: "主动 /compact", detail: "别等自动触发", color: "text-accent-purple" },
            ].map((t, i) => (
              <StaggerItem key={i}>
                <div className="bg-bg-card rounded-lg border border-border p-4">
                  <div className={`text-sm font-bold ${t.color} mb-1`}>{t.tip}</div>
                  <div className="text-xs text-text-muted">{t.detail}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </RevealSection>

        {/* What leaked vs not */}
        <RevealSection className="mt-16">
          <div className="grid md:grid-cols-2 gap-5">
            <AccentCard side="top" color="green">
              <h4 className="text-sm font-mono text-accent-green mb-3">LEAKED (CLIENT-SIDE)</h4>
              <ul className="space-y-1.5 text-sm text-text-secondary">
                {["完整 CLI 编排引擎 (QueryEngine)", "42 个工具实现", "系统 Prompt 动态构建器 (914 行)", "权限系统 (12,000 行)", "Agent/Team/Fork 机制", "Bridge 系统 (33 文件)", "MCP 客户端集成", "95 个 Feature Flag"].map((item, i) => (
                  <li key={i} className="flex gap-2"><span className="text-accent-green">+</span> {item}</li>
                ))}
              </ul>
            </AccentCard>
            <AccentCard side="top" color="red">
              <h4 className="text-sm font-mono text-accent-red mb-3">NOT LEAKED (SERVER-SIDE)</h4>
              <ul className="space-y-1.5 text-sm text-text-secondary">
                {["模型推理服务 (serving infrastructure)", "CCR 远程执行器 (Cloud Runtime)", "OAuth Server (认证服务端)", "安全分类器 (harm/jailbreak/PII)", "限流 & 计费系统", "Prompt Cache 服务端", "MCP Proxy 实现", "Session 持久化层"].map((item, i) => (
                  <li key={i} className="flex gap-2"><span className="text-accent-red">&minus;</span> {item}</li>
                ))}
              </ul>
            </AccentCard>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
