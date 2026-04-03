"use client";
import { RevealSection, StaggerContainer, StaggerItem } from "../motion/RevealSection";
import { SectionHeader } from "../ui/SectionHeader";
import { AccentCard } from "../ui/Card";
import { CodeBlock } from "../ui/CodeBlock";

const minimalHarnessCode = `async function* harness(userMessage: string) {
  const messages = [{ role: "user", content: userMessage }];
  const systemPrompt = buildSystemPrompt();

  while (true) {
    const response = await callAPI({ system: systemPrompt, messages });

    for (const block of response.content) {
      if (block.type === "text") {
        yield { type: "text", content: block.text };
      }
      if (block.type === "tool_use") {
        // HARNESS controls permission, not model
        if (!checkPermission(block)) {
          messages.push({ role: "assistant", content: response.content });
          messages.push({ role: "user", content: [
            { type: "tool_result", tool_use_id: block.id, content: "Permission denied" }
          ] });
          continue;
        }
        const result = await executeTool(block.name, block.input);
        messages.push({ role: "assistant", content: response.content });
        messages.push({ role: "user", content: [
            { type: "tool_result", tool_use_id: block.id, content: result }
        ] });
      }
    }

    if (response.stop_reason === "end_turn") break;
  }
}`;

const designPrinciples = [
  {
    num: "01",
    title: "循环控制权在 Harness",
    explanation: "模型只输出 tool_use 或 end_turn，Harness 决定是否继续。模型永远不能自己决定\"再跑一轮\"。",
    implication: "你的 while 循环就是产品的生命线 — 如果模型失控，break 就行。",
    color: "blue" as const,
  },
  {
    num: "02",
    title: "安全是 Harness 的事",
    explanation: "权限检查在工具执行前强制拦截，不能交给模型\"自觉\"。模型会说\"我保证安全\"— 不要信。",
    implication: "每次 executeTool 前必须过 checkPermission，没有例外。",
    color: "red" as const,
  },
  {
    num: "03",
    title: "Prompt 做减法",
    explanation: "914 行 prompts.ts 不写 how-to，写 boundary + preference。告诉模型\"不要做什么\"比\"怎么做\"更有效。",
    implication: "删掉你 Prompt 里所有的步骤说明，换成行为边界。",
    color: "purple" as const,
  },
  {
    num: "04",
    title: "工具要分层",
    explanation: "原子工具 → 元工具 → MCP → Feature-gated，按需加载。不是一次性把 50 个工具全塞进去。",
    implication: "工具数量是上下文成本 — 每多一个工具定义就多消耗 token。",
    color: "green" as const,
  },
  {
    num: "05",
    title: "缓存意识",
    explanation: "DYNAMIC_BOUNDARY 把 Prompt 分成 10% 价格区和全价区。静态内容放前面缓存，动态内容放后面。",
    implication: "一个缓存分隔符可以省 90% 的 Prompt 成本。",
    color: "orange" as const,
  },
  {
    num: "06",
    title: "上下文是最贵的资源",
    explanation: "对话成本是乘法不是加法 — 每一轮对话都要重发整个历史。10 轮对话 = 10 次全量输入。",
    implication: "主动 compact 上下文，比优化模型选择省更多钱。",
    color: "blue" as const,
  },
  {
    num: "07",
    title: "模型选择按任务",
    explanation: "搜索用 Haiku（快 + 便宜），编码用 Opus（准）。不是所有任务都需要最强模型。",
    implication: "一个 router 函数可以让你的成本降 60%，同时提升速度。",
    color: "green" as const,
  },
];

const levels = [
  { level: 0, name: "裸 API 调用", desc: "一问一答，最基础的集成", complexity: "~20 行" },
  { level: 1, name: "+ 工具循环", desc: "ReAct pattern，模型能使用工具", complexity: "~50 行" },
  { level: 2, name: "+ 系统 Prompt 分层", desc: "行为校准，定义模型人格和边界", complexity: "~100 行" },
  { level: 3, name: "+ 权限系统", desc: "安全边界，拦截危险操作", complexity: "~200 行" },
  { level: 4, name: "+ 上下文管理", desc: "Compact / 压缩，控制成本", complexity: "~400 行" },
  { level: 5, name: "+ 记忆系统", desc: "跨会话持久化，CLAUDE.md 模式", complexity: "~600 行" },
  { level: 6, name: "+ Prompt Caching", desc: "成本优化，静态/动态分区", complexity: "~800 行" },
  { level: 7, name: "+ Multi-Agent", desc: "任务分发协调，子 Agent 派生", complexity: "~1500 行" },
  { level: 8, name: "+ AI 分类器", desc: "智能权限判断，Claude Code 级别", complexity: "~3000+ 行" },
];

