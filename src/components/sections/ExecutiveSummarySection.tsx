"use client";
import { RevealSection, StaggerContainer, StaggerItem } from "../motion/RevealSection";

const trendCards = [
  {
    number: "01",
    title: "AI模型正在商品化",
    description:
      "GPT-4 级别的能力正在快速降价。当所有人都能用同样的引擎，引擎本身不再是竞争优势。",
  },
  {
    number: "02",
    title: "差异化来自工程化",
    description:
      "谁能更好地驾驭AI、让它真正融入业务流程，谁就拥有护城河。这是新一轮的基础设施竞赛。",
  },
  {
    number: "03",
    title: "合规与安全成为刚需",
    description:
      "金融行业对AI的监管要求日趋严格。没有权限控制和审计能力的AI方案，根本无法上线。",
  },
  {
    number: "04",
    title: "从Demo到Production的鸿沟",
    description:
      "90%的AI项目停留在演示阶段。真正投产需要完整的工程化体系，而不只是一个聪明的模型。",
  },
];

const capabilityCards = [
  {
    title: "让AI自动完成复杂工作流",
    description: "从接收任务到交付结果，AI自主规划步骤、调用工具、处理异常，无需人工逐步指导。",
    accent: "bg-accent",
  },
  {
    title: "让AI记住上下文和历史",
    description: "跨对话保留关键信息，积累业务知识。不再每次从零开始，越用越懂你的业务。",
    accent: "bg-accent-orange",
  },
  {
    title: "精确控制AI的权限边界",
    description: "像管理员工一样管理AI的权限——哪些数据能看，哪些操作需要审批，全部可配置、可审计。",
    accent: "bg-accent-green",
  },
  {
    title: "降低70%的API调用成本",
    description: "通过智能缓存和上下文压缩，大幅减少重复调用。同样的效果，成本降低一个数量级。",
    accent: "bg-accent-purple",
  },
  {
    title: "实现人机协作的最佳实践",
    description: "AI处理重复性工作，人类专注高价值判断。清晰的协作边界，效率和质量兼得。",
    accent: "bg-accent",
  },
  {
    title: "从单一AI到AI团队协作",
    description: "多个专业AI各司其职、协同配合，像一支训练有素的团队一样处理复杂业务。",
    accent: "bg-accent-orange",
  },
];

const beforeItems = [
  "简单聊天机器人",
  "需要人工全程监督",
  "每次对话从零开始",
  "API成本不可控",
];

const afterItems = [
  "自主完成端到端任务",
  "精确权限控制取代人工监督",
  "记忆上下文持续积累",
  "成本降低60-80%",
];

const roiCards = [
  {
    metric: "3-5x",
    label: "效率提升",
    description: "单人产出提升3-5倍，AI承担重复性工作，人才聚焦高价值判断",
    accent: "text-accent",
  },
  {
    metric: "60-80%",
    label: "成本节约",
    description: "API调用成本降低60-80%，通过缓存、压缩和智能路由实现",
    accent: "text-accent-orange",
  },
  {
    metric: "90%+",
    label: "风险控制",
    description: "合规事件降低90%以上，权限边界和审计链路确保每一步可追溯",
    accent: "text-accent-green",
  },
];

