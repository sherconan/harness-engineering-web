"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export function Card({
  children,
  className = "",
  accent,
  hoverGlow = false,
}: {
  children: ReactNode;
  className?: string;
  accent?: "blue" | "green" | "orange" | "purple" | "red";
  hoverGlow?: boolean;
}) {
  const accentClass = accent ? `accent-top-${accent}` : "";
  return (
    <motion.div
      whileHover={hoverGlow ? { scale: 1.02, y: -2 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`bg-bg-card rounded-xl border border-border p-5 ${accentClass} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function AccentCard({
  children,
  className = "",
  side = "left",
  color = "blue",
}: {
  children: ReactNode;
  className?: string;
  side?: "left" | "top";
  color?: "blue" | "green" | "orange" | "purple" | "red";
}) {
  const accentClass = side === "left" ? `accent-left-${color}` : `accent-top-${color}`;
  return (
    <div className={`bg-bg-card rounded-xl border border-border p-5 ${accentClass} ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({
  value,
  label,
  color = "accent",
}: {
  value: string;
  label: string;
  color?: string;
}) {
  return (
    <div className="bg-bg-card rounded-xl border border-border p-5 text-center accent-top-blue">
      <div className={`text-3xl md:text-4xl font-bold font-mono text-${color}`}>{value}</div>
      <div className="text-text-secondary text-sm mt-1">{label}</div>
    </div>
  );
}
