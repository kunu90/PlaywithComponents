import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const MOCK_CARDS = [
  {
    id: "analytics",
    label: "Live Analytics",
    badge: "Realtime",
    description: "Track engagement across your playground in real time.",
  },
  {
    id: "motion",
    label: "Micro-Interactions",
    badge: "Motion",
    description: "Framer Motion + GSAP presets ready to drop in.",
  },
  {
    id: "themes",
    label: "Theme Variants",
    badge: "Design",
    description: "Swap between light, dark, and candy themes instantly.",
  },
  {
    id: "shortcuts",
    label: "Power Shortcuts",
    badge: "Productivity",
    description: "Command palette actions for every surface.",
  },
]

export function InteractiveBentoGrid() {
  return (
    <section className="w-full max-w-5xl space-y-6" data-magnetic>
      <header className="space-y-2">
        <Badge variant="outline">Playground</Badge>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Interactive Bento Grid
            </h2>
            <p className="text-sm text-muted-foreground">
              Use cards, badges, and buttons from the design system to explore
              motion patterns.
            </p>
          </div>
          <Button size="sm" variant="outline">
            Duplicate layout
          </Button>
        </div>
      </header>

      <motion.div
        layout
        className="grid gap-4 md:grid-cols-3"
        transition={{
          layout: {
            duration: 0.4,
            ease: [0.21, 0.47, 0.32, 0.98],
          },
        }}
      >
        <motion.div
          layoutId="analytics"
          className="md:col-span-2"
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Card className="h-full cursor-pointer overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <CardTitle>Live analytics surface</CardTitle>
                  <CardDescription>
                    High-signal tiles that respond to layout changes.
                  </CardDescription>
                </div>
                <Badge variant="secondary">Realtime</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                <span>Sessions right now</span>
                <span className="font-mono text-base text-foreground">128</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3">
                <span>Interactions / min</span>
                <span className="font-mono text-base text-foreground">4.2k</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {MOCK_CARDS.slice(1).map((card) => (
          <motion.div
            key={card.id}
            layoutId={card.id}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="h-full cursor-pointer">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{card.label}</CardTitle>
                  <Badge variant="outline">{card.badge}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>{card.description}</p>
                <div className="flex items-center justify-between gap-2">
                  <Button size="xs" variant="outline">
                    Preview
                  </Button>
                  <Button size="xs" variant="ghost">
                    Open config
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