export function ExecutiveSummarySection() {
  return (
    <section className="py-24 md:py-32 bg-bg">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Section Header */}
        <RevealSection className="mb-20 md:mb-28 text-center">
          <span className="inline-block text-xs font-mono tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20 mb-6">
            EXECUTIVE SUMMARY
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight">
            <span className="bg-gradient-to-r from-accent to-accent-orange bg-clip-text text-transparent">
              Harness Engineering
            </span>
            <br />
            <span className="text-text-primary">高管视角</span>
          </h2>
        </RevealSection>

        {/* 一句话理解 */}
        <RevealSection className="mb-24 md:mb-32">
          <div className="max-w-[900px] mx-auto text-center">
            <p className="text-text-muted font-mono text-sm tracking-widest mb-6">
              一句话理解 HARNESS
            </p>
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary leading-snug tracking-tight">
              如果AI大模型是
              <span className="text-accent">引擎</span>
              ，那么Harness就是围绕引擎打造的
              <span className="bg-gradient-to-r from-accent to-accent-orange bg-clip-text text-transparent">
                整辆车
              </span>
              。
            </p>
            <p className="text-text-secondary text-lg md:text-xl mt-6 max-w-[65ch] mx-auto leading-relaxed">
              引擎再强大，没有方向盘、刹车、仪表盘和导航系统，它也无法安全地把你送到目的地。Harness
              Engineering 就是为AI构建这一切的工程学科。
            </p>
          </div>
        </RevealSection>

        {/* 为什么现在要关注 */}
        <RevealSection className="mb-6">
          <p className="text-text-muted font-mono text-sm tracking-widest mb-2 text-center">
            WHY NOW
          </p>
          <h3 className="text-2xl md:text-4xl font-bold text-text-primary text-center tracking-tight">
            为什么现在要关注
          </h3>
        </RevealSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-24 md:mb-32">
          {trendCards.map((card) => (
            <StaggerItem key={card.number}>
              <div className="bg-bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow h-full">
                <span className="text-5xl font-black text-accent/10 font-mono leading-none">
                  {card.number}
                </span>
                <h4 className="text-xl md:text-2xl font-bold text-text-primary mt-3 mb-3 tracking-tight">
                  {card.title}
                </h4>
                <p className="text-text-secondary leading-relaxed">
                  {card.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* 它能做什么 */}
        <RevealSection className="mb-6">
          <p className="text-text-muted font-mono text-sm tracking-widest mb-2 text-center">
            CAPABILITIES
          </p>
          <h3 className="text-2xl md:text-4xl font-bold text-text-primary text-center tracking-tight">
            它能做什么
          </h3>
          <p className="text-text-secondary text-center mt-3 max-w-[55ch] mx-auto">
            不谈技术细节，只看业务价值
          </p>
        </RevealSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-24 md:mb-32">
          {capabilityCards.map((card) => (
            <StaggerItem key={card.title}>
              <div className="bg-bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow h-full relative overflow-hidden">
                <div
                  className={`absolute top-0 left-0 w-full h-1 ${card.accent}`}
                />
                <h4 className="text-lg md:text-xl font-bold text-text-primary mb-3 tracking-tight">
                  {card.title}
                </h4>
                <p className="text-text-secondary leading-relaxed text-[15px]">
                  {card.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* 行业标杆对比 */}
        <RevealSection className="mb-6">
          <p className="text-text-muted font-mono text-sm tracking-widest mb-2 text-center">
            BEFORE vs AFTER
          </p>
          <h3 className="text-2xl md:text-4xl font-bold text-text-primary text-center tracking-tight">
            行业标杆对比
          </h3>
        </RevealSection>

        <RevealSection className="mb-24 md:mb-32" delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[1000px] mx-auto">
            {/* Before */}
            <div className="bg-bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-text-muted/40" />
                <span className="font-mono text-sm text-text-muted tracking-widest">
                  BEFORE
                </span>
              </div>
              <p className="text-text-muted text-sm mb-5">
                没有 Harness Engineering
              </p>
              <ul className="space-y-4">
                {beforeItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-text-secondary"
                  >
                    <span className="text-text-muted mt-0.5 shrink-0">
                      &mdash;
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div className="bg-bg-card border border-accent/20 rounded-2xl p-8 md:p-10 shadow-sm ring-1 ring-accent/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="font-mono text-sm text-accent tracking-widest">
                  AFTER
                </span>
              </div>
              <p className="text-accent/70 text-sm mb-5">
                完整 Harness Engineering 体系
              </p>
              <ul className="space-y-4">
                {afterItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-text-primary"
                  >
                    <span className="text-accent mt-0.5 shrink-0">
                      &rarr;
                    </span>
                    <span className="leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </RevealSection>

        {/* 投资回报视角 */}
        <RevealSection className="mb-6">
          <p className="text-text-muted font-mono text-sm tracking-widest mb-2 text-center">
            RETURN ON INVESTMENT
          </p>
          <h3 className="text-2xl md:text-4xl font-bold text-text-primary text-center tracking-tight">
            投资回报视角
          </h3>
        </RevealSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {roiCards.map((card) => (
            <StaggerItem key={card.label}>
              <div className="bg-bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm text-center">
                <p
                  className={`text-5xl md:text-6xl font-black tracking-tighter ${card.accent}`}
                >
                  {card.metric}
                </p>
                <p className="text-text-primary font-bold text-lg mt-3 mb-2">
                  {card.label}
                </p>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
