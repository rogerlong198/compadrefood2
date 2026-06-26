"use client"

import { useEffect } from "react"

function genId(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID()
  } catch {
    // ignora
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

// Manda um "sinal de vida" a cada 30s pro /api/presence, pra contar visitantes
// online no painel admin. Não conta quem está no próprio /admin.
export function PresenceTracker() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) return

    const id = genId()
    let stopped = false

    const beat = () => {
      if (stopped) return
      fetch("/api/presence", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id }),
        keepalive: true,
      }).catch(() => {})
    }

    beat()
    const interval = setInterval(beat, 30_000)
    const onVisible = () => {
      if (document.visibilityState === "visible") beat()
    }
    document.addEventListener("visibilitychange", onVisible)

    return () => {
      stopped = true
      clearInterval(interval)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [])

  return null
}
