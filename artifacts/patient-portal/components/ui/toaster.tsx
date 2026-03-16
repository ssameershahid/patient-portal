"use client"

import * as React from "react"
import * as ToastPrimitive from "@radix-ui/react-toast"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitive.Provider

const ToastViewport = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitive.Viewport.displayName

interface ToastContextValue {
  toasts: Array<{ id: string; title?: string; description?: string; variant?: 'default' | 'destructive' }>
  toast: (props: { title?: string; description?: string; variant?: 'default' | 'destructive' }) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue>({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
})

export function useToast() {
  return React.useContext(ToastContext)
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<ToastContextValue['toasts']>([])

  const toast = React.useCallback((props: { title?: string; description?: string; variant?: 'default' | 'destructive' }) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, ...props }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      <ToastProvider>
        {toasts.map((t) => (
          <ToastPrimitive.Root
            key={t.id}
            className={cn(
              "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-2xl border p-4 shadow-lg transition-all",
              t.variant === 'destructive'
                ? "border-error/20 bg-error-light text-error"
                : "border-cream-400 bg-white text-cream-900"
            )}
          >
            <div className="flex-1">
              {t.title && <div className="text-sm font-semibold">{t.title}</div>}
              {t.description && <div className="text-sm opacity-90">{t.description}</div>}
            </div>
            <ToastPrimitive.Close className="rounded-lg p-1 text-cream-600 hover:text-cream-900">
              <X className="h-4 w-4" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  )
}
