"use client";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-accent/[0.06] blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full bg-accent-orange/[0.06] blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-accent" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-accent text-sm tracking-widest mb-6">
            DEEP DIVE INTO AGENT ORCHESTRATION
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
            HARNESS
            <br />
            <span className="gradient-text">ENGINEERING</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8"
        >
          <div className="w-16 h-0.5 bg-accent mb-6" />
          <p className="text-xl md:text-2xl text-text-secondary max-w-[55ch] leading-relaxed">
            从 Claude Code 源码深度解析
            <br className="hidden md:block" />
            顶级 Agent 编排架构
          </p>
          <p className="font-mono text-accent/70 text-sm mt-4 italic">
            When the Model is Not Enough
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 bg-bg-card border border-border rounded-xl p-6 max-w-2xl accent-left-blue"
        >
          <p className="text-text-secondary text-base leading-relaxed">
            &ldquo;为什么同样用 Claude Opus 4，Claude Code 的表现远超你自己写的 Agent？&rdquo;
          </p>
          <p className="mt-3 text-base">
            <span className="text-text-muted">答案不在模型</span>
            <span className="text-text-muted mx-2">&rarr;</span>
            <span className="text-accent-green font-semibold">在 Harness</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-5 h-8 border-2 border-text-muted/30 rounded-full flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1 h-1 rounded-full bg-text-muted/50"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
