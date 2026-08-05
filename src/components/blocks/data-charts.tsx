"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

export type DataChartVariant =
  | "column"
  | "line-comparison"
  | "multi-line"
  | "threshold"

export type DataChartsProps = {
  variant?: DataChartVariant
  className?: string
}

const SPRING = { type: "spring" as const, stiffness: 300, damping: 20 }

// Static mock datasets — playground only, no backend.
const COLUMN_DATA = [
  { month: "Jan", visitors: 1860 },
  { month: "Feb", visitors: 2450 },
  { month: "Mar", visitors: 2100 },
  { month: "Apr", visitors: 2780 },
  { month: "May", visitors: 3120 },
  { month: "Jun", visitors: 2890 },
]

const COMPARISON_DATA = [
  { month: "Jan", current: 186, previous: 160 },
  { month: "Feb", current: 245, previous: 210 },
  { month: "Mar", current: 210, previous: 198 },
  { month: "Apr", current: 278, previous: 240 },
  { month: "May", current: 312, previous: 265 },
  { month: "Jun", current: 289, previous: 290 },
]

const MULTI_LINE_DATA = [
  { month: "Jan", desktop: 186, mobile: 120, tablet: 80 },
  { month: "Feb", desktop: 245, mobile: 160, tablet: 95 },
  { month: "Mar", desktop: 210, mobile: 190, tablet: 110 },
  { month: "Apr", desktop: 278, mobile: 210, tablet: 130 },
  { month: "May", desktop: 312, mobile: 250, tablet: 140 },
  { month: "Jun", desktop: 289, mobile: 270, tablet: 155 },
]

const THRESHOLD_DATA = [
  { month: "Jan", latency: 180 },
  { month: "Feb", latency: 210 },
  { month: "Mar", latency: 245 },
  { month: "Apr", latency: 320 },
  { month: "May", latency: 290 },
  { month: "Jun", latency: 260 },
]

const LATENCY_THRESHOLD = 250

const columnConfig = {
  visitors: {
    label: "Visitors",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const comparisonConfig = {
  current: {
    label: "This year",
    color: "var(--chart-1)",
  },
  previous: {
    label: "Last year",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const multiLineConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
  tablet: {
    label: "Tablet",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

const thresholdConfig = {
  latency: {
    label: "Latency (ms)",
    color: "var(--chart-1)",
  },
  threshold: {
    label: "SLO threshold",
    color: "var(--destructive)",
  },
} satisfies ChartConfig

const VARIANT_META: Record<
  DataChartVariant,
  { title: string; description: string }
> = {
  column: {
    title: "Monthly visitors",
    description: "Column chart — compare discrete totals across categories.",
  },
  "line-comparison": {
    title: "Year-over-year growth",
    description: "Line comparison — this year vs last year on the same axis.",
  },
  "multi-line": {
    title: "Traffic by device",
    description: "Multi-line — three series sharing one time scale.",
  },
  threshold: {
    title: "API latency vs SLO",
    description: "Threshold line — signal when values cross a target.",
  },
}

function ChartShell({
  title,
  description,
  children,
  className,
}: {
  title: string
  description: string
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING}
      className={cn("w-full space-y-3", className)}
    >
      <div className="px-1">
        <div className="text-sm font-medium text-foreground">{title}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </motion.div>
  )
}

function ColumnChartPreview() {
  const meta = VARIANT_META.column
  return (
    <ChartShell title={meta.title} description={meta.description}>
      <ChartContainer config={columnConfig} className="aspect-[16/9] w-full max-h-[280px]">
        <BarChart accessibilityLayer data={COLUMN_DATA} margin={{ left: 8, right: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={40}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar
            dataKey="visitors"
            fill="var(--color-visitors)"
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ChartContainer>
    </ChartShell>
  )
}

function LineComparisonChartPreview() {
  const meta = VARIANT_META["line-comparison"]
  return (
    <ChartShell title={meta.title} description={meta.description}>
      <ChartContainer
        config={comparisonConfig}
        className="aspect-[16/9] w-full max-h-[280px]"
      >
        <LineChart accessibilityLayer data={COMPARISON_DATA} margin={{ left: 8, right: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={36}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            type="monotone"
            dataKey="current"
            stroke="var(--color-current)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="previous"
            stroke="var(--color-previous)"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>
    </ChartShell>
  )
}

function MultiLineChartPreview() {
  const meta = VARIANT_META["multi-line"]
  return (
    <ChartShell title={meta.title} description={meta.description}>
      <ChartContainer
        config={multiLineConfig}
        className="aspect-[16/9] w-full max-h-[280px]"
      >
        <LineChart accessibilityLayer data={MULTI_LINE_DATA} margin={{ left: 8, right: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={36}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            type="monotone"
            dataKey="desktop"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="mobile"
            stroke="var(--color-mobile)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="tablet"
            stroke="var(--color-tablet)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ChartContainer>
    </ChartShell>
  )
}

function ThresholdLineChartPreview() {
  const meta = VARIANT_META.threshold
  return (
    <ChartShell title={meta.title} description={meta.description}>
      <ChartContainer
        config={thresholdConfig}
        className="aspect-[16/9] w-full max-h-[280px]"
      >
        <LineChart accessibilityLayer data={THRESHOLD_DATA} margin={{ left: 8, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={40}
            domain={[0, 400]}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <ReferenceLine
            y={LATENCY_THRESHOLD}
            stroke="var(--color-threshold)"
            strokeDasharray="6 4"
            strokeWidth={1.5}
            label={{
              value: `SLO ${LATENCY_THRESHOLD}ms`,
              position: "insideTopRight",
              fill: "var(--muted-foreground)",
              fontSize: 11,
            }}
          />
          <Line
            type="monotone"
            dataKey="latency"
            stroke="var(--color-latency)"
            strokeWidth={2.5}
            dot={(props) => {
              const { cx = 0, cy = 0, payload, index } = props
              const over = Boolean(payload && payload.latency > LATENCY_THRESHOLD)
              return (
                <circle
                  key={`dot-${index ?? `${cx}-${cy}`}`}
                  cx={cx}
                  cy={cy}
                  r={over ? 5 : 3}
                  fill={over ? "var(--color-threshold)" : "var(--color-latency)"}
                  stroke="var(--background)"
                  strokeWidth={2}
                />
              )
            }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ChartContainer>
    </ChartShell>
  )
}

export function DataCharts({
  variant = "column",
  className,
}: DataChartsProps) {
  return (
    <div className={cn("w-full", className)}>
      {variant === "column" && <ColumnChartPreview />}
      {variant === "line-comparison" && <LineComparisonChartPreview />}
      {variant === "multi-line" && <MultiLineChartPreview />}
      {variant === "threshold" && <ThresholdLineChartPreview />}
    </div>
  )
}

export function DataChartsPreview({ typeId }: { typeId: string }) {
  const variant = (
    ["column", "line-comparison", "multi-line", "threshold"].includes(typeId)
      ? typeId
      : "column"
  ) as DataChartVariant

  return (
    <div className="flex justify-center py-2">
      <DataCharts key={variant} variant={variant} className="max-w-2xl" />
    </div>
  )
}
