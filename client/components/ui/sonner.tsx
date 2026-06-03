"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-950 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-lg font-primary rounded-xl p-4 flex gap-3 items-start",
          title: "font-primary font-semibold text-[15px]",
          description: "group-[.toast]:text-slate-500 font-secondary text-sm mt-1",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-white font-primary font-medium rounded-lg px-3 py-1.5",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500 font-primary font-medium rounded-lg px-3 py-1.5",
          error: "group-[.toaster]:!border-red-200 group-[.toaster]:!bg-red-50 group-[.toaster]:!text-red-900",
          success: "group-[.toaster]:!border-emerald-200 group-[.toaster]:!bg-emerald-50 group-[.toaster]:!text-emerald-900",
          warning: "group-[.toaster]:!border-amber-200 group-[.toaster]:!bg-amber-50 group-[.toaster]:!text-amber-900",
          info: "group-[.toaster]:!border-blue-200 group-[.toaster]:!bg-blue-50 group-[.toaster]:!text-blue-900",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
