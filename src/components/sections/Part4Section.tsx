"use client";
import { RevealSection, StaggerContainer, StaggerItem } from "../motion/RevealSection";
import { SectionHeader } from "../ui/SectionHeader";
import { AccentCard } from "../ui/Card";

export function Part4Section() {
  return (
    <section className="py-20 md:py-32 border-t border-border" id="future">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <SectionHeader
          tag="PART 4"
          title="Harness 的未来"
          subtitle="模型越强，Harness 的角色会怎么变？"
        />

        {/* Trend 1: Migration */}
        <RevealSection className="mb-16">
          <h3 className="text-xl font-bold mb-6">趋势 #1 — Harness 能力向模型迁移</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <AccentCard side="top" color="orange">
              <h4 className="text-sm font-mono text-accent-orange mb-4">WILL MIGRATE &darr;</h4>
              <ul className="space-y-3 text-sm">
                {[
                  ["工具选择优化", "模型原生理解工具"],
                  ["上下文压缩", "无限上下文窗口"],
                  ["记忆管理", "模型原生持久记忆"],
                  ["子 Agent 派生", "模型原生多线程"],
                  ["输出格式控制", "模型自判合适格式"],
                ].map(([from, to], i) => (
                  <li key={i} className="text-text-secondary">
                    <span className="text-text-primary">{from}</span>
                    <span className="text-text-muted mx-2">&rarr;</span>
                    <span className="text-accent-orange">{to}</span>
                  </li>
                ))}
              </ul>
            </AccentCard>
            <AccentCard side="top" color="green">
              <h4 className="text-sm font-mono text-accent-green mb-4">WON&apos;T MIGRATE &check;</h4>
              <ul className="space-y-3 text-sm">
                {[
                  ["安全权限层", "越强的模型越需要"],
                  ["API 编排循环", "物理架构约束"],
                  ["工具执行接口", "模型不能直接操作 OS"],
                  ["环境配置", "模型感知不到外部信息"],
                  ["Prompt Caching", "基础设施优化"],
                ].map(([what, why], i) => (
                  <li key={i} className="text-text-secondary">
                    <span className="text-text-primary">{what}</span>
                    <span className="text-text-muted mx-2">&mdash;</span>
                    <span className="text-accent-green">{why}</span>
                  </li>
                ))}
              </ul>
            </AccentCard>
          </div>
        </RevealSection>

        {/* Trend 2: Instruction to Configuration */}
        <RevealSection className="mb-16">
          <h3 className="text-xl font-bold mb-6">趋势 #2 — 从 Instruction 到 Configuration</h3>
          <StaggerContainer className="grid md:grid-cols-3 gap-5">
            {[
              {
                era: "2023-2024",
                name: "Prompt Engineering",
                desc: "教模型怎么做。手把手写 instruction。\"请一步步思考\"",
                color: "text-text-muted",
              },
              {
                era: "2025",
                name: "Harness Engineering",
                desc: "定义模型的操作空间。工具 + 规则 + 边界。半自主运作",
                color: "text-accent",
              },
              {
                era: "2026+",
                name: "Model Configuration",
                desc: "声明式配置模型行为。模型理解意图。全自主（在边界内）",
                color: "text-accent-green",
              },
            ].map((era, i) => (
              <StaggerItem key={i}>
                <div className="bg-bg-card rounded-xl border border-border p-6 h-full text-center">
                  <span className="font-mono text-xs text-text-muted">{era.era}</span>
                  <h4 className={`text-lg font-bold mt-2 mb-3 ${era.color}`}>{era.name}</h4>
                  <p className="text-text-secondary text-sm leading-relaxed">{era.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <div className="mt-5">
            <AccentCard side="left" color="blue">
              <p className="text-text-secondary text-sm">
                类比软件工程的演进：<span className="text-text-primary">手写汇编 → 高级语言 → 声明式配置 (Terraform/K8s) → 意图驱动</span>
              </p>
            </AccentCard>
          </div>
        </RevealSection>

        {/* Trend 3: Competition */}
        <RevealSection>
          <h3 className="text-xl font-bold mb-6">趋势 #3 — 三个竞争维度</h3>
          <StaggerContainer className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: "模型能力竞争",
                players: "OpenAI vs Anthropic vs Google vs Meta",
                trend: "短期差异大，长期趋于收敛",
                color: "purple" as const,
              },
              {
                name: "Harness 架构竞争",
                players: "Claude Code vs Cursor vs 开源 vs 自研",
                trend: "差异持续扩大，成为核心壁垒",
                color: "blue" as const,
              },
              {
                name: "生态/工具竞争",
                players: "MCP vs OpenAI Tools vs 自定义协议",
                trend: "标准化趋势，MCP 领先",
                color: "green" as const,
              },
            ].map((dim, i) => (
              <StaggerItem key={i}>
                <AccentCard side="top" color={dim.color} className="h-full text-center">
                  <h4 className={`text-lg font-bold mb-3 text-accent-${dim.color}`}>{dim.name}</h4>
                  <p className="text-text-secondary text-sm mb-4">{dim.players}</p>
                  <div className={`text-xs font-mono text-accent-${dim.color} italic`}>{dim.trend}</div>
                </AccentCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="mt-6">
            <AccentCard side="left" color="blue">
              <p className="text-accent text-sm italic">
                模型能力收敛后，Harness 的差异化将成为产品竞争力的核心 &mdash; 这就是 Harness Engineering 的战略意义
              </p>
            </AccentCard>
          </div>
        </RevealSection>

        {/* Competitive Landscape */}
        <RevealSection className="mt-16 mb-16">
          <h3 className="text-xl font-bold mb-6">竞品分析 — Harness 实现对比</h3>
          <p className="text-text-secondary text-sm mb-8">
            不同产品的 Harness 实现差异巨大，这直接决定了用户体验和任务完成率。
          </p>
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                name: "Claude Code",
                color: "blue" as const,
                highlight: true,
                features: [
                  { label: "核心循环", value: "Async Generator" },
                  { label: "工具数量", value: "42+ built-in" },
                  { label: "权限系统", value: "12,000行 AI分类器" },
                  { label: "记忆系统", value: "3层 (CLAUDE.md + MEMORY + auto)" },
                  { label: "Prompt Cache", value: "DYNAMIC_BOUNDARY" },
                  { label: "Multi-Agent", value: "Sub + Team + Fork" },
                  { label: "上下文管理", value: "4策略 + auto-compact" },
                  { label: "工具延迟加载", value: "ToolSearchTool" },
                ],
              },
              {
                name: "Cursor",
                color: "purple" as const,
                highlight: false,
                features: [
                  { label: "核心循环", value: "未公开" },
                  { label: "工具数量", value: "~20" },
                  { label: "权限系统", value: "基础规则" },
                  { label: "记忆系统", value: "项目索引" },
                  { label: "Prompt Cache", value: "未公开" },
                  { label: "Multi-Agent", value: "无" },
                  { label: "上下文管理", value: "基础截断" },
                  { label: "工具延迟加载", value: "无" },
                ],
              },
              {
                name: "Windsurf",
                color: "green" as const,
                highlight: false,
                features: [
                  { label: "核心循环", value: "未公开" },
                  { label: "工具数量", value: "~15" },
                  { label: "权限系统", value: "基础规则" },
                  { label: "记忆系统", value: "项目索引" },
                  { label: "Prompt Cache", value: "未公开" },
                  { label: "Multi-Agent", value: "无" },
                  { label: "上下文管理", value: "基础截断" },
                  { label: "工具延迟加载", value: "无" },
                ],
              },
              {
                name: "开源 (ReAct)",
                color: "orange" as const,
                highlight: false,
                features: [
                  { label: "核心循环", value: "ReAct" },
                  { label: "工具数量", value: "~10" },
                  { label: "权限系统", value: "无" },
                  { label: "记忆系统", value: "无" },
                  { label: "Prompt Cache", value: "无" },
                  { label: "Multi-Agent", value: "无" },
                  { label: "上下文管理", value: "无" },
                  { label: "工具延迟加载", value: "无" },
                ],
              },
            ].map((product, i) => (
              <StaggerItem key={i}>
                <AccentCard side="top" color={product.color} className={`h-full ${product.highlight ? "ring-1 ring-accent/30" : ""}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={`font-bold text-accent-${product.color}`}>{product.name}</h4>
                    {product.highlight && (
                      <span className="text-[10px] font-mono bg-accent/20 text-accent px-1.5 py-0.5 rounded">BENCHMARK</span>
                    )}
                  </div>
                  <ul className="space-y-2.5">
                    {product.features.map((feat, j) => (
                      <li key={j}>
                        <div className="text-text-muted text-[10px] font-mono uppercase">{feat.label}</div>
                        <div className={`text-sm ${feat.value === "无" || feat.value === "未公开" ? "text-text-muted" : "text-text-primary"}`}>
                          {feat.value}
                        </div>
                      </li>
                    ))}
                  </ul>
                </AccentCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <div className="mt-5">
            <AccentCard side="left" color="blue">
              <p className="text-text-secondary text-sm">
                <span className="text-accent font-semibold">关键洞察：</span>
                Claude Code 的领先不只是模型优势 — 而是 Harness 工程的全面领先：权限系统复杂度高出一个量级，
                记忆系统多两层，上下文管理策略多三种，且是唯一实现了 Multi-Agent 和工具延迟加载的产品。
              </p>
            </AccentCard>
          </div>
        </RevealSection>

        {/* Practical Advice */}
        <RevealSection className="mb-16">
          <h3 className="text-xl font-bold mb-6">给开发者的建议</h3>
          <p className="text-text-secondary text-sm mb-8">
            如果你正在构建自己的 Harness，以下是从 Claude Code 源码中提炼出的 6 条实战建议。
          </p>
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                num: "01",
                title: "先搞清楚 Loop",
                desc: "80% 的 bug 出在循环控制。搞清楚你的 while(true) 什么时候该跳出、工具报错时怎么回退、上下文溢出时怎么压缩。",
                priority: "critical",
                color: "red" as const,
              },
              {
                num: "02",
                title: "系统 Prompt 做减法",
                desc: "校准行为空间，别教模型写代码。模型已经会写代码了，System Prompt 的作用是告诉它「什么不该做」和「怎么做才符合场景」。",
                priority: "high",
                color: "orange" as const,
              },
              {
                num: "03",
                title: "权限不能是 Tool",
                desc: "安全关键逻辑必须在 Harness 层强制执行，不能靠模型「调用一个权限检查工具」。模型可以选择不调用工具，但不能绕过 Harness 层代码。",
                priority: "critical",
                color: "red" as const,
              },
              {
                num: "04",
                title: "工具数量要克制",
                desc: "每个工具描述占 200-500 tokens，10 个工具就是 5K tokens。Claude Code 用 ToolSearchTool 实现延迟加载，只在需要时加载。",
                priority: "high",
                color: "blue" as const,
              },
              {
                num: "05",
                title: "Cache 意识",
                desc: "把不变的内容放前面（System Prompt、工具定义），可变的放后面（对话历史）。这样 Prompt Caching 命中率最高，成本降 90%。",
                priority: "medium",
                color: "green" as const,
              },
              {
                num: "06",
                title: "从 Claude Code 学设计",
                desc: "读源码比读论文有用 10 倍。Claude Code 的核心循环、权限系统、记忆管理都是开源的，是目前最好的 Harness Engineering 教材。",
                priority: "high",
                color: "purple" as const,
              },
            ].map((tip, i) => (
              <StaggerItem key={i}>
                <AccentCard side="left" color={tip.color} className="h-full">
                  <div className="flex items-start gap-3">
                    <span className={`text-2xl font-black font-mono text-accent-${tip.color}/30`}>{tip.num}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="font-bold text-sm text-text-primary">{tip.title}</h4>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          tip.priority === "critical"
                            ? "bg-accent-red/10 text-accent-red"
                            : tip.priority === "high"
                            ? "bg-accent-orange/10 text-accent-orange"
                            : "bg-accent-green/10 text-accent-green"
                        }`}>
                          {tip.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-text-secondary text-xs leading-relaxed">{tip.desc}</p>
                    </div>
                  </div>
                </AccentCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </RevealSection>

        {/* Architecture Checklist */}
        <RevealSection>
          <h3 className="text-xl font-bold mb-6">Harness 架构 Checklist</h3>
          <p className="text-text-secondary text-sm mb-8">
            用这份清单评估你的 Harness 架构成熟度。覆盖 6 项以上说明已经达到产品级水准。
          </p>
          <StaggerContainer className="grid md:grid-cols-2 gap-4">
            {[
              {
                check: "核心循环是否支持工具调用 + 结果回注？",
                why: "这是 Harness 的最基本能力，没有这个就只是 chatbot",
                color: "blue" as const,
              },
              {
                check: "系统 Prompt 是否分离静态/动态部分？",
                why: "静态部分可被缓存，动态部分每次重建 — 影响成本和延迟",
                color: "blue" as const,
              },
              {
                check: "是否有独立的权限层（不依赖模型调用）？",
                why: "权限必须是 Harness 代码强制执行，不能是可选的工具调用",
                color: "red" as const,
              },
              {
                check: "工具数量超过 20 个时是否有延迟加载？",
                why: "每个工具占 200-500 tokens，全部加载会浪费上下文窗口",
                color: "orange" as const,
              },
              {
                check: "是否有上下文压缩策略？",
                why: "长对话会溢出上下文窗口，需要 auto-compact 或摘要策略",
                color: "green" as const,
              },
              {
                check: "记忆是否持久化？",
                why: "跨会话的项目知识、用户偏好需要持久化存储，不能每次从零开始",
                color: "green" as const,
              },
              {
                check: "是否考虑了 Prompt Caching？",
                why: "合理的缓存策略可以降低 90% 的 token 成本",
                color: "purple" as const,
              },
              {
                check: "是否支持多 Agent 协调？",
                why: "复杂任务需要拆分给子 Agent 并行执行，再汇总结果",
                color: "purple" as const,
              },
            ].map((item, i) => (
              <StaggerItem key={i}>
                <AccentCard side="left" color={item.color} className="h-full">
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 shrink-0 mt-0.5 rounded border-2 border-accent-${item.color}/50 flex items-center justify-center`}>
                      <span className="text-[10px] text-text-muted font-mono">{i + 1}</span>
                    </div>
                    <div>
                      <p className="text-text-primary text-sm font-medium">{item.check}</p>
                      <p className="text-text-muted text-xs mt-1">{item.why}</p>
                    </div>
                  </div>
                </AccentCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <div className="mt-6">
            <AccentCard side="left" color="green">
              <p className="text-text-secondary text-sm">
                <span className="text-accent-green font-semibold">评估标准：</span>
                覆盖 1-3 项 = 原型级 &nbsp;|&nbsp; 4-5 项 = 框架级 &nbsp;|&nbsp; 6-7 项 = 产品级 &nbsp;|&nbsp; 8 项全覆盖 = Claude Code 级
              </p>
            </AccentCard>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
