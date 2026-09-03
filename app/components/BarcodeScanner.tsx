"use client"

import { useEffect } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"

export function BarcodeScanner({ onScan, onClose }: { onScan: (code: string) => void, onClose: () => void }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    )
    scanner.render((decodedText) => {
      onScan(decodedText)
      scanner.clear().catch(console.error)
      onClose()
    }, (error) => {
      console.warn(error)
    })

    return () => {
      scanner.clear().catch(console.error)
    }
  }, [onScan, onClose])

  return <div id="reader" style={{ width: "100%" }} />
}
