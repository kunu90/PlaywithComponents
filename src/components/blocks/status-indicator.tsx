"use client"

import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
  ShieldAlertIcon,
  XCircleIcon,
  ZapIcon,
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export type StatusLevel =
  | "normal"
  | "info"
  | "low"
  | "medium"
  | "high"
  | "critical"

export type StatusStepData = {
  level: StatusLevel
  title: string
  description?: string
}

export type StatusIndicatorProps = {
  title?: string
  steps: StatusStepData[]
  className?: string
}

// ─── Level config ─────────────────────────────────────────────────────────────
// Each level maps to a Lucide icon, Tailwind colour classes, and a label.

const LEVEL_CONFIG: Record<
  StatusLevel,
  {
    icon: React.ElementType
    iconClass: string
    ringClass: string
    badgeClass: string
    label: string
  }
> = {
  normal: {
    icon: CheckCircle2Icon,
    iconClass: "text-emerald-500",
    ringClass: "bg-emerald-500/10 ring-emerald-500/30",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    label: "Normal",
  },
  info: {
    icon: InfoIcon,
    iconClass: "text-sky-500",
    ringClass: "bg-sky-500/10 ring-sky-500/30",
    badgeClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    label: "Info",
  },
  low: {
    icon: ZapIcon,
    iconClass: "text-teal-500",
    ringClass: "bg-teal-500/10 ring-teal-500/30",
    badgeClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    label: "Low",
  },
  medium: {
    icon: AlertTriangleIcon,
    iconClass: "text-amber-500",
    ringClass: "bg-amber-500/10 ring-amber-500/30",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    label: "Medium",
  },
  high: {
    icon: AlertTriangleIcon,
    iconClass: "text-orange-500",
    ringClass: "bg-orange-500/10 ring-orange-500/30",
    badgeClass: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    label: "High",
  },
  critical: {
    icon: XCircleIcon,
    iconClass: "text-red-500",
    ringClass: "bg-red-500/10 ring-red-500/30",
    badgeClass: "bg-red-500/10 text-red-600 dark:text-red-400",
    label: "Critical",
  },
}

// ─── StatusStep ───────────────────────────────────────────────────────────────

function StatusStep({
  level,
  title,
  description,
  index = 0,
}: StatusStepData & { index?: number }) {
  const cfg    = LEVEL_CONFIG[level]
  const Icon   = cfg.icon
  const isCrit = level === "critical"
  const isHigh = level === "high"

  return (
    <motion.div
      initial={{ x: -18, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        delay: index * 0.09,
        type: "spring",
        stiffness: 300,
        damping: 24,
      }}
      className="flex items-start gap-4 rounded-xl border border-border/40 bg-card/30 px-4 py-3 backdrop-blur-sm"
    >
      {/* Animated icon bubble */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: index * 0.09 + 0.12,
          type: "spring",
          stiffness: 400,
          damping: 18,
        }}
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ring-1",
          cfg.ringClass
        )}
      >
        {/* Critical: continuous radial pulse ring */}
        {isCrit && (
          <motion.span
            animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
            className="absolute size-8 rounded-full bg-red-500/30"
          />
        )}

        <motion.div
          animate={
            isCrit
              ? { scale: [1, 1.18, 1] }
              : isHigh
                ? { rotate: [0, -8, 8, 0] }
                : {}
          }
          transition={
            isCrit
              ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
              : isHigh
                ? { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }
                : {}
          }
        >
          <Icon className={cn("size-4", cfg.iconClass)} />
        </motion.div>
      </motion.div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-foreground">{title}</span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              cfg.badgeClass
            )}
          >
            {cfg.label}
          </span>
        </div>
        {description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.09 + 0.25 }}
            className="mt-0.5 truncate text-xs text-muted-foreground"
          >
            {description}
          </motion.p>
        )}
      </div>

      {/* Live dot for critical/high */}
      {(isCrit || isHigh) && (
        <motion.span
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          className={cn(
            "mt-1.5 size-2 shrink-0 rounded-full",
            isCrit ? "bg-red-500" : "bg-orange-500"
          )}
        />
      )}
    </motion.div>
  )
}

// ─── StatusIndicator (container) ─────────────────────────────────────────────

function StatusIndicator({ title = "System Status", steps, className }: StatusIndicatorProps) {
  // Summary badge: highest severity in the list
  const SEVERITY_ORDER: StatusLevel[] = ["critical", "high", "medium", "low", "info", "normal"]
  const highest = SEVERITY_ORDER.find((lvl) => steps.some((s) => s.level === lvl)) ?? "normal"
  const highestCfg = LEVEL_CONFIG[highest]
  const HighestIcon = highestCfg.icon

  return (
    <div className={cn("w-full max-w-lg space-y-3", className)}>
      {/* Panel header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center justify-between rounded-xl border border-border/40 bg-card/40 px-4 py-3 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2.5">
          <ShieldAlertIcon className="size-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
            highestCfg.badgeClass
          )}
        >
          <HighestIcon className={cn("size-3", highestCfg.iconClass)} />
          {highestCfg.label}
        </div>
      </motion.div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step, i) => (
          <StatusStep key={`${step.level}-${step.title}`} {...step} index={i} />
        ))}
      </div>
    </div>
  )
}

// ─── Mock datasets ────────────────────────────────────────────────────────────

export const STATUS_MOCK: Record<string, StatusStepData[]> = {
  all: [
    { level: "normal",   title: "Authentication Service",  description: "All systems operational." },
    { level: "info",     title: "Scheduled Maintenance",   description: "Planned downtime on Jun 1 at 02:00 UTC." },
    { level: "low",      title: "Rate Limiter",            description: "Slightly elevated request counts detected." },
    { level: "medium",   title: "Storage Cluster A",       description: "Disk usage at 74%. Consider scaling." },
    { level: "high",     title: "API Gateway",             description: "P95 latency above threshold (820 ms)." },
    { level: "critical", title: "Payment Processor",       description: "Transaction failures detected. Investigating." },
  ],
  secure: [
    { level: "normal",   title: "Authentication Service",  description: "All checks passing." },
    { level: "normal",   title: "Firewall Rules",          description: "No anomalies detected." },
    { level: "normal",   title: "Data Encryption",         description: "AES-256 active across all endpoints." },
    { level: "info",     title: "Certificate Renewal",     description: "TLS cert renews in 14 days." },
  ],
  warning: [
    { level: "medium",   title: "Storage Cluster A",       description: "Disk usage at 74%." },
    { level: "medium",   title: "Cache Layer",             description: "Hit rate dropped below 80%." },
    { level: "high",     title: "API Gateway",             description: "P95 latency above threshold." },
    { level: "high",     title: "Worker Queue",            description: "Backlog growing — 1.2k pending jobs." },
  ],
  critical: [
    { level: "critical", title: "Payment Processor",       description: "Transaction failures detected." },
    { level: "critical", title: "Database Primary",        description: "Replication lag exceeds 30 s." },
    { level: "high",     title: "API Gateway",             description: "Cascading timeout errors." },
  ],
}

export { StatusIndicator, StatusStep }
