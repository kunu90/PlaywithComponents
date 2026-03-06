import { InteractiveBentoGrid } from "@/components/blocks/interactive-bento-grid"
import { MagneticCursorLayer } from "@/components/blocks/magnetic-cursor-layer"

export default function Home() {
  return (
    <MagneticCursorLayer>
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10 font-sans">
        <InteractiveBentoGrid />
      </div>
    </MagneticCursorLayer>
  )
}
