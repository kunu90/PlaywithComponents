"use client"

import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type RadialProgressVariant = "default" | "primary" | "branded" | "thin" | "thick"

type RadialProgressProps = {
  value: number              // 0–100
  size?: number              // diameter in px, default 80
  thickness?: number         // stroke width in px
  variant?: RadialProgressVariant
  showLabel?: boolean
  delay?: number             // entrance stagger delay in seconds
  className?: string
  labelClassName?: string
}

// ─── Variant colour maps ──────────────────────────────────────────────────────

const TRACK_COLOR: Record<RadialProgressVariant, string> = {
  default: "text-muted/40",
  primary: "text-primary/20",
  branded: "text-primary",
  thin:    "text-muted/40",
  thick:   "text-muted/40",
}

const ARC_COLOR: Record<RadialProgressVariant, string> = {
  default: "text-foreground",
  primary: "text-primary",
  branded: "text-primary-foreground",
  thin:    "text-foreground",
  thick:   "text-foreground",
}

// ─── RadialProgress ──────────────────────────────────────────────────────────

function RadialProgress({
  value,
  size = 80,
  thickness,
  variant = "default",
  showLabel = true,
  delay = 0,
  className,
  labelClassName,
}: RadialProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  const isComplete   = clampedValue === 100
  const isThin       = variant === "thin"
  const isBranded    = variant === "branded"

  const resolvedThickness =
    thickness ??
    (isThin ? 2 : variant === "thick" ? size * 0.25 : size * 0.1)

  const radius       = (size - resolvedThickness) / 2
  const circumference = 2 * Math.PI * radius
  const targetOffset  = circumference - (clampedValue / 100) * circumference

  // Animated label counter (0 → value)
  const motionValue  = useMotionValue(0)
  const displayCount = useTransform(motionValue, (v) => `${Math.round(v)}%`)
  const arcControls  = useAnimation()
  const wrapControls = useAnimation()

  useEffect(() => {
    const run = async () => {
      // 1. Draw-on: arc strokes in from empty → target
      await arcControls.start({
        strokeDashoffset: targetOffset,
        transition: {
          duration: 1.2,
          delay,
          ease: [0.33, 1, 0.68, 1], // cubic-out — snappy but smooth
        },
      })

      // 2. Completion pulse: scale up → down when ring reaches 100%
      if (isComplete) {
        await wrapControls.start({
          scale: [1, 1.12, 1],
          transition: { duration: 0.45, ease: "easeOut" },
        })
      }
    }

    // Drive the numeric counter in sync with the arc draw
    motionValue.set(0)
    const timeout = setTimeout(() => {
      arcControls.start({ strokeDashoffset: targetOffset })
      motionValue.set(clampedValue)
    }, delay * 1000)

    run()
    return () => clearTimeout(timeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clampedValue, delay])

  return (
    <motion.div
      data-slot="radial-progress"
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      animate={wrapControls}
      className={cn(
        "relative inline-flex items-center justify-center",
        isBranded && "rounded-full bg-primary p-1",
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* Completion glow ring — fades in only at 100% */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.35, 0], scale: [0.8, 1.3, 1.6] }}
          transition={{ duration: 0.8, delay: delay + 1.2, ease: "easeOut" }}
          className={cn(
            "absolute inset-0 rounded-full",
            isBranded ? "bg-primary" : "bg-foreground/20"
          )}
        />
      )}

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        // Thin variant spins like an "in-progress" indicator
        className={cn(isThin && "animate-spin [animation-duration:1.6s]", "-rotate-90")}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={resolvedThickness}
          className={cn("stroke-current", TRACK_COLOR[variant])}
        />

        {/* Animated arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={resolvedThickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          // Start fully hidden, then animate to target
          initial={{ strokeDashoffset: circumference }}
          animate={arcControls}
          className={cn("stroke-current", ARC_COLOR[variant])}
        />
      </svg>

      {showLabel && !isThin && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.3 }}
          className={cn(
            "absolute text-xs font-semibold tabular-nums",
            isBranded ? "text-primary-foreground" : "text-foreground",
            labelClassName
          )}
        >
          {displayCount}
        </motion.span>
      )}
    </motion.div>
  )
}

export { RadialProgress }
export type { RadialProgressProps, RadialProgressVariant }
