"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Settings2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { ThemeSwitcher } from "@/components/blocks/theme-switcher"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Skeleton,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonText,
} from "@/components/ui/skeleton"
import { RadialProgress } from "@/components/ui/radial-progress"
import { Slider } from "@/components/ui/slider"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { DataChartsPreview } from "@/components/blocks/data-charts"
import {
  StatusIndicator,
  STATUS_MOCK,
} from "@/components/blocks/status-indicator"

type ToastTypeCard = { id: string; title: string }

type ComponentEntry = {
  slug: string
  label: string
  heading: string
  description: string
  latestUpdate: string
  types: ToastTypeCard[]
  prompt: string
}

const SPRING = { type: "spring" as const, stiffness: 300, damping: 20 }

function humanize(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ")
}

const UI_COMPONENT_SLUGS = [
  "sonner",
  "skeleton",
  "progress",
  "pagination",
  "button-group",
  "dialog",
  "tabs",
  "accordion",
  "slider",
]

const BLOCK_COMPONENT_SLUGS = [
  "interactive-bento-grid",
  "status-indicator",
  "data-charts",
]

const TYPE_OVERRIDES: Record<string, ToastTypeCard[]> = {
  sonner: [
    { id: "default",     title: "Default" },
    { id: "description", title: "Description" },
    { id: "success",     title: "Success" },
    { id: "info",        title: "Info" },
    { id: "warning",     title: "Warning" },
    { id: "error",       title: "Error" },
  ],
  skeleton: [
    { id: "basic",  title: "Basic" },
    { id: "avatar", title: "Avatar" },
    { id: "card",   title: "Card" },
    { id: "text",   title: "Text" },
  ],
  progress: [
    { id: "default", title: "Default (70%)" },
    { id: "values",  title: "Different Values" },
    { id: "primary", title: "Custom Color" },
    { id: "branded", title: "Background + Border" },
    { id: "thin",    title: "Thin Stroke" },
    { id: "thick",   title: "Thick Stroke" },
  ],
  dialog: [
    { id: "default",     title: "Default" },
    { id: "form",        title: "Form" },
    { id: "destructive", title: "Destructive" },
    { id: "scrollable",  title: "Scrollable" },
  ],
  tabs: [
    { id: "default",  title: "Default" },
    { id: "line",     title: "Line" },
    { id: "vertical", title: "Vertical" },
  ],
  accordion: [
    { id: "single",   title: "Single" },
    { id: "multiple", title: "Multiple" },
    { id: "bordered", title: "Bordered" },
  ],
  slider: [
    { id: "default",  title: "Default" },
    { id: "range",    title: "Range" },
    { id: "stepped",  title: "Stepped" },
    { id: "vertical", title: "Vertical" },
  ],
  "status-indicator": [
    { id: "all",      title: "All Levels" },
    { id: "secure",   title: "Secure" },
    { id: "warning",  title: "Warning" },
    { id: "critical", title: "Critical" },
  ],
  "data-charts": [
    { id: "column",          title: "Column" },
    { id: "line-comparison", title: "Line Comparison" },
    { id: "multi-line",      title: "Multi Line" },
    { id: "threshold",       title: "Threshold" },
  ],
}

const DESCRIPTION_OVERRIDES: Record<string, string> = {
  sonner: "Displays a toast notification.",
  dialog: "Modal overlay for focused tasks — confirmations, forms, and longer content.",
  tabs: "Switch between related views without leaving the page.",
  accordion: "Expand and collapse sections to reveal progressive detail.",
  slider: "Select a value or range along a continuous track.",
  "data-charts":
    "Visualize trends and comparisons — columns, paired lines, multi-series, and threshold signals.",
}

const PROMPT_OVERRIDES: Record<string, string> = {
  sonner: "Click a type below to trigger a Toast",
  dialog: "Click a type below to switch Dialog variants — then open the preview",
  tabs: "Click a type below to switch Tabs layout variants",
  accordion: "Click a type below to switch Accordion behavior",
  slider: "Click a type below to switch Slider variants — drag to explore",
  skeleton: "Click a type below to switch Skeleton variants",
  progress: "Click a type below to switch Radial Progress variants",
  pagination: "Click a type below — preview stays interactive",
  "status-indicator": "Click a type below to switch Status Indicator scenarios",
  "data-charts": "Click a type below to switch chart variants",
}

