"use client"

import { useEffect, useRef } from "react"

interface TrackPurchaseProps {
  transactionId: string
  amount: number
  items: Array<{ name: string; quantity: number; price: number }>
}

// Declaracao de tipos para o Google Ads
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function TrackPurchase({ transactionId, amount, items }: TrackPurchaseProps) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (!transactionId) return

    // Verifica se ja disparou para essa transacao (protege contra StrictMode e re-renders)
    const storageKey = `tracked_${transactionId}`
    if (hasTracked.current || localStorage.getItem(storageKey)) return
    hasTracked.current = true
    localStorage.setItem(storageKey, "true")

    // ============================================
    // GOOGLE ADS - Evento de Conversao
    // ID: AW-18249151503
    // Rotulo: tgPxCP2UpcEcEI_o7_1D
    // ============================================
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-18249151503/tgPxCP2UpcEcEI_o7_1D",
        value: amount,
        currency: "BRL",
        transaction_id: transactionId,
      })
      console.log("[v0] Google Ads Conversion disparado:", { amount, transactionId })
    }
  }, [transactionId, amount, items])

  // Este componente nao renderiza nada visualmente
  return null
}
