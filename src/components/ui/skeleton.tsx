import { cn } from "@/lib/utils"

// ─── Base primitive ───────────────────────────────────────────────────────────
// animate-pulse + a soft blur give the "glass shimmer" feel consistent
// with the pill-glass aesthetic used in Sonner.
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-xl bg-muted/60 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}

// ─── Skeleton Text ────────────────────────────────────────────────────────────
// Mirrors daisyUI's `skeleton-text`: animates the text colour instead of
// the background so it works inline inside paragraphs or headings.
function SkeletonText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="skeleton-text"
      className={cn(
        "animate-pulse bg-gradient-to-r from-muted via-foreground/20 to-muted bg-[length:200%_100%] bg-clip-text text-transparent",
        className
      )}
      {...props}
    />
  )
}

// ─── Skeleton Avatar (circle + text lines) ────────────────────────────────────
// Equivalent to daisyUI's "Skeleton – circle with content" pattern.
// Shows a circular avatar placeholder alongside two staggered text lines.
function SkeletonAvatar({ className }: { className?: string }) {
  return (
    <div
      data-slot="skeleton-avatar"
      className={cn("flex w-52 items-center gap-4", className)}
    >
      <Skeleton className="size-16 shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  )
}

// ─── Skeleton Card (rectangle + text lines) ──────────────────────────────────
// Equivalent to daisyUI's "Skeleton – rectangle with content" pattern.
// A large image-area placeholder above a title and two body-copy lines.
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      data-slot="skeleton-card"
      className={cn("flex w-52 flex-col gap-4", className)}
    >
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
    </div>
  )
}

export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard }
