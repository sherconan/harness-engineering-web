"use client";
import { RevealSection, StaggerContainer, StaggerItem } from "../motion/RevealSection";
import { SectionHeader, SectionTag } from "../ui/SectionHeader";
import { AccentCard, Card } from "../ui/Card";
import { CodeBlock } from "../ui/CodeBlock";

/* ──────────────────────────────────────────────
   Flow Diagram — reusable styled flow component
   ────────────────────────────────────────────── */
function FlowDiagram({ steps, color = "blue" }: { steps: string[]; color?: string }) {
  const colorMap: Record<string, string> = {
    blue: "border-accent text-accent",
    purple: "border-accent-purple text-accent-purple",
    orange: "border-accent-orange text-accent-orange",
    green: "border-accent-green text-accent-green",
    red: "border-accent-red text-accent-red",
  };
  const arrowColor: Record<string, string> = {
    blue: "text-accent/60",
    purple: "text-accent-purple/60",
    orange: "text-accent-orange/60",
    green: "text-accent-green/60",
    red: "text-accent-red/60",
  };
  const cls = colorMap[color] || colorMap.blue;
  const arrCls = arrowColor[color] || arrowColor.blue;

  return (
    <div className="flex flex-wrap items-center gap-2 py-4">
      {steps.map((step, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className={`inline-block border ${cls} rounded-lg px-3 py-1.5 text-xs md:text-sm font-mono whitespace-nowrap`}>
            {step}
          </span>
          {i < steps.length - 1 && (
            <span className={`${arrCls} text-lg font-bold select-none`}>&rarr;</span>
          )}
        </span>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Insight label
   ────────────────────────────────────────────── */
function InsightLabel({ text }: { text: string }) {
  return (
    <span className="inline-block text-[10px] font-mono tracking-widest text-accent/70 uppercase mb-1">
      {text}
    </span>
  );
}

/* ──────────────────────────────────────────────
   Module wrapper — gives each module a visual anchor
   ────────────────────────────────────────────── */
function ModuleSection({
  id,
  number,
  title,
  subtitle,
  color,
  children,
}: {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  color: "blue" | "green" | "orange" | "purple" | "red";
  children: React.ReactNode;
}) {
  const colorMap: Record<string, string> = {
    blue: "from-accent/20 to-transparent text-accent",
    purple: "from-accent-purple/20 to-transparent text-accent-purple",
    orange: "from-accent-orange/20 to-transparent text-accent-orange",
    green: "from-accent-green/20 to-transparent text-accent-green",
    red: "from-accent-red/20 to-transparent text-accent-red",
  };
  const gradCls = colorMap[color] || colorMap.blue;
  const numColor: Record<string, string> = {
    blue: "text-accent",
    purple: "text-accent-purple",
    orange: "text-accent-orange",
    green: "text-accent-green",
    red: "text-accent-red",
  };

  return (
    <div id={id} className="scroll-mt-24 py-16 md:py-24 border-t border-border/50 first:border-t-0 first:pt-0">
      <RevealSection>
        <div className="flex items-start gap-5 mb-8">
          <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${gradCls} flex items-center justify-center border border-border`}>
            <span className={`text-2xl font-bold font-mono ${numColor[color]}`}>{number}</span>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h3>
            <p className="text-text-secondary text-sm mt-1 font-mono">{subtitle}</p>
          </div>
        </div>
      </RevealSection>
      <div className="space-y-8">{children}</div>
    </div>
  );
}

/* ======================================================================
   MAIN COMPONENT
   ====================================================================== */
export function Part2DeepDiveSection() {
  return (
    <section className="py-20 md:py-32 border-t border-border" id="deep-dive">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <SectionHeader
          tag="PART 2 — DEEP DIVE"
          title="八大模块深度拆解"
          subtitle="逐一深入每个模块的架构设计、代码模式和工程决策。这不是概述——是足够支撑 30 分钟深度讨论的技术剖析。"
        />

        {/* ════════════════════════════════════════════
            MODULE 1 — Query Loop
            ════════════════════════════════════════════ */}
        <ModuleSection id="dd-query-loop" number={1} title="Query Loop — 核心循环" subtitle="QueryEngine.ts + query.ts" color="blue">
          <RevealSection>
            <p className="text-text-secondary leading-relaxed mb-4">
              Claude Code 的心脏是一个 <span className="text-text-primary font-medium">async generator 驱动的循环</span>。
              它不是简单的 request → response，而是一个持续运转的状态机：每一轮接收模型输出、判断是否需要执行工具、
              执行后将结果追加到对话历史，然后再次调用模型。这个循环由 <span className="text-accent font-mono">Harness</span> 控制——
              模型自己不决定何时停止，它只能输出 <code className="text-accent">end_turn</code> 或 <code className="text-accent">tool_use</code>。
            </p>
          </RevealSection>

          <RevealSection>
            <Card className="mb-6">
              <p className="text-xs font-mono text-text-muted mb-3 uppercase tracking-widest">循环流程</p>
              <FlowDiagram
                steps={["User Input", "Build Prompt", "Stream API", "Parse Response", "tool_use?", "Permission Check", "Execute Tool", "Append Result", "Loop"]}
                color="blue"
              />
              <p className="text-text-secondary text-sm mt-3">
                注意 <span className="text-text-primary">&ldquo;tool_use?&rdquo;</span> 是分支点：如果模型输出 <code className="text-accent">end_turn</code>，循环结束；
                如果输出 <code className="text-accent">tool_use</code>，进入工具执行 → 追加结果 → 继续循环。
              </p>
            </Card>
          </RevealSection>

          <RevealSection>
            <CodeBlock title="query.ts — 核心循环结构 (简化)">
{`async function* query(
  engine: QueryEngine,
  messages: Message[],
  systemPrompt: string
): AsyncGenerator<StreamEvent> {
  while (true) {
    // 1. 调用 LLM API (streaming)
    const response = yield* streamAPI(engine, messages, systemPrompt);

    // 2. 解析响应
    const stopReason = response.stop_reason;

    if (stopReason === "end_turn") {
      // 模型决定结束 → 退出循环
      return;
    }

    if (stopReason === "tool_use") {
      for (const toolCall of response.tool_calls) {
        // 3. 权限检查 — Harness 层强制执行
        const permission = await checkPermission(toolCall);
        if (permission === "denied") {
          messages.push(makeDenialMessage(toolCall));
          engine.permissionDenials++;
          continue;
        }

        // 4. 执行工具
        const result = await executeTool(toolCall);

        // 5. 追加结果到对话历史
        messages.push(makeToolResultMessage(toolCall, result));
      }
    }

    // 6. Feature-gated: 上下文压缩检查
    if (shouldCompact(messages, engine)) {
      messages = await compact(messages, engine);
    }

    // Loop continues → 回到 while(true) 顶部
  }
}`}
            </CodeBlock>
          </RevealSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-4 mt-6">
            <StaggerItem>
              <AccentCard color="blue">
                <InsightLabel text="设计洞察 #1" />
                <h4 className="text-text-primary font-semibold mb-2">Harness 控制循环，不是模型</h4>
                <p className="text-text-secondary text-sm">
                  模型只有两个出口：<code className="text-accent">end_turn</code> 和 <code className="text-accent">tool_use</code>。
                  Harness 决定是否真正执行工具、是否压缩上下文、是否中止——这就是 &ldquo;Harness&rdquo; 这个名字的含义：驾驭。
                </p>
              </AccentCard>
            </StaggerItem>
            <StaggerItem>
              <AccentCard color="blue">
                <InsightLabel text="设计洞察 #2" />
                <h4 className="text-text-primary font-semibold mb-2">QueryEngine 持有全部状态</h4>
                <p className="text-text-secondary text-sm">
                  <code className="text-accent">mutableMessages</code>、<code className="text-accent">abortController</code>、
                  <code className="text-accent">permissionDenials</code>、<code className="text-accent">totalUsage</code>
                  全部在 QueryEngine 实例上。query.ts 是纯函数逻辑，QueryEngine 是状态容器。
                </p>
              </AccentCard>
            </StaggerItem>
            <StaggerItem>
              <AccentCard color="blue">
                <InsightLabel text="设计洞察 #3" />
                <h4 className="text-text-primary font-semibold mb-2">Async Generator 模式</h4>
                <p className="text-text-secondary text-sm">
                  使用 <code className="text-accent">yield*</code> 转发流式事件，调用方可以实时消费 token。
                  这不是回调地狱，也不是 Observable——是原生 JS 的流式处理最优解。
                </p>
              </AccentCard>
            </StaggerItem>
          </StaggerContainer>
        </ModuleSection>

        {/* ════════════════════════════════════════════
            MODULE 2 — System Prompt
            ════════════════════════════════════════════ */}
        <ModuleSection id="dd-system-prompt" number={2} title="System Prompt — 动态组装" subtitle="prompts.ts — 914 行" color="purple">
          <RevealSection>
            <p className="text-text-secondary leading-relaxed mb-4">
              Claude Code 的系统 Prompt 不是一个静态字符串——它是一个 <span className="text-text-primary font-medium">914 行的动态构建器</span>，
              每次调用 API 时实时组装。更关键的是，它被一个叫 <code className="text-accent-purple font-mono">SYSTEM_PROMPT_DYNAMIC_BOUNDARY</code> 的标记分成两部分，
              这直接决定了 Anthropic API 的计费方式。
            </p>
          </RevealSection>

          <RevealSection>
            <Card className="mb-6">
              <p className="text-xs font-mono text-text-muted mb-3 uppercase tracking-widest">组装流程</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-24 text-right text-xs font-mono text-accent-purple/80 pt-0.5">静态区域</span>
                  <div className="flex-1 border-l-2 border-accent-purple/30 pl-4">
                    <FlowDiagram steps={["getSimpleIntroSection", "getSimpleSystemSection", "getSimpleDoingTasksSection"]} color="purple" />
                    <p className="text-text-secondary text-xs">身份定义 + 通用规则 + 任务执行指南 → <span className="text-accent-purple">Prompt Cache 命中，10% 成本</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-24 text-right text-xs font-mono text-accent-orange/80">分界线</span>
                  <div className="flex-1 border-l-2 border-accent-orange/30 pl-4 py-2">
                    <code className="text-accent-orange text-xs font-mono">__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__</code>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-24 text-right text-xs font-mono text-accent-orange/80 pt-0.5">动态区域</span>
                  <div className="flex-1 border-l-2 border-accent-orange/30 pl-4">
                    <FlowDiagram steps={["getActionsSection", "getUsingYourToolsSection", "getAgentToolSection", "User Context"]} color="orange" />
                    <p className="text-text-secondary text-xs">可用工具列表 + CLAUDE.md + MEMORY.md + git 状态 → <span className="text-accent-orange">全价计费</span></p>
                  </div>
                </div>
              </div>
            </Card>
          </RevealSection>

          <RevealSection>
            <CodeBlock title="prompts.ts — 动态边界切分 (简化)">
{`function buildSystemPrompt(config: PromptConfig): string {
  // ─── 静态部分：跨请求缓存 (10% 成本) ───
  const staticParts = [
    getSimpleIntroSection(),       // "You are Claude Code..."
    getSimpleSystemSection(),      // 通用规则、限制
    getSimpleDoingTasksSection(),  // 任务执行指南
  ].join("\\n\\n");

  // ─── 缓存边界标记 ───
  const boundary = SYSTEM_PROMPT_DYNAMIC_BOUNDARY;

  // ─── 动态部分：每次重新计费 (全价) ───
  const dynamicParts = [
    getActionsSection(config.tools),        // 可用操作
    getUsingYourToolsSection(config.tools),  // 工具使用指南
    getAgentToolSection(config.agentMode),   // Agent 工具说明
    getUserContext(config.claudeMd, config.memory), // 用户上下文
  ].join("\\n\\n");

  return staticParts + "\\n" + boundary + "\\n" + dynamicParts;
}`}
            </CodeBlock>
          </RevealSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-4 mt-6">
            <StaggerItem>
              <AccentCard color="purple">
                <InsightLabel text="成本洞察" />
                <h4 className="text-text-primary font-semibold mb-2">Prompt Cache 节省 90%</h4>
                <p className="text-text-secondary text-sm">
                  静态部分（身份 + 规则）在多轮对话中几乎不变，命中 Prompt Cache 后只需 10% 成本。
                  这就是为什么工具列表排序要稳定——顺序变了，缓存就失效了。
                </p>
              </AccentCard>
            </StaggerItem>
            <StaggerItem>
              <AccentCard color="purple">
                <InsightLabel text="架构洞察" />
                <h4 className="text-text-primary font-semibold mb-2">工具排序影响缓存</h4>
                <p className="text-text-secondary text-sm">
                  <code className="text-accent-purple">assembleToolPool()</code> 先排内置工具（稳定前缀），MCP 工具排后面。
                  即使 MCP 工具列表变化，也不会破坏前缀缓存。这是精心设计的成本优化。
                </p>
              </AccentCard>
            </StaggerItem>
            <StaggerItem>
              <AccentCard color="purple">
                <InsightLabel text="设计权衡" />
                <h4 className="text-text-primary font-semibold mb-2">CLAUDE.md 在动态区 = 全价</h4>
                <p className="text-text-secondary text-sm">
                  用户的 CLAUDE.md 放在动态区域，每次请求全价计费。这是有意的——
                  用户随时可能修改 CLAUDE.md，放到静态区会导致缓存频繁失效，反而更贵。
                </p>
              </AccentCard>
            </StaggerItem>
          </StaggerContainer>
        </ModuleSection>

        {/* ════════════════════════════════════════════
            MODULE 3 — Tool System
            ════════════════════════════════════════════ */}
        <ModuleSection id="dd-tool-system" number={3} title="Tool System — 工具系统" subtitle="四层工具体系 + 动态索引" color="orange">
          <RevealSection>
            <p className="text-text-secondary leading-relaxed mb-4">
              Claude Code 的工具系统不是一个扁平列表——它是一个 <span className="text-text-primary font-medium">四层架构</span>，
              从原子操作到外部集成逐层抽象。更巧妙的是，当工具总量超过上下文的 10% 时，
              系统会自动切换到 <span className="text-accent-orange font-medium">两级索引模式</span>：系统 Prompt 只放工具名称目录，
              模型通过 ToolSearchTool 按需搜索完整 schema。
            </p>
          </RevealSection>

          <RevealSection>
            <Card className="mb-6">
              <p className="text-xs font-mono text-text-muted mb-3 uppercase tracking-widest">四层工具体系</p>
              <div className="space-y-4">
                <div className="grid grid-cols-[100px_1fr] gap-3 items-start">
                  <span className="text-xs font-mono text-accent-orange bg-accent-orange/10 rounded px-2 py-1 text-center">Layer 1</span>
                  <div>
                    <p className="text-text-primary font-medium text-sm">原子工具 — Bash, Read, Write, Edit, Grep, Glob</p>
                    <p className="text-text-secondary text-xs mt-1">直接操作文件系统和进程。每个工具职责单一，组合使用。</p>
                  </div>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-3 items-start">
                  <span className="text-xs font-mono text-accent-orange bg-accent-orange/10 rounded px-2 py-1 text-center">Layer 2</span>
                  <div>
                    <p className="text-text-primary font-medium text-sm">元工具 — Agent, Skill, ToolSearch</p>
                    <p className="text-text-secondary text-xs mt-1">操作其他工具的工具。Agent 启动子 agent，Skill 加载技能包，ToolSearch 搜索工具 schema。</p>
                  </div>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-3 items-start">
                  <span className="text-xs font-mono text-accent-orange bg-accent-orange/10 rounded px-2 py-1 text-center">Layer 3</span>
                  <div>
                    <p className="text-text-primary font-medium text-sm">MCP 工具 — 标准协议接入的外部工具</p>
                    <p className="text-text-secondary text-xs mt-1">通过 Model Context Protocol 接入第三方工具。动态发现，运行时加载。</p>
                  </div>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-3 items-start">
                  <span className="text-xs font-mono text-accent-orange bg-accent-orange/10 rounded px-2 py-1 text-center">Layer 4</span>
                  <div>
                    <p className="text-text-primary font-medium text-sm">Feature-gated 工具 — 按 Feature Flag 条件启用</p>
                    <p className="text-text-secondary text-xs mt-1">实验性功能通过 Feature Flag 控制。灰度发布，不影响稳定用户。</p>
                  </div>
                </div>
              </div>
            </Card>
          </RevealSection>

          <RevealSection>
            <CodeBlock title="assembleToolPool() — 工具池组装 (简化)">
{`function assembleToolPool(config: ToolConfig): Tool[] {
  // 1. 内置工具 — 排在前面，保持排序稳定 (缓存友好)
  const builtIn = [
    BashTool, ReadTool, WriteTool, EditTool,
    GrepTool, GlobTool, AgentTool, SkillTool,
  ];

  // 2. Feature-gated 工具 — 按 flag 条件加入
  if (flags.TOOL_SEARCH_ENABLED) builtIn.push(ToolSearchTool);
  if (flags.NOTEBOOK_EDIT)       builtIn.push(NotebookEditTool);

  // 3. MCP 工具 — 动态发现，排在后面
  const mcpTools = await discoverMCPTools(config.mcpServers);

  // 4. 合并 + 去重 (内置优先)
  return uniqBy([...builtIn, ...mcpTools], tool => tool.name);
}

// ToolSearchTool: 当工具太多时的两级索引
function shouldDeferToolSchemas(tools: Tool[]): boolean {
  const toolTokens = estimateTokens(tools.map(t => t.schema));
  const contextLimit = getContextWindow();
  return toolTokens > contextLimit * 0.1; // 超过 10% 上下文
}`}
            </CodeBlock>
          </RevealSection>

          <RevealSection>
            <CodeBlock title="ToolSearchTool — 模糊匹配 + 加权评分">
{`// 模型调用: ToolSearch({ query: "notebook jupyter" })
function searchTools(query: string, allTools: Tool[]): Tool[] {
  const results = allTools.map(tool => {
    let score = 0;

    // 名称精确匹配: 10-12 分 (最高权重)
    if (tool.name.toLowerCase().includes(query))  score += 12;
    if (fuzzyMatch(tool.name, query) > 0.8)       score += 10;

    // 描述匹配: 2 分
    if (tool.description?.includes(query))         score += 2;

    return { tool, score };
  });

  // 跨 turn 追踪: 已发现的工具不重复搜索
  return results
    .filter(r => r.score > 0 && !discoveredTools.has(r.tool.name))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(r => r.tool);
}`}
            </CodeBlock>
          </RevealSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-4 mt-6">
            <StaggerItem>
              <AccentCard color="orange">
                <InsightLabel text="性能洞察" />
                <h4 className="text-text-primary font-semibold mb-2">排序稳定性 = 缓存命中率</h4>
                <p className="text-text-secondary text-sm">
                  内置工具永远排在 MCP 工具前面，且内置工具列表顺序固定。
                  这保证了系统 Prompt 的前缀不变，Prompt Cache 命中率最大化。
                </p>
              </AccentCard>
            </StaggerItem>
            <StaggerItem>
              <AccentCard color="orange">
                <InsightLabel text="扩展性洞察" />
                <h4 className="text-text-primary font-semibold mb-2">两级索引解决上下文爆炸</h4>
                <p className="text-text-secondary text-sm">
                  100 个 MCP 工具的 schema 可能占 50K tokens。两级索引方案：
                  系统 Prompt 只放名称列表（~2K tokens），模型按需搜索完整 schema。
                </p>
              </AccentCard>
            </StaggerItem>
            <StaggerItem>
              <AccentCard color="orange">
                <InsightLabel text="设计权衡" />
                <h4 className="text-text-primary font-semibold mb-2">uniqBy 优先保留内置</h4>
                <p className="text-text-secondary text-sm">
                  如果 MCP 工具和内置工具同名，<code className="text-accent-orange">uniqBy</code> 保留先出现的（内置）。
                  这防止恶意 MCP 服务器覆盖核心工具行为。
                </p>
              </AccentCard>
            </StaggerItem>
          </StaggerContainer>
        </ModuleSection>

        {/* ════════════════════════════════════════════
            MODULE 4 — Memory System
            ════════════════════════════════════════════ */}
        <ModuleSection id="dd-memory" number={4} title="Memory System — 记忆系统" subtitle="CLAUDE.md + MEMORY.md + 自动提取" color="purple">
          <RevealSection>
            <p className="text-text-secondary leading-relaxed mb-4">
              Claude Code 的记忆系统有三层，但它 <span className="text-text-primary font-medium">没有使用向量检索</span>。
              这是一个有意的设计选择——不是技术限制。在 200 个记忆文件的规模下，
              让 LLM 直接从文件名和摘要中选择 5 个最相关的，比维护一个向量数据库更简单、更可靠。
              代价是：容量有硬上限，且没有遗忘机制。
            </p>
          </RevealSection>

          <RevealSection>
            <Card className="mb-6">
              <p className="text-xs font-mono text-text-muted mb-3 uppercase tracking-widest">三层记忆架构</p>
              <div className="space-y-4">
                <div className="bg-accent-purple/10 border border-accent-purple/20 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-accent-purple font-mono text-sm font-bold">Layer 1</span>
                    <span className="text-text-primary font-medium">CLAUDE.md — 项目指令</span>
                    <span className="text-xs bg-accent-orange/20 text-accent-orange rounded px-2 py-0.5 ml-auto">动态区域 = 全价</span>
                  </div>
                  <p className="text-text-secondary text-sm">
                    存放在项目根目录或 <code className="text-accent-purple">~/.claude/</code> 下。每次请求都加载到系统 Prompt 的动态区域。
                    内容是用户主动编写的规则和偏好。
                  </p>
                </div>
                <div className="bg-accent-purple/10 border border-accent-purple/20 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-accent-purple font-mono text-sm font-bold">Layer 2</span>
                    <span className="text-text-primary font-medium">MEMORY.md — 持久记忆</span>
                    <span className="text-xs bg-accent-orange/20 text-accent-orange rounded px-2 py-0.5 ml-auto">200 行 / 25KB 上限</span>
                  </div>
                  <p className="text-text-secondary text-sm">
                    自动记忆索引文件。始终加载，包含指向具体记忆文件的链接。
                    记忆类型：<code className="text-accent-purple">user</code>（用户背景）、<code className="text-accent-purple">feedback</code>（偏好反馈）、
                    <code className="text-accent-purple">project</code>（项目信息）、<code className="text-accent-purple">reference</code>（参考资料）。
                  </p>
                </div>
                <div className="bg-accent-purple/10 border border-accent-purple/20 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-accent-purple font-mono text-sm font-bold">Layer 3</span>
                    <span className="text-text-primary font-medium">自动提取 — 后台 Agent</span>
                    <span className="text-xs bg-accent-green/20 text-accent-green rounded px-2 py-0.5 ml-auto">异步 / 非阻塞</span>
                  </div>
                  <p className="text-text-secondary text-sm">
                    对话结束后，后台 agent 分析对话内容，提取值得记住的信息。
                    不干扰主循环，下次对话时生效。
                  </p>
                </div>
              </div>
            </Card>
          </RevealSection>

          <RevealSection>
            <CodeBlock title="记忆检索 — LLM 选择，非向量检索">
{`// 记忆检索流程
async function retrieveRelevantMemories(
  query: string,
  memoryIndex: MemoryEntry[]  // 最多 200 个条目
): Promise<MemoryFile[]> {

  // 1. MEMORY.md 始终加载 (索引文件)
  const index = await readMemoryIndex();

  // 2. LLM 从 200 个文件名+摘要中选 5 个最相关的
  const selected = await llmSelect({
    prompt: \`从以下记忆文件中选择与当前任务最相关的 5 个：
      当前任务: \${query}
      可用记忆: \${index.map(m => m.title + ": " + m.summary)}\`,
    maxSelections: 5,
  });

  // 3. 按需加载选中的记忆文件全文
  return Promise.all(selected.map(s => readMemoryFile(s.path)));
}

// 记忆存储
interface MemoryEntry {
  type: "user" | "feedback" | "project" | "reference";
  title: string;
  summary: string;   // 一行摘要，用于索引
  path: string;       // 实际文件路径
  createdAt: string;
  // 注意：没有 expiry / TTL — 无遗忘机制
}`}
            </CodeBlock>
          </RevealSection>

          <StaggerContainer className="grid md:grid-cols-2 gap-4 mt-6">
            <StaggerItem>
              <AccentCard color="purple">
                <InsightLabel text="设计选择" />
                <h4 className="text-text-primary font-semibold mb-2">为什么不用向量检索？</h4>
                <p className="text-text-secondary text-sm">
                  200 个文件的规模下，LLM 直接读文件名和摘要选 5 个，准确率比向量相似度更高。
                  向量检索适合万级以上文档。Claude Code 选了更简单的方案，代价是硬上限 200 个文件。
                </p>
              </AccentCard>
            </StaggerItem>
            <StaggerItem>
              <AccentCard color="purple">
                <InsightLabel text="已知弱点" />
                <h4 className="text-text-primary font-semibold mb-2">无遗忘机制 = 记忆堆积</h4>
                <p className="text-text-secondary text-sm">
                  没有 TTL、没有重要性衰减、没有自动清理。长期使用后记忆文件堆积，
                  200 个名额被过时信息占满。用户需要手动管理。这是当前架构的明确短板。
                </p>
              </AccentCard>
            </StaggerItem>
          </StaggerContainer>
        </ModuleSection>

        {/* ════════════════════════════════════════════
            MODULE 5 — Permission System
            ════════════════════════════════════════════ */}
        <ModuleSection id="dd-permission" number={5} title="Permission System — 权限系统" subtitle="12,000 行 / 20+ 文件 — 最大子系统" color="green">
          <RevealSection>
            <p className="text-text-secondary leading-relaxed mb-4">
              权限系统是 Claude Code 中 <span className="text-text-primary font-medium">代码量最大的单一子系统</span>——12,000 行，20+ 文件。
              这不是因为权限逻辑本身复杂，而是因为它必须覆盖所有边界情况，且 <span className="text-accent-green font-medium">绝对不能出错</span>。
              核心设计原则：<span className="text-text-primary">权限检查在 Harness 层强制执行，不能做成 Tool</span>——
              因为模型可以选择不调用 Tool，但安全检查不能是可选的。
            </p>
          </RevealSection>

          <RevealSection>
            <Card className="mb-6">
              <p className="text-xs font-mono text-text-muted mb-3 uppercase tracking-widest">三级决策链</p>
              <div className="space-y-3">
                <div className="bg-accent-red/10 border border-accent-red/20 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-accent-red/20 text-accent-red font-mono text-xs font-bold rounded px-2 py-1">DENY</span>
                    <span className="text-text-primary font-medium">硬拒绝 — 绝对禁止</span>
                  </div>
                  <p className="text-text-secondary text-sm">
                    匹配拒绝规则的操作直接阻止，不询问用户，不经过分类器。
                    例如：<code className="text-accent-red">rm -rf /</code>、写入系统关键路径、已知危险命令模式。
                  </p>
                </div>
                <div className="flex justify-center">
                  <span className="text-text-muted text-xs font-mono">↓ 未匹配 Deny 规则</span>
                </div>
                <div className="bg-accent-green/10 border border-accent-green/20 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-accent-green/20 text-accent-green font-mono text-xs font-bold rounded px-2 py-1">ALLOW</span>
                    <span className="text-text-primary font-medium">自动放行 — 已知安全</span>
                  </div>
                  <p className="text-text-secondary text-sm">
                    匹配允许规则的操作直接放行。
                    例如：读取文件、<code className="text-accent-green">git status</code>、<code className="text-accent-green">ls</code>、只读操作。
                  </p>
                </div>
                <div className="flex justify-center">
                  <span className="text-text-muted text-xs font-mono">↓ 未匹配 Allow 规则</span>
                </div>
                <div className="bg-accent-orange/10 border border-accent-orange/20 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-accent-orange/20 text-accent-orange font-mono text-xs font-bold rounded px-2 py-1">ASK</span>
                    <span className="text-text-primary font-medium">AI 分类器 + 用户确认</span>
                  </div>
                  <p className="text-text-secondary text-sm">
                    不确定的操作进入 Ask 流程。<span className="text-text-primary">关键设计：分类器和用户提示同时启动</span>——
                    如果分类器判断安全，在用户点击前就自动放行；如果分类器判断危险，等待用户确认。
                  </p>
                </div>
              </div>
            </Card>
          </RevealSection>

          <RevealSection>
            <CodeBlock title="Permission Check — 并行分类器设计">
{`async function checkPermission(toolCall: ToolCall): Promise<Decision> {
  // ─── 第一级: Deny 规则 (同步，硬阻止) ───
  if (matchesDenyRules(toolCall)) {
    return { decision: "deny", reason: "硬拒绝规则匹配" };
  }

  // ─── 第二级: Allow 规则 (同步，自动放行) ───
  if (matchesAllowRules(toolCall)) {
    return { decision: "allow" };
  }

  // ─── 第三级: Ask 流程 (异步并行) ───
  // 关键: 分类器和用户提示 **同时** 启动
  const classifierPromise = runClassifier(toolCall);
  const userPromptPromise = showUserPrompt(toolCall);

  // 两阶段分类器: fast (Haiku) + thinking (Opus)
  const classifierResult = await classifierPromise;

  if (classifierResult.safe && classifierResult.confidence > 0.95) {
    // 分类器高置信度判断安全 → 自动放行，不等用户
    cancelUserPrompt(userPromptPromise);
    return { decision: "allow", reason: "分类器自动放行" };
  }

  // 分类器不确定或判断危险 → 等用户决定
  return await userPromptPromise;
}

// 分类器类型
// TRANSCRIPT_CLASSIFIER: 分析整体对话上下文
// BASH_CLASSIFIER: 专门分析 Bash 命令安全性`}
            </CodeBlock>
          </RevealSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-4 mt-6">
            <StaggerItem>
              <AccentCard color="green">
                <InsightLabel text="安全洞察" />
                <h4 className="text-text-primary font-semibold mb-2">为什么不能做成 Tool？</h4>
                <p className="text-text-secondary text-sm">
                  如果权限检查是一个 Tool，模型可以选择不调用它。
                  &ldquo;我觉得这个操作安全，跳过权限检查吧&rdquo;——这就是灾难。
                  所以权限必须在 Harness 循环中硬编码，模型无法绕过。
                </p>
              </AccentCard>
            </StaggerItem>
            <StaggerItem>
              <AccentCard color="green">
                <InsightLabel text="性能洞察" />
                <h4 className="text-text-primary font-semibold mb-2">并行设计消除等待</h4>
                <p className="text-text-secondary text-sm">
                  分类器和用户提示同时启动。对于大多数安全操作，分类器在用户看到弹窗之前就已经判断完毕。
                  用户感知到的延迟为零。这是 UX + 安全的平衡。
                </p>
              </AccentCard>
            </StaggerItem>
            <StaggerItem>
              <AccentCard color="green">
                <InsightLabel text="规模洞察" />
                <h4 className="text-text-primary font-semibold mb-2">12,000 行的原因</h4>
                <p className="text-text-secondary text-sm">
                  不是逻辑复杂，是边界情况多：文件路径规范化、符号链接处理、
                  多平台差异（Windows/macOS/Linux）、Docker 环境检测、
                  git 仓库边界、临时文件白名单...安全代码必须穷举。
                </p>
              </AccentCard>
            </StaggerItem>
          </StaggerContainer>
        </ModuleSection>

        {/* ════════════════════════════════════════════
            MODULE 6 — Context Management
            ════════════════════════════════════════════ */}
        <ModuleSection id="dd-context" number={6} title="Context Management — 上下文管理" subtitle="四种压缩策略 + Prompt Cache 协同" color="orange">
          <RevealSection>
            <p className="text-text-secondary leading-relaxed mb-4">
              Claude 的上下文窗口是 200K tokens，听起来很大，但在工具密集的对话中消耗极快。
              一个 <code className="text-accent-orange">cat</code> 大文件就能吃掉 20K tokens。
              上下文管理的目标是：<span className="text-text-primary font-medium">在不丢失关键信息的前提下，让对话持续尽可能长</span>。
              Claude Code 为此设计了四种递进策略。
            </p>
          </RevealSection>

          <RevealSection>
            <Card className="mb-6">
              <p className="text-xs font-mono text-text-muted mb-3 uppercase tracking-widest">四种策略 — 递进使用</p>
              <div className="space-y-3">
                <div className="grid grid-cols-[120px_1fr] gap-4 items-start bg-accent-orange/10 border border-accent-orange/10 rounded-lg p-4">
                  <div>
                    <span className="text-accent-orange font-mono text-sm font-bold">Compact</span>
                    <p className="text-text-muted text-xs mt-1">定期摘要</p>
                  </div>
                  <div>
                    <p className="text-text-secondary text-sm">
                      当上下文达到 <span className="text-text-primary">~83% (167K / 200K)</span> 时自动触发。
                      用 LLM 将历史对话压缩为摘要，保留关键决策和代码变更记录。
                      预留 20K tokens 给摘要内容 + 13K 安全缓冲。
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-4 items-start bg-accent-orange/10 border border-accent-orange/10 rounded-lg p-4">
                  <div>
                    <span className="text-accent-orange font-mono text-sm font-bold">Reactive</span>
                    <p className="text-text-muted text-xs mt-1">响应式压缩</p>
                  </div>
                  <div>
                    <p className="text-text-secondary text-sm">
                      不等 83% 阈值——当模型返回上下文溢出错误时立即触发。
                      Feature flag: <code className="text-accent-orange">REACTIVE_COMPACT</code>。
                      比定期 Compact 更激进，压缩比更高。
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-4 items-start bg-accent-orange/10 border border-accent-orange/10 rounded-lg p-4">
                  <div>
                    <span className="text-accent-orange font-mono text-sm font-bold">Collapse</span>
                    <p className="text-text-muted text-xs mt-1">折叠工具结果</p>
                  </div>
                  <div>
                    <p className="text-text-secondary text-sm">
                      不压缩对话本身，而是折叠早期工具调用的详细结果。
                      例如：一个 <code className="text-accent-orange">cat</code> 返回了 5000 行，折叠为 &ldquo;[读取了 file.ts，5000 行]&rdquo;。
                      Feature flag: <code className="text-accent-orange">CONTEXT_COLLAPSE</code>。
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-4 items-start bg-accent-orange/10 border border-accent-orange/10 rounded-lg p-4">
                  <div>
                    <span className="text-accent-orange font-mono text-sm font-bold">Snip</span>
                    <p className="text-text-muted text-xs mt-1">历史裁剪</p>
                  </div>
                  <div>
                    <p className="text-text-secondary text-sm">
                      最后手段：直接截断早期历史消息。保留最近的 N 条消息和系统 Prompt。
                      信息不可恢复地丢失，但保证对话能继续。
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </RevealSection>

          <RevealSection>
            <CodeBlock title="Auto-Compact 触发逻辑">
{`function shouldCompact(messages: Message[], engine: QueryEngine): boolean {
  const currentTokens = estimateTokenCount(messages);
  const contextWindow = 200_000;  // Claude 上下文窗口
  const summaryBudget = 20_000;   // 预留给摘要的空间
  const safetyBuffer  = 13_000;   // 安全缓冲

  // 阈值 = 200K - 20K - 13K = 167K (~83%)
  const threshold = contextWindow - summaryBudget - safetyBuffer;

  return currentTokens > threshold;
}

async function compact(
  messages: Message[],
  engine: QueryEngine
): Promise<Message[]> {
  // 1. 保留系统 Prompt (不压缩)
  const systemPrompt = messages[0];

  // 2. 将历史消息发给 LLM 生成摘要
  const summary = await engine.summarize(messages.slice(1));

  // 3. 重建消息数组: [系统Prompt, 摘要, 最近几条消息]
  const recentMessages = messages.slice(-KEEP_RECENT);
  return [systemPrompt, makeSummaryMessage(summary), ...recentMessages];

  // 关键: 静态 Prompt 前缀不变 → Prompt Cache 仍然命中
}`}
            </CodeBlock>
          </RevealSection>

          <StaggerContainer className="grid md:grid-cols-2 gap-4 mt-6">
            <StaggerItem>
              <AccentCard color="orange">
                <InsightLabel text="缓存协同" />
                <h4 className="text-text-primary font-semibold mb-2">压缩不破坏 Prompt Cache</h4>
                <p className="text-text-secondary text-sm">
                  压缩只影响动态区域的对话历史，系统 Prompt 的静态前缀完全不变。
                  这意味着即使压缩了 10 次，每次 API 调用的静态部分仍然命中缓存（10% 成本）。
                  这不是巧合，是精心设计的。
                </p>
              </AccentCard>
            </StaggerItem>
            <StaggerItem>
              <AccentCard color="orange">
                <InsightLabel text="设计权衡" />
                <h4 className="text-text-primary font-semibold mb-2">Context Collapse vs Compact</h4>
                <p className="text-text-secondary text-sm">
                  Compact 压缩对话语义（有损），Collapse 折叠工具输出（低损）。
                  Collapse 优先于 Compact 使用——大多数工具输出的详细内容在几轮后就不重要了，
                  折叠它们是最低代价的空间回收。
                </p>
              </AccentCard>
            </StaggerItem>
          </StaggerContainer>
        </ModuleSection>

        {/* ════════════════════════════════════════════
            MODULE 7 — Multi-Agent
            ════════════════════════════════════════════ */}
        <ModuleSection id="dd-multi-agent" number={7} title="Multi-Agent — 多 Agent 协调" subtitle="Sub-agent / Team / Fork" color="blue">
          <RevealSection>
            <p className="text-text-secondary leading-relaxed mb-4">
              Claude Code 不是一个单 Agent 系统——它支持 <span className="text-text-primary font-medium">三种多 Agent 模式</span>，
              适用于不同复杂度的任务。核心思想是：<span className="text-accent font-medium">每个子 Agent 是一个独立的 QueryEngine 实例</span>，
              拥有自己的系统 Prompt、工具白名单、上下文窗口和状态。它们之间通过消息传递协作，不共享内存。
            </p>
          </RevealSection>

          <RevealSection>
            <Card className="mb-6">
              <p className="text-xs font-mono text-text-muted mb-3 uppercase tracking-widest">三种协调模式</p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-accent font-mono text-sm font-bold">Mode 1</span>
                    <span className="text-text-primary font-medium">Sub-agent</span>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    主 Agent 启动一个独立的子 QueryEngine，分配工具子集和专用 Prompt。
                    适合委托单一任务。
                  </p>
                  <div className="text-xs font-mono text-text-muted space-y-1">
                    <p>主 Agent → spawn(子Agent)</p>
                    <p>子 Agent → 独立执行</p>
                    <p>子 Agent → 返回结果</p>
                    <p>主 Agent → 继续</p>
                  </div>
                </div>
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-accent font-mono text-sm font-bold">Mode 2</span>
                    <span className="text-text-primary font-medium">Team</span>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Coordinator 接收任务，拆分为子任务，分配给多个 Worker。
                    Worker 之间通过 SendMessage 通信。
                  </p>
                  <div className="text-xs font-mono text-text-muted space-y-1">
                    <p>Coordinator → 拆分任务</p>
                    <p>Worker A → 子任务 1</p>
                    <p>Worker B → 子任务 2</p>
                    <p>Worker A ↔ Worker B (SendMessage)</p>
                    <p>Coordinator → 汇总结果</p>
                  </div>
                </div>
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-accent font-mono text-sm font-bold">Mode 3</span>
                    <span className="text-text-primary font-medium">Fork</span>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    后台并行：主 Agent 不等子 Agent 完成就继续。
                    适合耗时任务（测试、搜索）。
                  </p>
                  <div className="text-xs font-mono text-text-muted space-y-1">
                    <p>主 Agent → fork(后台Agent)</p>
                    <p>主 Agent → 继续主任务</p>
                    <p>后台 Agent → 并行执行</p>
                    <p>后台 Agent → 结果写入文件</p>
                  </div>
                </div>
              </div>
            </Card>
          </RevealSection>

          <RevealSection>
            <CodeBlock title="Sub-agent 创建 — 独立 QueryEngine">
{`// AgentTool 的核心逻辑
async function executeAgentTool(params: AgentParams): Promise<string> {
  // 1. 创建独立的 QueryEngine — 完全隔离
  const subEngine = new QueryEngine({
    // 独立的系统 Prompt
    systemPrompt: buildSubAgentPrompt(params.task),

    // 工具白名单 — 子 Agent 只能用指定工具
    tools: filterTools(params.allowedTools || [
      "Bash", "Read", "Grep", "Glob",  // 常用搜索工具
      // 注意: 不给 Agent 工具 → 防止无限嵌套
    ]),

    // 模型选择 — 按任务类型优化
    model: selectModel(params.task),

    // 独立的上下文窗口和状态
    mutableMessages: [],
    abortController: new AbortController(),
  });

  // 2. 运行子 Agent 循环
  const result = await runQueryLoop(subEngine, params.task);

  // 3. 返回结果给主 Agent
  return result.summary;
}

// 按任务类型选择模型
function selectModel(task: string): ModelId {
  if (task.includes("search") || task.includes("find"))
    return "claude-haiku";     // 快 + 便宜
  if (task.includes("code") || task.includes("implement"))
    return "claude-opus";      // 准确
  return "claude-sonnet";      // 默认平衡
}`}
            </CodeBlock>
          </RevealSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-4 mt-6">
            <StaggerItem>
              <AccentCard color="blue">
                <InsightLabel text="隔离洞察" />
                <h4 className="text-text-primary font-semibold mb-2">每个子 Agent 完全隔离</h4>
                <p className="text-text-secondary text-sm">
                  独立的 QueryEngine 意味着：独立的消息历史、独立的 token 计数、独立的权限上下文。
                  子 Agent 崩溃不会影响主 Agent。这是故意的——隔离比共享更安全。
                </p>
              </AccentCard>
            </StaggerItem>
            <StaggerItem>
              <AccentCard color="blue">
                <InsightLabel text="成本洞察" />
                <h4 className="text-text-primary font-semibold mb-2">模型选择 = 成本控制</h4>
                <p className="text-text-secondary text-sm">
                  搜索任务用 Haiku（便宜 10 倍），编码任务用 Opus（最准确）。
                  一个复杂任务可能同时运行 3 个 Haiku 子 Agent 搜索 + 1 个 Opus 子 Agent 编码，
                  总成本低于单个 Opus 全程处理。
                </p>
              </AccentCard>
            </StaggerItem>
            <StaggerItem>
              <AccentCard color="blue">
                <InsightLabel text="安全洞察" />
                <h4 className="text-text-primary font-semibold mb-2">防止无限嵌套</h4>
                <p className="text-text-secondary text-sm">
                  子 Agent 的工具白名单 <span className="text-accent">不包含 AgentTool</span>。
                  这意味着子 Agent 不能再启动子 Agent——硬性阻止无限递归。
                  Feature flag <code className="text-accent">FORK_SUBAGENT</code> 控制 Fork 模式的启用。
                </p>
              </AccentCard>
            </StaggerItem>
          </StaggerContainer>
        </ModuleSection>

        {/* ════════════════════════════════════════════
            MODULE 8 — Bridge Layer
            ════════════════════════════════════════════ */}
        <ModuleSection id="dd-bridge" number={8} title="Bridge Layer — 连接层" subtitle="bridge/ — 33 文件 / bridgeMain.ts 115KB" color="green">
          <RevealSection>
            <p className="text-text-secondary leading-relaxed mb-4">
              Bridge 层是 Claude Code 从一个 CLI 工具变成 <span className="text-text-primary font-medium">多平台产品</span> 的关键。
              33 个文件、bridgeMain.ts 115KB、replBridge.ts 100KB——这是整个代码库中最大的单个目录。
              它解决的核心问题是：<span className="text-accent-green font-medium">同一个 Harness 核心，如何在 CLI、桌面应用、IDE 插件、云端运行时中运行？</span>
            </p>
          </RevealSection>

          <RevealSection>
            <Card className="mb-6">
              <p className="text-xs font-mono text-text-muted mb-3 uppercase tracking-widest">四大桥接场景</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-accent-green/10 border border-accent-green/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-accent-green font-mono text-sm font-bold">IDE Bridge</span>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    VS Code 和 JetBrains 集成。通过 Language Server Protocol 变体通信，
                    将 IDE 的编辑器状态、文件树、终端输出桥接到 Harness。
                  </p>
                  <div className="text-xs font-mono text-text-muted">
                    <p>IDE ↔ Bridge Process ↔ QueryEngine</p>
                    <p>文件变更 → 实时同步</p>
                    <p>Diff 预览 → IDE 原生 UI</p>
                  </div>
                </div>
                <div className="bg-accent-green/10 border border-accent-green/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-accent-green font-mono text-sm font-bold">Remote Exec (CCR)</span>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Cloud Agent Runtime——在云端容器中运行 Harness。
                    用户的本地客户端只负责展示，所有计算在远程执行。
                  </p>
                  <div className="text-xs font-mono text-text-muted">
                    <p>Local Client ↔ WebSocket ↔ Cloud Container</p>
                    <p>隔离的文件系统 + 网络</p>
                    <p>持久化 Session 状态</p>
                  </div>
                </div>
                <div className="bg-accent-green/10 border border-accent-green/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-accent-green font-mono text-sm font-bold">MCP Protocol</span>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Model Context Protocol 标准——让外部工具通过统一协议接入 Claude Code。
                    MCP Server 可以是本地进程，也可以是远程服务。
                  </p>
                  <div className="text-xs font-mono text-text-muted">
                    <p>Harness ↔ MCP Client ↔ MCP Server</p>
                    <p>工具发现 → 动态注册</p>
                    <p>Schema 标准化 → JSON Schema</p>
                  </div>
                </div>
                <div className="bg-accent-green/10 border border-accent-green/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-accent-green font-mono text-sm font-bold">Multi-Platform</span>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    同一 Harness 核心适配多种前端：CLI（终端）、Desktop App（Electron）、
                    Web App（浏览器）、IDE Extensions。
                  </p>
                  <div className="text-xs font-mono text-text-muted">
                    <p>CLI → stdin/stdout</p>
                    <p>Desktop → IPC</p>
                    <p>Web → HTTP/WebSocket</p>
                    <p>IDE → Extension API</p>
                  </div>
                </div>
              </div>
            </Card>
          </RevealSection>

          <RevealSection>
            <CodeBlock title="Bridge 抽象层 — 统一接口 (简化)">
{`// Bridge 接口 — 所有平台实现这个接口
interface HarnessBridge {
  // ─── 输入 ───
  onUserInput(handler: (input: string) => void): void;
  onFileChange(handler: (path: string) => void): void;

  // ─── 输出 ───
  streamToken(token: string): void;
  showToolCall(call: ToolCall): void;
  showPermissionPrompt(prompt: PermissionPrompt): Promise<Decision>;
  showDiff(diff: FileDiff): void;

  // ─── 状态同步 ───
  getWorkspaceFiles(): string[];
  getOpenEditors(): EditorState[];
  getTerminalOutput(): string;

  // ─── 生命周期 ───
  init(): Promise<void>;
  dispose(): void;
}

// CLI 实现
class CLIBridge implements HarnessBridge {
  streamToken(token: string) { process.stdout.write(token); }
  showPermissionPrompt(p: PermissionPrompt) { return inquirer.prompt(p); }
  // ...
}

// VS Code 实现
class VSCodeBridge implements HarnessBridge {
  streamToken(token: string) { this.webview.postMessage({ type: "token", token }); }
  showPermissionPrompt(p: PermissionPrompt) { return vscode.window.showQuickPick(p); }
  getOpenEditors() { return vscode.window.visibleTextEditors.map(toEditorState); }
  // ...
}

// bridgeMain.ts 115KB 的原因：
// 每个平台的适配细节不同，但核心 QueryEngine 逻辑完全相同`}
            </CodeBlock>
          </RevealSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-4 mt-6">
            <StaggerItem>
              <AccentCard color="green">
                <InsightLabel text="架构洞察" />
                <h4 className="text-text-primary font-semibold mb-2">Harness 核心与 Bridge 分离</h4>
                <p className="text-text-secondary text-sm">
                  QueryEngine、权限系统、上下文管理——所有核心逻辑不依赖任何平台 API。
                  Bridge 层是唯一接触平台 API 的地方。这使得同一份代码能在 5+ 个平台上运行。
                </p>
              </AccentCard>
            </StaggerItem>
            <StaggerItem>
              <AccentCard color="green">
                <InsightLabel text="规模洞察" />
                <h4 className="text-text-primary font-semibold mb-2">115KB 的 bridgeMain.ts</h4>
                <p className="text-text-secondary text-sm">
                  这个文件之所以大，是因为它处理了所有平台的初始化、错误恢复、
                  状态同步、进程管理、信号处理。每个平台的 edge case 都不同——
                  Windows 的路径处理、macOS 的沙箱限制、Linux 的权限模型...
                </p>
              </AccentCard>
            </StaggerItem>
            <StaggerItem>
              <AccentCard color="green">
                <InsightLabel text="扩展洞察" />
                <h4 className="text-text-primary font-semibold mb-2">MCP 是扩展的关键</h4>
                <p className="text-text-secondary text-sm">
                  MCP Protocol 让任何人都能为 Claude Code 添加工具，
                  无需修改 Harness 核心代码。这就是 Claude Code 生态快速增长的原因——
                  Bridge 层提供标准协议，社区提供工具。
                </p>
              </AccentCard>
            </StaggerItem>
          </StaggerContainer>
        </ModuleSection>

        {/* ════════════════════════════════════════════
            SUMMARY
            ════════════════════════════════════════════ */}
        <div className="py-16 md:py-24 border-t border-border/50">
          <RevealSection>
            <div className="text-center max-w-3xl mx-auto">
              <SectionTag text="RECAP" />
              <h3 className="text-2xl md:text-4xl font-bold tracking-tight mt-4 mb-6">
                八大模块，一个目标
              </h3>
              <p className="text-text-secondary leading-relaxed">
                从 Query Loop 的核心循环到 Bridge 的多平台适配，这八个模块共同实现了一件事：
                <span className="text-text-primary font-medium">让 LLM 在真实工程环境中安全、高效、可控地工作</span>。
                每个模块的设计都有明确的工程权衡——没有完美方案，只有在约束条件下的最优解。
              </p>
            </div>
          </RevealSection>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
            {[
              { num: "1", name: "Query Loop", desc: "Async Generator 循环" },
              { num: "2", name: "System Prompt", desc: "914 行动态组装" },
              { num: "3", name: "Tool System", desc: "四层 + 两级索引" },
              { num: "4", name: "Memory", desc: "三层 / 无向量检索" },
              { num: "5", name: "Permission", desc: "12K 行 / Harness 强制" },
              { num: "6", name: "Context Mgmt", desc: "四种压缩策略" },
              { num: "7", name: "Multi-Agent", desc: "三种协调模式" },
              { num: "8", name: "Bridge", desc: "33 文件 / 5+ 平台" },
            ].map((m) => (
              <StaggerItem key={m.num}>
                <Card className="text-center py-4" hoverGlow>
                  <span className="text-accent font-mono text-2xl font-bold">{m.num}</span>
                  <p className="text-text-primary text-sm font-medium mt-1">{m.name}</p>
                  <p className="text-text-muted text-xs mt-0.5">{m.desc}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
