"use client"

import * as React from "react"
import { Settings2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { ThemeSwitcher } from "@/components/blocks/theme-switcher"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import { Card } from "@/components/ui/card"
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
}

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
]

const BLOCK_COMPONENT_SLUGS = [
  "interactive-bento-grid",
  "status-indicator",
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
  "status-indicator": [
    { id: "all",      title: "All Levels" },
    { id: "secure",   title: "Secure" },
    { id: "warning",  title: "Warning" },
    { id: "critical", title: "Critical" },
  ],
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
}

const COMPONENTS: ComponentEntry[] = [...UI_COMPONENT_SLUGS, ...BLOCK_COMPONENT_SLUGS].map(
  (slug) => {
    const label = humanize(slug)
    const isSonner = slug === "sonner"
    const types = TYPE_OVERRIDES[slug] ?? [{ id: "default", title: "Default" }]
    const latestUpdate =
      LATEST_UPDATE_OVERRIDES[slug] ?? "No specific updates tracked yet."

    return {
      slug,
      label,
      heading: isSonner ? "Sonner Variants" : `${label} Variants`,
      description: isSonner
        ? "Displays a toast notification."
        : "A UI primitive from `src/components/ui` with variant examples.",
      latestUpdate,
      types,
    }
  },
)

const DEFAULT_SLUG = "sonner"

function showSonnerToast(typeId: string) {
  // These mirror the toast examples that were on your old `src/app/page.tsx`.
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
    // Force dark theme styling to match the provided reference image.
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
                    Click a type below to trigger a Toast
                  </div>

                  {selected.slug === "pagination" && (
                    <div className="mt-2">
                      <PaginationPreview activeTypeId={activeTypeId} />
                    </div>
                  )}

                  {selected.slug === "skeleton" && (
                    <SkeletonPreview typeId={activeTypeId} />
                  )}

                  {selected.slug === "progress" && (
                    <RadialProgressPreview typeId={activeTypeId} />
                  )}

                  {selected.slug === "status-indicator" && (
                    <StatusIndicatorPreview typeId={activeTypeId} />
                  )}

                  {selected.slug !== "sonner" &&
                    selected.slug !== "pagination" &&
                    selected.slug !== "skeleton" &&
                    selected.slug !== "progress" &&
                    selected.slug !== "status-indicator" && (
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
                        <Button
                          variant="outline"
                          size="sm"
                          className={[
                            "rounded-full border-border/60 bg-background/30 px-4 py-1",
                            "h-auto text-sm font-medium transition-colors hover:bg-background/60",
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
