"use client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10 font-sans">
      <div className="flex flex-col gap-4">
        <Button
          onClick={() =>
            toast("Event has been created", {
              description: "Sunday, December 03, 2023 at 9:00 AM",
              action: {
                label: "Remove",
                onClick: () => console.log("Undo"),
              },
            })
          }
        >
          Default Toast
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            toast.success("Success toast", {
              description: "Your changes have been saved.",
            })
          }
        >
          Success Toast
        </Button>

        <Button
          variant="destructive"
          onClick={() =>
            toast.error("Alert toast", {
              description: "Something went wrong.",
            })
          }
        >
          Alert Toast
        </Button>
      </div>
    </div>
  )
}
