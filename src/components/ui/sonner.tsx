"use client"

import type { CSSProperties } from "react"
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      expand
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "rounded-full backdrop-blur-md border border-border/60 bg-background/70",
        },
      }}
      icons={{
        success: (
          <CircleCheckIcon
            className="size-4"
            style={{ color: "var(--chart-2)" }}
          />
        ),
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: (
          <OctagonXIcon
            className="size-4"
            style={{ color: "var(--destructive)" }}
          />
        ),
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          // Default / neutral toasts
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",

          // Success toasts
          "--success-bg": "var(--background)",
          "--success-border": "var(--chart-2)",
          "--success-text": "var(--foreground)",

          // Error toasts
          "--error-bg": "var(--background)",
          "--error-border": "var(--destructive)",
          "--error-text": "var(--foreground)",

          // Shared
          "--border-radius": "var(--radius)",
        } as CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
