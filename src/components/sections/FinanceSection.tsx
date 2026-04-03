"use client";
import { RevealSection, StaggerContainer, StaggerItem } from "../motion/RevealSection";
import { SectionHeader } from "../ui/SectionHeader";
import { AccentCard } from "../ui/Card";

const scenarios = [
  {
    icon: "📊",
    title: "投研报告智能生成",
    color: "blue" as const,
    pain: "研究员花 60%+ 时间在数据收集和格式化上，真正的分析思考时间被压缩。每天被 Wind 数据导出、图表制作、格式调整消耗。",
    solution: "AI 自动连接 Wind/Bloomberg API 抓取数据 → 生成标准图表 → 按模板生成初稿。研究员只需审核、修改观点和结论。",
    modules: [
      { name: "Tool System", role: "连接 Wind/Bloomberg/万得 API，自动拉取财务数据、行情数据" },
      { name: "Memory", role: "记住行业分析框架、历史报告模板、研究员偏好" },
      { name: "Permission", role: "控制数据访问级别 — 内部数据 vs 公开数据 vs 客户专属数据" },
      { name: "Context Mgmt", role: "处理长篇年报/招股书，压缩提取关键信息" },
    ],
    impact: "报告产出效率 3x，研究员聚焦高价值分析判断",
  },
  {
    icon: "⚖️",
    title: "合规审查自动化",
    color: "red" as const,
    pain: "合规审查依赖人工逐条核对法规条文，耗时长、容易遗漏。新规发布后响应慢，全量文档回溯检查成本极高。",
    solution: "AI 自动比对最新法规库 → 逐条核对业务文件 → 标注违规风险等级 → 生成合规审查报告。权限系统确保审查操作可追溯。",
    modules: [
      { name: "Permission", role: "合规审查必须有完整审批链，每一步操作可追溯、可审计" },
      { name: "Context Mgmt", role: "法规文件动辄数万字，需要智能压缩和分段处理" },
      { name: "Memory", role: "积累过往审查案例和监管反馈，形成机构知识" },
      { name: "Multi-Agent", role: "不同法规领域（证券法、反洗钱、信息披露）分给专业子 Agent" },
    ],
    impact: "审查效率 5x，漏检率降低 80%，新规响应从周级到天级",
  },
  {
    icon: "🤝",
    title: "智能客服升级",
    color: "green" as const,
    pain: "传统客服机器人只能回答预设 FAQ，复杂问题（账户查询、产品咨询、投诉处理）需要转人工。客户等待时间长，体验差。",
    solution: "AI 客服能实时查询账户信息、调用交易系统查持仓、理解多轮对话上下文。像真人客服一样处理多步骤复杂问题。",
    modules: [
      { name: "Tool System", role: "连接 CRM、交易系统、产品库，实时查询客户数据" },
      { name: "Permission", role: "客户数据访问分级 — 基本信息 vs 资产信息 vs 交易记录" },
      { name: "Multi-Agent", role: "复杂问题拆分：账户子 Agent + 产品子 Agent + 投诉子 Agent" },
      { name: "Memory", role: "记住客户历史交互、偏好、VIP 等级，提供个性化服务" },
    ],
    impact: "人工转接率降低 60%，客户满意度提升，7×24 服务覆盖",
  },
  {
    icon: "💻",
    title: "IT 开发效率提升",
    color: "purple" as const,
    pain: "证券公司 IT 部门面临大量系统维护和新需求开发压力，人力缺口大。内部系统技术栈复杂，新人上手周期长。",
    solution: "部署 Claude Code 级别的 AI 编程助手，注入公司开发规范和内部代码库。AI 理解业务系统架构，辅助编码、调试、代码审查。",
    modules: [
      { name: "System Prompt", role: "注入公司编码规范、技术栈要求、安全合规标准" },
      { name: "Memory", role: "记住项目架构、模块关系、历史技术决策" },
      { name: "Tool System", role: "连接 Git/CI/CD/JIRA，直接操作开发工具链" },
      { name: "Permission", role: "代码仓库访问控制，生产环境操作审批" },
    ],
    impact: "开发效率 3-5x，新人上手周期缩短 50%",
  },
  {
    icon: "🛡️",
    title: "风险监控与预警",
    color: "orange" as const,
    pain: "市场数据海量，人工监控覆盖面有限。异常波动预警依赖固定阈值规则，缺乏智能判断。夜间和节假日监控薄弱。",
    solution: "AI 持续监控市场行情数据 → 多维度异常检测 → 智能预警分级 → 自动生成风险报告并通知相关人员。",
    modules: [
      { name: "Loop Control", role: "7×24 持续运行监控循环，不间断数据采集与分析" },
      { name: "Tool System", role: "连接行情系统、交易系统、舆情监控，多源数据融合" },
      { name: "Multi-Agent", role: "不同资产类别（股票/债券/衍生品）并行监控，独立专业判断" },
      { name: "Memory", role: "积累历史异常案例，提升识别准确率" },
    ],
    impact: "预警响应从小时级到分钟级，覆盖从 8 小时到 24 小时",
  },
  {
    icon: "🔍",
    title: "投行项目尽调",
    color: "purple" as const,
    pain: "尽职调查需要审阅海量文件（财报、合同、公告、法律意见书），人力密集、周期长。关键信息容易遗漏，交叉验证靠人工。",
    solution: "AI 批量阅读项目文件 → 提取关键条款和数据点 → 自动交叉验证 → 标注矛盾和风险点 → 生成结构化尽调报告。",
    modules: [
      { name: "Context Mgmt", role: "处理超长文档（年报 200+ 页），智能分段和信息提取" },
      { name: "Memory", role: "积累尽调经验，形成行业标准检查清单" },
      { name: "Permission", role: "项目文件高度敏感，严格的访问控制和信息隔离" },
      { name: "Multi-Agent", role: "财务/法律/业务并行分析，最后汇总交叉验证" },
    ],
    impact: "尽调周期缩短 50%，关键风险识别覆盖率大幅提升",
  },
];

