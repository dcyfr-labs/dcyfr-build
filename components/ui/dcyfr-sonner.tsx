"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

/**
 * Brand-themed sonner `<Toaster />`. Toast callers import `toast()` from `sonner`
 * directly; this wrapper only supplies the DCYFR theme + structural classes.
 */
function DcyfrToaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group-[.toast]:!border-success/40 group-[.toast]:!bg-success/5 group-[.toast]:!text-success",
          error:
            "group-[.toast]:!border-destructive/50 group-[.toast]:!bg-destructive/5 group-[.toast]:!text-destructive",
          warning:
            "group-[.toast]:!border-warning/40 group-[.toast]:!bg-warning/5 group-[.toast]:!text-warning",
          info:
            "group-[.toast]:!border-secure/30 group-[.toast]:!bg-secure/5 group-[.toast]:!text-secure",
        },
      }}
      // Contract v2 tokens carry full color values, so these pass var(--x)
      // straight through. The registry's copy of this file still wraps them in
      // hsl(), which double-wraps under the theme engine and resolves to
      // nothing — the toast loses its background, text color and border. This
      // is a local fork until the registry item is updated; re-running
      // `shadcn add @dcyfr-labs/dcyfr-sonner` today would reintroduce the bug.
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { DcyfrToaster }
