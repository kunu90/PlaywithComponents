/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

type MagneticCursorLayerProps = {
  children: React.ReactNode
}

export function MagneticCursorLayer({ children }: MagneticCursorLayerProps) {
  const dotRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const ctxRef = useRef<gsap.Context | null>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const ctx = gsap.context(() => {
      const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
      const mouse = { x: pos.x, y: pos.y }

      const dotTween = gsap.to(dot, {
        x: () => pos.x,
        y: () => pos.y,
        duration: 0.25,
        ease: "power3.out",
        paused: true,
      })

      const ringTween = gsap.to(ring, {
        x: () => pos.x,
        y: () => pos.y,
        duration: 0.6,
        ease: "power3.out",
        paused: true,
      })

      const move = (e: MouseEvent) => {
        mouse.x = e.clientX
        mouse.y = e.clientY
        pos.x += (mouse.x - pos.x) * 0.2
        pos.y += (mouse.y - pos.y) * 0.2
        dotTween.play(0)
        ringTween.play(0)
      }

      const hoverTargets = document.querySelectorAll<HTMLElement>(
        "[data-magnetic]"
      )

      const handleEnter = (el: HTMLElement) => {
        gsap.to(ring, {
          scale: 1.6,
          duration: 0.35,
          ease: "power3.out",
        })
        gsap.to(dot, {
          scale: 0.8,
          duration: 0.2,
          ease: "power3.out",
        })
        const bounds = el.getBoundingClientRect()
        gsap.to(el, {
          x: (pos.x - (bounds.left + bounds.width / 2)) * 0.2,
          y: (pos.y - (bounds.top + bounds.height / 2)) * 0.2,
          duration: 0.35,
          ease: "power3.out",
        })
      }

      const handleLeave = (el: HTMLElement) => {
        gsap.to(ring, {
          scale: 1,
          duration: 0.35,
          ease: "power3.out",
        })
        gsap.to(dot, {
          scale: 1,
          duration: 0.2,
          ease: "power3.out",
        })
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.35,
          ease: "power3.out",
        })
      }

      window.addEventListener("mousemove", move)

      hoverTargets.forEach((el) => {
        el.addEventListener("mouseenter", () => handleEnter(el))
        el.addEventListener("mouseleave", () => handleLeave(el))
      })

      ctxRef.current = ctx

      return () => {
        window.removeEventListener("mousemove", move)
        hoverTargets.forEach((el) => {
          el.removeEventListener("mouseenter", () => handleEnter(el))
          el.removeEventListener("mouseleave", () => handleLeave(el))
        })
      }
    })

    return () => {
      ctx?.revert()
    }
  }, [])

  return (
    <div className="relative">
      {children}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-white/5 shadow-[0_0_40px_rgba(15,23,42,0.65)] backdrop-blur-md mix-blend-screen dark:border-zinc-100/40 dark:bg-zinc-100/5"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_rgba(15,23,42,0.65)] dark:bg-zinc-100"
      />
    </div>
  )
}