const phases = [
  {
    phase: "Phase 1",
    time: "1-2 月",
    title: "内部试点",
    desc: "IT 部门部署 AI 编程助手，合规部门试用文档审查工具。建立信心，积累经验。",
    color: "text-text-muted",
  },
  {
    phase: "Phase 2",
    time: "3-4 月",
    title: "场景拓展",
    desc: "投研报告辅助 POC，智能客服原型。开始建设内部 Harness 基础能力（工具接入、权限体系）。",
    color: "text-accent-orange",
  },
  {
    phase: "Phase 3",
    time: "5-8 月",
    title: "产品化上线",
    desc: "智能客服正式上线，风控监控系统部署。Harness 平台化，支持多业务线接入。",
    color: "text-accent-green",
  },
  {
    phase: "Phase 4",
    time: "9-12 月",
    title: "规模化赋能",
    desc: "全业务线 AI 赋能，投行尽调、资管分析等高价值场景上线。建立行业领先的 AI 中台。",
    color: "text-accent",
  },
];

export function FinanceSection() {
  return (
    <section className="py-20 md:py-32 border-t border-border" id="finance">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <SectionHeader
          tag="金融行业应用"
          title="Harness Engineering × 证券行业"
          subtitle="从投研到客服，从合规到交易 — AI 赋能的下一个突破口不在模型，在编排"
        />

        {/* Why securities firms need this */}
        <RevealSection className="mb-16">
          <h3 className="text-xl font-bold mb-6">为什么证券公司特别需要好的 Harness</h3>
          <StaggerContainer className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: "🔒",
                title: "合规要求极高",
                desc: "每一步 AI 操作都需要可追溯、可审计。普通 AI 做不到，需要 Harness 层的权限系统和完整日志。金融监管对 AI 的要求只会越来越严。",
                color: "red" as const,
              },
              {
                icon: "📄",
                title: "文档处理密集",
                desc: "研报、合同、法规、年报动辄上万字。裸 AI 处理长文档会丢失信息或产生幻觉。需要 Harness 的上下文管理和压缩能力。",
                color: "orange" as const,
              },
              {
                icon: "🔗",
                title: "系统集成复杂",
                desc: "Wind、Bloomberg、OA、交易系统、CRM、核心系统… AI 要真正有用，必须能连接这些系统。需要 Harness 的工具系统和 MCP 协议。",
                color: "blue" as const,
              },
            ].map((item, i) => (
              <StaggerItem key={i}>
                <AccentCard side="top" color={item.color} className="h-full">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h4 className="font-bold text-text-primary mb-2">{item.title}</h4>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
                </AccentCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </RevealSection>

        {/* Six scenarios */}
        <RevealSection className="mb-16">
          <h3 className="text-xl font-bold mb-2">六大应用场景</h3>
          <p className="text-text-secondary text-sm mb-8">每个场景都标注了关键的 Harness 模块，展示编排层如何将 AI 能力落地到具体业务</p>

          <div className="space-y-8">
            {scenarios.map((s, i) => (
              <div key={i} className="bg-bg-card rounded-xl border border-border overflow-hidden">
                {/* Header */}
                <div className={`px-6 py-4 border-b border-border flex items-center gap-3 accent-top-${s.color}`}>
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <h4 className="font-bold text-text-primary text-lg">{s.title}</h4>
                    <span className={`text-xs font-mono text-accent-${s.color}`}>场景 {String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="ml-auto">
                    <span className={`text-xs font-mono px-2 py-1 rounded bg-accent-${s.color}/10 text-accent-${s.color}`}>
                      {s.impact.split("，")[0]}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Pain + Solution */}
                  <div className="grid md:grid-cols-2 gap-5 mb-5">
                    <div className="rounded-lg border border-border p-4 bg-accent-red/5">
                      <h5 className="text-xs font-mono text-accent-red mb-2 font-bold">现状痛点</h5>
                      <p className="text-text-secondary text-sm leading-relaxed">{s.pain}</p>
                    </div>
                    <div className="rounded-lg border border-border p-4 bg-accent-green/5">
                      <h5 className="text-xs font-mono text-accent-green mb-2 font-bold">Harness 方案</h5>
                      <p className="text-text-secondary text-sm leading-relaxed">{s.solution}</p>
                    </div>
                  </div>

                  {/* Key modules */}
                  <h5 className="text-xs font-mono text-text-muted mb-3 font-bold">关键 HARNESS 模块</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {s.modules.map((m, j) => (
                      <div key={j} className="rounded-lg border border-border p-3">
                        <div className={`text-xs font-mono font-bold text-accent-${s.color} mb-1`}>{m.name}</div>
                        <p className="text-text-muted text-xs leading-relaxed">{m.role}</p>
                      </div>
                    ))}
                  </div>

                  {/* Impact */}
                  <div className={`rounded-lg bg-accent-${s.color}/10 px-4 py-2.5`}>
                    <span className="text-xs font-mono text-text-muted mr-2">预期效果:</span>
                    <span className={`text-sm font-semibold text-accent-${s.color}`}>{s.impact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* Implementation roadmap */}
        <RevealSection className="mb-16">
          <h3 className="text-xl font-bold mb-6">落地路线图</h3>
          <div className="relative">
            <div className="absolute left-3 top-2 bottom-2 w-px bg-border md:left-1/2 md:-translate-x-px" />
            {phases.map((p, i) => (
              <div key={i} className="relative pl-10 mb-8 md:pl-0 md:grid md:grid-cols-2 md:gap-8">
                <div className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-current md:left-1/2 md:-translate-x-1.5 ${p.color}`}>
                  <div className="w-full h-full rounded-full bg-current" />
                </div>
                <div className={`${i % 2 === 1 ? "md:col-start-2" : "md:text-right"}`}>
                  <div className="flex items-center gap-2 md:justify-end">
                    <span className={`font-mono text-xs ${p.color}`}>{p.phase}</span>
                    <span className="text-text-muted text-xs">({p.time})</span>
                  </div>
                  <h4 className="font-bold mt-1">{p.title}</h4>
                  <p className="text-text-secondary text-sm mt-1 max-w-md">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* Key decisions */}
        <RevealSection>
          <h3 className="text-xl font-bold mb-6">关键决策建议</h3>
          <StaggerContainer className="grid md:grid-cols-3 gap-5">
            {[
              {
                title: "自研 Harness vs 采购模型",
                desc: "核心 Harness 能力建议自研 — 安全可控、贴合业务。AI 模型通过 API 采购即可，不需要自己训练。Harness 是壁垒，模型是商品。",
                color: "blue" as const,
                tag: "BUILD vs BUY",
              },
              {
                title: "投入优先级",
                desc: "先投 Harness 工程能力（人才 + 平台），再投模型选型和微调。好的 Harness 让任何模型都能发挥更好，模型可以随时切换。",
                color: "orange" as const,
                tag: "PRIORITY",
              },
              {
                title: "安全底线",
                desc: "金融级 AI 必须有独立于模型的权限系统。不能依赖模型的\u201C自觉\u201D来保证安全。权限检查、数据隔离、操作审计必须在 Harness 层强制执行。",
                color: "red" as const,
                tag: "SECURITY",
              },
            ].map((d, i) => (
              <StaggerItem key={i}>
                <AccentCard side="top" color={d.color} className="h-full">
                  <span className={`text-[10px] font-mono text-accent-${d.color} bg-accent-${d.color}/10 px-2 py-0.5 rounded`}>{d.tag}</span>
                  <h4 className="font-bold text-text-primary mt-3 mb-2">{d.title}</h4>
                  <p className="text-text-secondary text-sm leading-relaxed">{d.desc}</p>
                </AccentCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="mt-6">
            <AccentCard side="left" color="blue">
              <p className="text-text-secondary text-sm">
                <span className="text-accent font-semibold">核心观点：</span>
                证券公司的 AI 竞争力不在于谁先用上最新的模型，而在于谁的 Harness 能把 AI 能力安全、合规、高效地嵌入到每一个业务场景中。
                模型是发动机，所有人都能买到同一台。Harness 是你自己造的车 — 这才是差异化。
              </p>
            </AccentCard>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
