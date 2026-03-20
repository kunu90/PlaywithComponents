"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Monitor, Moon, Sun } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const THEME_OPTIONS = [
  { id: "light", label: "Light", Icon: Sun },
  { id: "dark", label: "Dark", Icon: Moon },
  { id: "system", label: "System", Icon: Monitor },
] as const

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const activeTheme = (theme ?? "system") as (typeof THEME_OPTIONS)[number]["id"]
  const ActiveIcon =
    THEME_OPTIONS.find((t) => t.id === activeTheme)?.Icon ?? Monitor

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="default">
          <ActiveIcon className="mr-2 size-4" />
          {THEME_OPTIONS.find((t) => t.id === activeTheme)?.label ??
            "System"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={activeTheme}
          onValueChange={(value) => {
            setTheme(value)
          }}
        >
          {THEME_OPTIONS.map(({ id, label, Icon }) => (
            <DropdownMenuRadioItem key={id} value={id}>
              <Icon className="mr-2 size-4" />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