const LATEST_UPDATE_OVERRIDES: Record<string, string> = {
  sonner:
    "Updated success/error toast colors + icons in `src/components/ui/sonner.tsx`.",
  skeleton:
    "Added SkeletonText, SkeletonAvatar, SkeletonCard variants with glass shimmer in `src/components/ui/skeleton.tsx`.",
  progress:
    "Built RadialProgress from scratch using SVG circles — supports 5 variants (default, primary, branded, thin, thick) in `src/components/ui/radial-progress.tsx`.",
  "status-indicator":
    "Built StatusIndicator block with 6 severity levels (normal → critical), staggered Framer Motion entry, critical pulse, and high shake animations in `src/components/blocks/status-indicator.tsx`.",
  dialog:
    "Wired Dialog into the explorer with Default, Form, Destructive, and Scrollable variants using the shadcn Dialog primitive.",
  tabs:
    "Wired Tabs into the explorer with Default, Line, and Vertical orientation variants.",
  accordion:
    "Wired Accordion into the explorer with Single, Multiple, and Bordered expand modes.",
  slider:
    "Wired Slider into the explorer with Default, Range, Stepped, and Vertical variants.",
  "data-charts":
    "Built DataCharts block with Column, Line Comparison, Multi Line, and Threshold variants on shadcn Chart + Recharts in `src/components/blocks/data-charts.tsx`.",
}

const COMPONENTS: ComponentEntry[] = [...UI_COMPONENT_SLUGS, ...BLOCK_COMPONENT_SLUGS].map(
  (slug) => {
    const label = humanize(slug)
    const types = TYPE_OVERRIDES[slug] ?? [{ id: "default", title: "Default" }]
    const latestUpdate =
      LATEST_UPDATE_OVERRIDES[slug] ?? "No specific updates tracked yet."

    return {
      slug,
      label,
      heading: `${label} Variants`,
      description:
        DESCRIPTION_OVERRIDES[slug] ??
        "A UI primitive from `src/components/ui` with variant examples.",
      latestUpdate,
      types,
      prompt: PROMPT_OVERRIDES[slug] ?? "Click a type below to explore variants",
    }
  },
)

const DEFAULT_SLUG = "sonner"

const PREVIEW_SLUGS = new Set([
  "sonner",
  "pagination",
  "skeleton",
  "progress",
  "status-indicator",
  "dialog",
  "tabs",
  "accordion",
  "slider",
  "data-charts",
])

const ACCORDION_ITEMS = [
  {
    value: "item-1",
    title: "What is this playground?",
    body: "A hands-on lab for exploring shadcn primitives — tweak props, feel motion, and learn by editing.",
  },
  {
    value: "item-2",
    title: "Why use an accordion?",
    body: "It keeps dense content scannable. Users open only what they need, which reduces cognitive load.",
  },
  {
    value: "item-3",
    title: "When should sections stay open?",
    body: "Use multiple mode when comparing items side-by-side matters more than focusing on one section.",
  },
] as const

function showSonnerToast(typeId: string) {
  switch (typeId) {
    case "default":
      toast("Event has been created", {
        description: "Sunday, December 03, 2023 at 9:00 AM",
        action: {
          label: "Remove",
          onClick: () => console.log("Undo"),
        },
      })
      return
    case "description":
      toast("Event has been created", {
        description: "Sunday, December 03, 2023 at 9:00 AM",
      })
      return
    case "success":
      toast.success("Success toast", {
        description: "Your changes have been saved.",
      })
      return
    case "info":
      toast.info("Info toast", {
        description: "Here's some information for you.",
      })
      return
    case "warning":
      toast.warning("Warning toast", {
        description: "Please double-check this action.",
      })
      return
    case "error":
      toast.error("Alert toast", {
        description: "Something went wrong.",
      })
      return
    default:
      toast("Toast example", {
        description: "Click another type to see different toast styles.",
      })
  }
}