const openSourceOpportunities = [
  {
    area: "记忆系统",
    weakness: "无向量检索，纯文本 CLAUDE.md",
    opportunity: "加 embedding + RAG，语义搜索历史上下文",
    color: "purple" as const,
  },
  {
    area: "安全层",
    weakness: "硬编码规则多，不够灵活",
    opportunity: "可配置的安全策略引擎，声明式权限规则",
    color: "red" as const,
  },
  {
    area: "上下文优化",
    weakness: "基础压缩，简单截断",
    opportunity: "更智能的选择性保留，重要信息优先级",
    color: "blue" as const,
  },
  {
    area: "工具生态",
    weakness: "MCP 标准还在早期",
    opportunity: "更好的工具市场、工具发现、版本管理",
    color: "green" as const,
  },
  {
    area: "监控 / 可观测性",
    weakness: "几乎没有内置监控",
    opportunity: "token 消耗分析、决策追踪、成本仪表盘",
    color: "orange" as const,
  },
];

export function Part5Section() {
  return (
    <section className="py-20 md:py-32 border-t border-border" id="practice">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <SectionHeader
          tag="PART 5"
          title="实战：构建你自己的 Harness"
          subtitle="从 Claude Code 的架构中提取可复用的模式，从零开始构建一个产品级 Harness"
        />

        {/* 1. Minimum Viable Harness */}
        <RevealSection className="mb-20">
          <h3 className="text-xl md:text-2xl font-bold mb-3">最小可行 Harness</h3>
          <p className="text-text-secondary text-sm mb-6 max-w-[65ch]">
            一个能跑起来的 Harness 只需要四个要素：API 循环、工具执行、权限检查、系统 Prompt。
          </p>

          {/* Core architecture cards */}
          <StaggerContainer className="grid md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: "⟳", label: "Core Loop", desc: "while → call API → check tool_use → execute → loop" },
              { icon: "📋", label: "System Prompt", desc: "定义边界和偏好，不写操作步骤" },
              { icon: "🔧", label: "Essential Tools", desc: "file_read, file_write, bash, search" },
              { icon: "🛡", label: "Permission Check", desc: "executeTool 前强制拦截" },
            ].map((item, i) => (
              <StaggerItem key={i}>
                <div className="bg-bg-card rounded-xl border border-border p-5 h-full text-center">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h4 className="text-sm font-mono text-accent mb-2">{item.label}</h4>
                  <p className="text-text-secondary text-xs leading-relaxed">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Code block */}
          <CodeBlock title="minimal-harness.ts — 完整的最小可行 Harness 循环">
            {minimalHarnessCode}
          </CodeBlock>

          <div className="mt-4">
            <AccentCard side="left" color="blue">
              <p className="text-text-secondary text-sm">
                <span className="text-accent font-mono text-xs">核心洞察</span>
                <span className="text-text-muted mx-2">&mdash;</span>
                这 30 行代码就是 Claude Code 的骨架。剩下的 3000+ 行都是在这个循环上做增强：
                安全、缓存、上下文管理、记忆、多 Agent。
              </p>
            </AccentCard>
          </div>
        </RevealSection>

        {/* 2. Seven Design Principles */}
        <RevealSection className="mb-20">
          <h3 className="text-xl md:text-2xl font-bold mb-3">从 Claude Code 学到的 7 个设计原则</h3>
          <p className="text-text-secondary text-sm mb-8 max-w-[65ch]">
            逆向工程 Claude Code 源码后提炼出的核心设计哲学，每一条都有对应的实现证据。
          </p>

          <StaggerContainer className="grid md:grid-cols-2 gap-5">
            {designPrinciples.map((p, i) => (
              <StaggerItem key={i}>
                <AccentCard side="left" color={p.color} className="h-full">
                  <div className="flex items-start gap-4">
                    <span className={`text-2xl font-mono font-bold text-accent-${p.color} opacity-40 shrink-0`}>
                      {p.num}
                    </span>
                    <div>
                      <h4 className="text-base font-bold mb-2">{p.title}</h4>
                      <p className="text-text-secondary text-sm leading-relaxed mb-3">
                        {p.explanation}
                      </p>
                      <div className="flex items-start gap-2">
                        <span className={`text-accent-${p.color} text-xs font-mono shrink-0 mt-0.5`}>→</span>
                        <p className={`text-accent-${p.color} text-xs italic`}>
                          {p.implication}
                        </p>
                      </div>
                    </div>
                  </div>
                </AccentCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </RevealSection>

        {/* 3. Progressive Enhancement */}
        <RevealSection className="mb-20">
          <h3 className="text-xl md:text-2xl font-bold mb-3">逐步升级路径</h3>
          <p className="text-text-secondary text-sm mb-8 max-w-[65ch]">
            不要一步到位。从最简单的 API 调用开始，逐步添加能力层，每一层都是可独立运行的。
          </p>

          <div className="relative">
            {/* Vertical connecting line */}
            <div className="absolute left-[23px] md:left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-accent/60 via-accent-green/40 to-accent-purple/60" />

            <StaggerContainer className="space-y-3">
              {levels.map((lvl, i) => {
                const isHighlight = lvl.level === 1 || lvl.level === 8;
                const progressPct = (lvl.level / 8) * 100;
                // Color transitions from blue to green to purple
                const dotColor =
                  lvl.level <= 2
                    ? "bg-accent"
                    : lvl.level <= 5
                    ? "bg-accent-green"
                    : "bg-accent-purple";

                return (
                  <StaggerItem key={i}>
                    <div className={`flex items-start gap-4 md:gap-6 group ${isHighlight ? "" : ""}`}>
                      {/* Level dot */}
                      <div className="relative z-10 shrink-0">
                        <div
                          className={`w-[14px] h-[14px] md:w-[18px] md:h-[18px] rounded-full ${dotColor} mt-1.5 ring-4 ring-bg transition-transform group-hover:scale-125`}
                        />
                      </div>

                      {/* Content */}
                      <div
                        className={`flex-1 rounded-xl border p-4 md:p-5 transition-colors ${
                          isHighlight
                            ? "bg-accent/10 border-accent/30"
                            : "bg-bg-card border-border hover:border-border/80"
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs text-text-muted w-12 shrink-0">
                              Lv.{lvl.level}
                            </span>
                            <h4 className={`text-sm font-bold ${isHighlight ? "text-accent" : "text-text-primary"}`}>
                              {lvl.name}
                            </h4>
                          </div>
                          <span className="font-mono text-xs text-text-muted">{lvl.complexity}</span>
                        </div>
                        <p className="text-text-secondary text-xs mt-1 ml-[60px] md:ml-[60px]">{lvl.desc}</p>

                        {/* Complexity bar */}
                        <div className="ml-[60px] mt-2">
                          <div className="h-1 bg-border rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                lvl.level <= 2
                                  ? "bg-accent/60"
                                  : lvl.level <= 5
                                  ? "bg-accent-green/60"
                                  : "bg-accent-purple/60"
                              }`}
                              style={{ width: `${Math.max(progressPct, 5)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>

          <div className="mt-6">
            <AccentCard side="left" color="green">
              <p className="text-text-secondary text-sm">
                <span className="text-accent-green font-mono text-xs">实战建议</span>
                <span className="text-text-muted mx-2">&mdash;</span>
                大多数产品在 Level 3-4 就能满足需求。Level 7-8 是 Claude Code 的水平，
                需要专门的工程团队。<span className="text-text-primary">先跑起来，再优化。</span>
              </p>
            </AccentCard>
          </div>
        </RevealSection>

        {/* 4. Open Source Opportunities */}
        <RevealSection>
          <h3 className="text-xl md:text-2xl font-bold mb-3">开源机会</h3>
          <p className="text-text-secondary text-sm mb-8 max-w-[65ch]">
            Claude Code 做得好的地方值得学习，做得不够好的地方就是你的机会。
          </p>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {openSourceOpportunities.map((opp, i) => (
              <StaggerItem key={i}>
                <AccentCard side="top" color={opp.color} className="h-full">
                  <h4 className={`text-base font-bold mb-3 text-accent-${opp.color}`}>{opp.area}</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-mono text-text-muted block mb-1">CURRENT WEAKNESS</span>
                      <p className="text-text-secondary text-sm">{opp.weakness}</p>
                    </div>
                    <div className="border-t border-border pt-3">
                      <span className="text-xs font-mono text-accent-green block mb-1">OPPORTUNITY</span>
                      <p className="text-text-primary text-sm">{opp.opportunity}</p>
                    </div>
                  </div>
                </AccentCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="mt-6">
            <AccentCard side="left" color="purple">
              <p className="text-text-secondary text-sm">
                <span className="text-accent-purple font-mono text-xs">机会窗口</span>
                <span className="text-text-muted mx-2">&mdash;</span>
                Harness Engineering 还在早期，现在开始做开源工具，有机会成为这个领域的基础设施。
                <span className="text-text-primary"> 就像 LangChain 抓住了 Prompt Engineering 的窗口。</span>
              </p>
            </AccentCard>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
