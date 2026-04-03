"use client";
import { RevealSection, StaggerContainer, StaggerItem } from "../motion/RevealSection";
import { SectionHeader } from "../ui/SectionHeader";
import { AccentCard } from "../ui/Card";

export function Part1Section() {
  return (
    <section className="py-20 md:py-32" id="what">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <SectionHeader
          tag="PART 1"
          title="什么是 Harness Engineering"
          subtitle="Harness = 包裹在 LLM 外面的编排层，负责 &ldquo;喂什么进去、怎么执行、怎么循环&rdquo;"
        />

        {/* Definition */}
        <StaggerContainer className="grid md:grid-cols-2 gap-5 mb-16">
          <StaggerItem>
            <AccentCard side="top" color="blue" className="h-full">
              <div className="text-accent text-sm font-mono mb-2">MODEL</div>
              <h3 className="text-xl font-bold mb-2">模型 = 发动机</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                推理能力、语言理解、代码生成。通过训练获得。决定了天花板有多高。
              </p>
            </AccentCard>
          </StaggerItem>
          <StaggerItem>
            <AccentCard side="top" color="green" className="h-full">
              <div className="text-accent-green text-sm font-mono mb-2">HARNESS</div>
              <h3 className="text-xl font-bold mb-2">Harness = 整辆车</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                底盘、变速箱、方向盘、安全气囊 = System Prompt + Tools + Memory + Permissions + Loop Control。决定了能发挥到几成。
              </p>
            </AccentCard>
          </StaggerItem>
        </StaggerContainer>

        {/* Timeline */}
        <RevealSection className="mb-16">
          <h3 className="text-xl font-bold mb-8 text-text-secondary">演进时间线</h3>
          <div className="relative">
            <div className="absolute left-3 top-2 bottom-2 w-px bg-border md:left-1/2 md:-translate-x-px" />
            {[
              { year: "2023", title: "LLM 裸调用时代", desc: "一问一答，无工具调用能力", color: "text-text-muted" },
              { year: "2024 H1", title: "Tool Use / Function Calling", desc: "ReAct 模式出现，模型开始操作外部世界", color: "text-accent-orange" },
              { year: "2024 H2", title: "Agent 框架涌现", desc: "LangChain, AutoGPT — 粗糙但有野心的 Harness 雏形", color: "text-accent-purple" },
              { year: "2025", title: "产品级 Harness", desc: "Claude Code, Cursor, Windsurf — 工程化、产品化", color: "text-accent-green" },
              { year: "2026", title: "Harness Engineering", desc: "成为独立工程学科，从 Prompt Engineering 进化", color: "text-accent" },
            ].map((item, i) => (
              <div key={i} className="relative pl-10 mb-6 md:pl-0 md:grid md:grid-cols-2 md:gap-8">
                <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-current md:left-1/2 md:-translate-x-1.5" style={{ color: `var(--color-${item.color.replace("text-", "")})` }}>
                  <div className="w-full h-full rounded-full bg-current" />
                </div>
                <div className={`md:text-right ${i % 2 === 1 ? "md:col-start-2" : ""}`}>
                  <span className={`font-mono text-sm ${item.color}`}>{item.year}</span>
                  <h4 className="font-semibold mt-0.5">{item.title}</h4>
                  <p className="text-text-secondary text-sm mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* Three Layer Architecture */}
        <RevealSection className="mb-16">
          <h3 className="text-xl font-bold mb-6 text-text-secondary">三层架构关系</h3>
          <div className="space-y-3">
            {[
              { name: "模型层 Model", desc: "推理能力，通过训练获得", color: "purple", arrow: "做决策 ↓" },
              { name: "编排层 Harness", desc: "System Prompt + Tools + Memory + Permissions + 循环控制", color: "blue", arrow: "去执行 ↓" },
              { name: "运行时层 Runtime", desc: "操作系统 / 文件系统 / 网络 / 沙箱", color: "green", arrow: null },
            ].map((layer, i) => (
              <div key={i}>
                <AccentCard side="left" color={layer.color as "purple" | "blue" | "green"} className="flex items-center gap-6">
                  <div className="shrink-0">
                    <div className={`text-lg font-bold text-accent-${layer.color}`}>{layer.name}</div>
                  </div>
                  <div className="text-text-secondary text-sm">{layer.desc}</div>
                </AccentCard>
                {layer.arrow && (
                  <div className="text-center text-text-muted text-xs py-1 font-mono">{layer.arrow}</div>
                )}
              </div>
            ))}
          </div>
        </RevealSection>

        {/* Why it matters */}
        <RevealSection>
          <h3 className="text-xl font-bold mb-6 text-text-secondary">为什么 Harness 很重要</h3>
          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <AccentCard side="top" color="red">
              <p className="text-text-secondary text-sm">Claude Opus 裸调用</p>
              <div className="text-4xl md:text-5xl font-bold font-mono text-accent-red mt-1">~25%</div>
              <p className="text-text-muted text-xs font-mono mt-1">SWE-bench Verified</p>
            </AccentCard>
            <AccentCard side="top" color="green">
              <p className="text-text-secondary text-sm">Claude Code (with Harness)</p>
              <div className="text-4xl md:text-5xl font-bold font-mono text-accent-green mt-1">~72%</div>
              <p className="text-text-muted text-xs font-mono mt-1">SWE-bench Verified</p>
            </AccentCard>
          </div>
          <AccentCard side="left" color="blue">
            <p className="text-text-secondary text-sm">
              <span className="text-accent font-semibold">同一个模型，3x 效果差距。</span>
              <br />
              模型的天花板由训练决定，但模型能发挥到几成由 Harness 决定。
            </p>
          </AccentCard>
        </RevealSection>

        {/* Common Misconceptions */}
        <RevealSection className="mt-16 mb-16">
          <h3 className="text-xl font-bold mb-6 text-text-secondary">常见误区</h3>
          <StaggerContainer className="grid md:grid-cols-2 gap-5">
            {[
              {
                myth: "用更好的模型就够了",
                reality: "模型能力有天花板，Harness 决定发挥几成。同一个 Sonnet 模型，裸调用和 Claude Code 差距是 3x。",
                icon: "🧠",
                color: "red" as const,
              },
              {
                myth: "Prompt Engineering = Harness Engineering",
                reality: "PE 是 Harness 的一个子集。Harness 还包括工具体系、权限管理、循环控制、上下文管理、记忆系统等工程模块。",
                icon: "🔤",
                color: "orange" as const,
              },
              {
                myth: "框架可以替代 Harness",
                reality: "LangChain/AutoGPT 是积木，不是产品级 Harness。Claude Code 仅权限系统就有 12,000 行代码，还有 AI 分类器做风险判定。",
                icon: "🧱",
                color: "purple" as const,
              },
              {
                myth: "Harness 很快会被模型吞掉",
                reality: "安全权限层、API 编排循环、工具执行接口是物理架构约束，不会消失。模型越强，安全层越重要。",
                icon: "⏳",
                color: "blue" as const,
              },
            ].map((item, i) => (
              <StaggerItem key={i}>
                <AccentCard side="left" color={item.color} className="h-full">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-accent-${item.color} font-mono text-xs px-2 py-0.5 rounded bg-accent-${item.color}/10`}>MYTH</span>
                        <span className="text-text-primary font-semibold text-sm">&ldquo;{item.myth}&rdquo;</span>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed">{item.reality}</p>
                    </div>
                  </div>
                </AccentCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </RevealSection>

        {/* Evidence / Data */}
        <RevealSection className="mb-16">
          <h3 className="text-xl font-bold mb-6 text-text-secondary">数据支撑</h3>
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {[
              {
                label: "SWE-bench Verified",
                before: "~25%",
                after: "~72%",
                note: "裸模型 → Claude Code",
                color: "green" as const,
              },
              {
                label: "Terminal Benchmark",
                before: null,
                after: "#1",
                note: "终端任务中领先 Cursor / Windsurf",
                color: "blue" as const,
              },
              {
                label: "Token 效率",
                before: null,
                after: "3-5x",
                note: "好的 Harness = 更少重试 = 更少浪费",
                color: "orange" as const,
              },
              {
                label: "开发者采用",
                before: null,
                after: "~30%+",
                note: "专业开发者使用 AI Coding 工具",
                color: "purple" as const,
              },
            ].map((stat, i) => (
              <StaggerItem key={i}>
                <AccentCard side="top" color={stat.color} className="h-full text-center">
                  <p className="text-text-secondary text-xs font-mono mb-2">{stat.label}</p>
                  {stat.before && (
                    <span className="text-text-muted text-lg font-mono line-through mr-2">{stat.before}</span>
                  )}
                  <span className={`text-3xl font-bold font-mono text-accent-${stat.color}`}>{stat.after}</span>
                  <p className="text-text-muted text-xs mt-2">{stat.note}</p>
                </AccentCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <AccentCard side="left" color="blue">
            <p className="text-text-secondary text-sm">
              <span className="text-accent font-semibold">数据说明：</span>所有基准测试结果来源于公开发布的评测。
              SWE-bench 是行业标准的代码修复能力评测，Terminal Benchmark 由第三方独立测试。
              Token 效率提升主要来自 Prompt Caching、上下文压缩和精准的工具调用减少的重试次数。
            </p>
          </AccentCard>
        </RevealSection>

        {/* F1 Analogy */}
        <RevealSection className="mb-16">
          <h3 className="text-xl font-bold mb-6 text-text-secondary">一个类比帮你理解</h3>
          <AccentCard side="top" color="blue" className="mb-6">
            <p className="text-text-secondary text-sm leading-relaxed">
              <span className="text-accent font-semibold">F1 赛车类比：</span>
              同一台 Ferrari 引擎，Red Bull 的底盘 + 空气动力学设计让它赢得世界冠军。
              发动机的马力由制造商决定（= 模型训练），但比赛成绩由整车工程决定（= Harness Engineering）。
            </p>
          </AccentCard>
          <StaggerContainer className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { part: "发动机", mapping: "模型能力", desc: "训练获得的推理/生成能力", color: "purple" as const },
              { part: "底盘", mapping: "System Prompt", desc: "行为校准与角色定义", color: "blue" as const },
              { part: "变速箱", mapping: "Tool System", desc: "能力扩展与外部交互", color: "green" as const },
              { part: "安全系统", mapping: "Permission", desc: "安全边界与风险控制", color: "red" as const },
              { part: "遥测系统", mapping: "Memory + Context", desc: "状态管理与记忆持久化", color: "orange" as const },
              { part: "车队策略", mapping: "Loop Control", desc: "执行编排与决策循环", color: "purple" as const },
            ].map((item, i) => (
              <StaggerItem key={i}>
                <div className="bg-bg-card rounded-xl border border-border p-4 h-full text-center">
                  <div className="text-2xl mb-2">🏎️</div>
                  <div className="text-text-muted text-xs font-mono mb-1">{item.part}</div>
                  <div className={`text-accent-${item.color} font-bold text-sm mb-1`}>{item.mapping}</div>
                  <p className="text-text-secondary text-xs leading-relaxed">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </RevealSection>
      </div>
    </section>
  );
}