function PaginationPreview({ activeTypeId }: { activeTypeId: string }) {
  const totalPages = 5
  const initialPage = activeTypeId === "default" ? 2 : 1
  const [page, setPage] = React.useState(initialPage)

  React.useEffect(() => {
    setPage(initialPage)
  }, [initialPage])

  return (
    <Pagination className="mt-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setPage((p) => Math.max(1, p - 1))
            }}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, idx) => {
          const n = idx + 1
          return (
            <PaginationItem key={n}>
              <PaginationLink
                href="#"
                isActive={page === n}
                size="icon"
                onClick={(e) => {
                  e.preventDefault()
                  setPage(n)
                }}
              >
                {n}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setPage((p) => Math.min(totalPages, p + 1))
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

function ButtonGroupPreview({ orientation }: { orientation: "horizontal" | "vertical" }) {
  const [alignment, setAlignment] = React.useState<"left" | "center" | "right">("center")

  return (
    <div className="flex h-full items-center justify-center">
      <div className="space-y-3">
        <ButtonGroup orientation={orientation}>
          <Button
            variant={alignment === "left" ? "default" : "outline"}
            size="sm"
            onClick={() => setAlignment("left")}
          >
            Option 1
          </Button>
          <Button
            variant={alignment === "center" ? "default" : "outline"}
            size="sm"
            onClick={() => setAlignment("center")}
          >
            Option 2
          </Button>
          <Button
            variant={alignment === "right" ? "default" : "outline"}
            size="sm"
            onClick={() => setAlignment("right")}
          >
            Option 3
          </Button>
          <ButtonGroupSeparator />
          <Button variant="outline" size="sm">
            <Settings2 className="mr-1 size-4" />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
}

function StatusIndicatorPreview({ typeId }: { typeId: string }) {
  const steps = STATUS_MOCK[typeId] ?? STATUS_MOCK.all
  return (
    <div className="flex justify-center py-4">
      <StatusIndicator
        key={typeId}
        title={
          typeId === "secure"   ? "Security Overview" :
          typeId === "warning"  ? "Infrastructure Warnings" :
          typeId === "critical" ? "Active Incidents" :
          "System Status"
        }
        steps={steps}
      />
    </div>
  )
}

function RadialProgressPreview({ typeId }: { typeId: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-6">
      {typeId === "default" && (
        <RadialProgress value={70} size={96} />
      )}
      {typeId === "values" &&
        [0, 20, 60, 80, 100].map((v, i) => (
          <RadialProgress key={v} value={v} size={80} delay={i * 0.15} />
        ))
      }
      {typeId === "primary" && (
        <RadialProgress value={70} size={96} variant="primary" />
      )}
      {typeId === "branded" && (
        <RadialProgress value={70} size={96} variant="branded" />
      )}
      {typeId === "thin" && (
        <RadialProgress value={30} size={96} variant="thin" showLabel={false} />
      )}
      {typeId === "thick" && (
        <RadialProgress value={70} size={120} variant="thick" />
      )}
    </div>
  )
}

function SkeletonPreview({ typeId }: { typeId: string }) {
  return (
    <div className="flex items-center justify-center py-6">
      {typeId === "basic" && (
        <Skeleton className="h-32 w-32" />
      )}
      {typeId === "avatar" && (
        <SkeletonAvatar />
      )}
      {typeId === "card" && (
        <SkeletonCard />
      )}
      {typeId === "text" && (
        <p className="max-w-xs text-lg font-medium leading-relaxed">
          <SkeletonText>AI is thinking harder…</SkeletonText>
        </p>
      )}
    </div>
  )
}

function DialogPreview({ typeId }: { typeId: string }) {
  const isDestructive = typeId === "destructive"
  const isForm = typeId === "form"
  const isScrollable = typeId === "scrollable"

  return (
    <div className="flex items-center justify-center py-6">
      <Dialog key={typeId}>
        <motion.div
          className="inline-flex"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={SPRING}
        >
          <DialogTrigger asChild>
            <Button variant={isDestructive ? "destructive" : "default"}>
              {isForm
                ? "Edit profile"
                : isDestructive
                  ? "Delete project"
                  : isScrollable
                    ? "View terms"
                    : "Open dialog"}
            </Button>
          </DialogTrigger>
        </motion.div>
        <DialogContent
          className={isScrollable ? "max-h-[80vh] overflow-y-auto sm:max-w-md" : undefined}
          showCloseButton={!isDestructive}
        >
          <DialogHeader>
            <DialogTitle>
              {isForm
                ? "Edit profile"
                : isDestructive
                  ? "Are you absolutely sure?"
                  : isScrollable
                    ? "Terms of service"
                    : "Share this component"}
            </DialogTitle>
            <DialogDescription>
              {isForm
                ? "Make changes to your profile here. Click save when you're done."
                : isDestructive
                  ? "This action cannot be undone. This will permanently delete your project and remove its data."
                  : isScrollable
                    ? "Please review the agreement carefully before continuing."
                    : "Anyone with the link can view this playground experiment."}
            </DialogDescription>
          </DialogHeader>

          {isForm && (
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Kunal Chaudhary" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="@kunu90" />
              </div>
            </div>
          )}

          {isScrollable && (
            <div className="space-y-3 text-sm text-muted-foreground">
              {Array.from({ length: 6 }).map((_, i) => (
                <p key={i}>
                  Section {i + 1}. This playground exists so design decisions can be felt in code —
                  spacing, focus order, motion, and dismissal patterns included. Scroll to experience
                  how dialogs handle taller content without losing the modal frame.
                </p>
              ))}
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant={isDestructive ? "destructive" : "default"}>
              {isForm ? "Save changes" : isDestructive ? "Delete" : "Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TabsPreview({ typeId }: { typeId: string }) {
  const isVertical = typeId === "vertical"
  const listVariant = typeId === "line" ? "line" : "default"

  return (
    <div className="flex justify-center py-4">
      <Tabs
        key={typeId}
        defaultValue="account"
        orientation={isVertical ? "vertical" : "horizontal"}
        className={isVertical ? "w-full max-w-lg flex-row" : "w-full max-w-md"}
      >
        <TabsList variant={listVariant}>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="rounded-lg border border-border/60 p-4 text-sm">
          Manage your public profile and workspace identity.
        </TabsContent>
        <TabsContent value="password" className="rounded-lg border border-border/60 p-4 text-sm">
          Update your password and review recent sign-in activity.
        </TabsContent>
        <TabsContent value="alerts" className="rounded-lg border border-border/60 p-4 text-sm">
          Choose which product updates land as toasts versus email.
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AccordionPreview({ typeId }: { typeId: string }) {
  const isMultiple = typeId === "multiple"
  const isBordered = typeId === "bordered"

  const items = ACCORDION_ITEMS.map((item) => (
    <AccordionItem
      key={item.value}
      value={item.value}
      className={isBordered ? "rounded-lg border border-border/60 px-4 last:border-b" : undefined}
    >
      <AccordionTrigger>{item.title}</AccordionTrigger>
      <AccordionContent>{item.body}</AccordionContent>
    </AccordionItem>
  ))

  return (
    <div className="mx-auto w-full max-w-md py-2">
      {isMultiple ? (
        <Accordion
          key={typeId}
          type="multiple"
          defaultValue={["item-1", "item-2"]}
          className={isBordered ? "space-y-3" : "w-full"}
        >
          {items}
        </Accordion>
      ) : (
        <Accordion
          key={typeId}
          type="single"
          collapsible
          defaultValue="item-1"
          className={isBordered ? "space-y-3" : "w-full"}
        >
          {items}
        </Accordion>
      )}
    </div>
  )
}

function SliderPreview({ typeId }: { typeId: string }) {
  const [single, setSingle] = React.useState([40])
  const [range, setRange] = React.useState([20, 75])
  const [stepped, setStepped] = React.useState([50])
  const [vertical, setVertical] = React.useState([60])

  React.useEffect(() => {
    setSingle([40])
    setRange([20, 75])
    setStepped([50])
    setVertical([60])
  }, [typeId])

  if (typeId === "range") {
    return (
      <div className="mx-auto w-full max-w-sm space-y-3 py-8">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Price range</span>
          <span className="font-medium tabular-nums">
            ${range[0]} – ${range[1]}
          </span>
        </div>
        <Slider value={range} onValueChange={setRange} min={0} max={100} step={1} />
      </div>
    )
  }

  if (typeId === "stepped") {
    return (
      <div className="mx-auto w-full max-w-sm space-y-3 py-8">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Opacity (step 10)</span>
          <span className="font-medium tabular-nums">{stepped[0]}%</span>
        </div>
        <Slider value={stepped} onValueChange={setStepped} min={0} max={100} step={10} />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          {[0, 20, 40, 60, 80, 100].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
      </div>
    )
  }

  if (typeId === "vertical") {
    return (
      <div className="flex items-center justify-center gap-6 py-4">
        <Slider
          value={vertical}
          onValueChange={setVertical}
          orientation="vertical"
          min={0}
          max={100}
          className="min-h-44"
        />
        <span className="w-12 text-center text-sm font-medium tabular-nums">{vertical[0]}%</span>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-sm space-y-3 py-8">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Volume</span>
        <span className="font-medium tabular-nums">{single[0]}%</span>
      </div>
      <Slider value={single} onValueChange={setSingle} min={0} max={100} step={1} />
    </div>
  )
}

function ComponentPreview({ slug, typeId }: { slug: string; typeId: string }) {
  switch (slug) {
    case "pagination":
      return <PaginationPreview activeTypeId={typeId} />
    case "skeleton":
      return <SkeletonPreview typeId={typeId} />
    case "progress":
      return <RadialProgressPreview typeId={typeId} />
    case "status-indicator":
      return <StatusIndicatorPreview typeId={typeId} />
    case "dialog":
      return <DialogPreview typeId={typeId} />
    case "tabs":
      return <TabsPreview typeId={typeId} />
    case "accordion":
      return <AccordionPreview typeId={typeId} />
    case "slider":
      return <SliderPreview typeId={typeId} />
    case "data-charts":
      return <DataChartsPreview typeId={typeId} />
    default:
      return null
  }
}

function PageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedSlug = searchParams.get("component") ?? DEFAULT_SLUG

  const selected =
    COMPONENTS.find((c) => c.slug === selectedSlug) ?? COMPONENTS[0]

  const [activeTypeId, setActiveTypeId] = React.useState(selected.types[0]?.id ?? "default")

  React.useEffect(() => {
    setActiveTypeId(selected.types[0]?.id ?? "default")
  }, [selected.slug, selected.types])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-7xl">
        <aside className="w-72 shrink-0 border-r border-border/60 px-4 py-6">
          <div className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Components
          </div>

          <nav className="h-[calc(100vh-7.5rem)] space-y-1 overflow-auto pr-1">
            {COMPONENTS.map((c) => {
              const active = c.slug === selected.slug
              return (
                <Button
                  key={c.slug}
                  onClick={() => {
                    router.push(`/?component=${encodeURIComponent(c.slug)}`)
                  }}
                  variant={active ? "secondary" : "ghost"}
                  size="sm"
                  className={[
                    "w-full justify-start px-2",
                    active ? "text-foreground" : "",
                  ].join(" ")}
                >
                  {c.label}
                </Button>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-auto px-8 py-10">
          <header className="mb-8 flex items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight">
                {selected.heading}
              </h1>
              <p className="mt-2 text-muted-foreground">{selected.description}</p>

              <div className="mt-4">
                <Badge variant="secondary">
                  Latest update: {selected.latestUpdate}
                </Badge>
              </div>
            </div>

            <ThemeSwitcher />
          </header>

          <section>
            {selected.slug === "button-group" ? (
              <div className="flex flex-col gap-6 md:flex-row">
                <Card className="flex-1 bg-card/10 p-6">
                  <div className="text-sm font-medium text-foreground">
                    Horizontal orientation
                  </div>
                  <div className="mt-2">
                    <ButtonGroupPreview orientation="horizontal" />
                  </div>
                </Card>

                <Card className="flex-1 bg-card/10 p-6">
                  <div className="text-sm font-medium text-foreground">
                    Vertical orientation
                  </div>
                  <div className="mt-2">
                    <ButtonGroupPreview orientation="vertical" />
                  </div>
                </Card>
              </div>
            ) : (
              <>
                <Card className="mb-6 bg-card/10 p-6">
                  <div className="text-sm font-medium text-foreground">
                    {selected.prompt}
                  </div>

                  {selected.slug !== "sonner" && PREVIEW_SLUGS.has(selected.slug) && (
                    <div className="mt-2">
                      <ComponentPreview slug={selected.slug} typeId={activeTypeId} />
                    </div>
                  )}

                  {!PREVIEW_SLUGS.has(selected.slug) && (
                    <div className="mt-2 text-muted-foreground">
                      Preview for this component is not implemented yet.
                    </div>
                  )}
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                  {selected.types.map((t) => (
                    <Card
                      key={t.id}
                      className="relative min-h-[160px] overflow-hidden bg-card/20"
                    >
                      <div className="flex h-full flex-col items-center justify-center gap-2">
                        <div className="text-xs font-medium text-muted-foreground">
                          Type
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={SPRING}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className={[
                              "rounded-full border-border/60 bg-background/30 px-4 py-1",
                              "h-auto text-sm font-medium transition-colors hover:bg-background/60",
                              activeTypeId === t.id ? "border-foreground/40 bg-background/60" : "",
                            ].join(" ")}
                            onClick={() => {
                              setActiveTypeId(t.id)

                              if (selected.slug === "sonner") {
                                showSonnerToast(t.id)
                              }
                            }}
                          >
                            {t.title}
                          </Button>
                        </motion.div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <React.Suspense fallback={null}>
      <PageContent />
    </React.Suspense>
  )
}
