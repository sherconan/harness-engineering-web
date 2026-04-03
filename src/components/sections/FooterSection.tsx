"use client";
import { motion } from "framer-motion";

export function FooterSection() {
  return (
    <section className="py-24 md:py-36 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-accent/[0.05] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-orange/[0.05] blur-3xl" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-2xl md:text-4xl text-text-secondary italic leading-relaxed max-w-3xl mx-auto">
            &ldquo;The model is the engine.
            <br />
            <span className="text-accent font-semibold">The harness is the car.</span>&rdquo;
          </p>

          <p className="text-xl md:text-2xl font-bold mt-8">
            Build better cars.
          </p>

          <div className="w-12 h-px bg-text-muted/30 mx-auto mt-10 mb-6" />

          <p className="text-text-muted text-sm font-mono">
            Harness Engineering Research &middot; 2026.04
          </p>
        </motion.div>
      </div>
    </section>
  );
}
