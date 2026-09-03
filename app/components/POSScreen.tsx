"use client"

import { useState, useEffect } from "react";
import { searchProductByBarcode } from "@/actions/searchProduct";
import { BarcodeScanner } from "./BarcodeScanner";
import ProductModal from "./ProductModal";

/* ── Data ────────────────────────────────────────────────── */
const CATALOG = [
  { id: 1, name: "Coca-Cola 500 ml",      cat: "Kiosco",      price: 1850, emoji: "🥤" },
  { id: 2, name: "Marlboro Rojo ×20",     cat: "Cigarrillos", price: 4200, emoji: "🚬" },
  { id: 3, name: "Alfajor Havanna",       cat: "Kiosco",      price: 2100, emoji: "🍫" },
  { id: 4, name: "Agua Mineral 1.5 L",   cat: "Kiosco",      price: 1200, emoji: "💧" },
  { id: 5, name: "Lucky Strike ×20",      cat: "Cigarrillos", price: 3900, emoji: "🚬" },
  { id: 6, name: "Sprite 500 ml",         cat: "Kiosco",      price: 1750, emoji: "🟢" },
  { id: 7, name: "Chicles Beldent",       cat: "Kiosco",      price: 650,  emoji: "🟡" },
  { id: 8, name: "Philip Morris ×20",     cat: "Cigarrillos", price: 4500, emoji: "🚬" },
];

type PayMethod = "efectivo" | "qr_rpg" | "qr_mp" | "quiniela" | null;

interface CartItem { id: number; name: string; cat: string; price: number; emoji: string; qty: number }

/* ── Helpers ─────────────────────────────────────────────── */
const AR = (n: number) => n.toLocaleString("es-AR", { maximumFractionDigits: 0 });
const numParse = (s: string) => parseFloat(s.replace(/\./g, "").replace(",", ".")) || 0;

const CAT_STYLE: Record<string, { bg: string; fg: string }> = {
  Kiosco:      { bg: "#3B82F618", fg: "#3B82F6" },
  Cigarrillos: { bg: "#8B5CF618", fg: "#8B5CF6" },
};

/* ── Component ───────────────────────────────────────────── */
export default function POSScreen({ onAddProduct }: { onAddProduct: () => void }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [q, setQ] = useState("");
  const [pay, setPay] = useState<PayMethod>(null);
  const [cash, setCash] = useState("");
  const [quinGross, setQuinGross] = useState("");
  const [scanOpen, setScanOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"cart" | "pay">("cart");
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // USB Barcode Listener
  useEffect(() => {
    let buffer = "";
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (buffer) {
          const product = await searchProductByBarcode(buffer);
          if (product) {
            // addItem(product) // Assume product structure fits
            console.log("Scanned:", product);
          } else {
            setShowQuickAdd(true);
          }
          buffer = "";
        }
      } else if (e.key.length === 1) {
        buffer += e.key;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const results = CATALOG.filter(p => q.length > 0 && p.name.toLowerCase().includes(q.toLowerCase()));

  const addItem = (p: any) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...p, qty: 1 }];
    });
    setQ("");
  };

  const setQty = (id: number, d: number) =>
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + d) } : i).filter(i => i.qty > 0));

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const hasCigs = cart.some(i => i.cat === "Cigarrillos");
  const feeRate = pay === "qr_rpg" ? 0.04 : pay === "qr_mp" ? 0.0381 : 0;
  const cigSurcharge = hasCigs && feeRate > 0 ? 0.10 : 0;
  const totalFee = feeRate + cigSurcharge;
  const netQR = total * (1 - totalFee);
  const cashNum = numParse(cash);
  const change = pay === "efectivo" && cashNum > 0 ? Math.max(0, cashNum - total) : 0;
  const quinNet = numParse(quinGross);

  /* ── sub-panels ── */
  const CartPanel = (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Search bar */}
      <div style={{ padding: "12px 14px 10px", borderBottom: "1px solid #131722", flexShrink: 0, position: "relative" }}>
        <div style={{ position: "relative" }}>
          <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#334155" }} width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/></svg>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar producto o escanear código…"
            className="kc-input"
            style={{ width: "100%", paddingLeft: 32, paddingRight: 12, paddingTop: 9, paddingBottom: 9, fontSize: 13 }}
          />
        </div>

        {/* Dropdown */}
        {results.length > 0 && (
          <div style={{
            position: "absolute", top: "calc(100% - 2px)", left: 14, right: 14, zIndex: 40,
            background: "#1A1F2E", border: "1px solid #242B3D", borderRadius: 12,
            overflow: "hidden", boxShadow: "0 8px 32px #00000060",
          }}>
            {results.map(p => (
              <button
                key={p.id}
                onClick={() => addItem(p)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", padding: "10px 14px", background: "transparent",
                  border: "none", borderBottom: "1px solid #242B3D30", cursor: "pointer",
                  transition: "background .1s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#242B3D40")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{p.emoji}</span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#E2E8F0" }}>{p.name}</div>
                    <span className="badge" style={{ background: CAT_STYLE[p.cat].bg, color: CAT_STYLE[p.cat].fg, marginTop: 2 }}>{p.cat}</span>
                  </div>
                </div>
                <span className="mono" style={{ fontSize: 13, fontWeight: 600, color: "#10B981" }}>${AR(p.price)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action row */}
      <div style={{ display: "flex", gap: 8, padding: "8px 14px", flexShrink: 0, borderBottom: "1px solid #131722" }}>
        <button
          onClick={() => setScanOpen(true)}
          className="kc-btn-primary"
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", flex: 1 }}
        >
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M3 5h3V3H3v2zm0 8h3v-2H3v2zm0 8h3v-2H3v2zm4-16v2h10V5H7zm0 16v-2h10v2H7zm0-8v-2h10v2H7z"/></svg>
          <span>Escanear</span>
        </button>
        <button
          onClick={onAddProduct}
          className="kc-btn-ghost"
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px" }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" d="M12 5v14M5 12h14"/></svg>
          <span style={{ fontSize: 13 }}>Nuevo</span>
        </button>
      </div>

      {/* Cart items */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 14px" }}>
        {cart.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, opacity: .45 }}>
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#475569" strokeWidth={1.2}><path strokeLinecap="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
            <p style={{ fontSize: 13, color: "#334155" }}>Carrito vacío — buscá o escaneá</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 8 }}>
            {cart.map(item => (
              <div
                key={item.id}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 12,
                  background: "#131722", border: "1px solid #1A1F2E",
                  transition: "border-color .15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#242B3D")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#1A1F2E")}
              >
                {/* Emoji thumb */}
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: "#0B0D13", border: "1px solid #1E2436",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                }}>{item.emoji}</div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#E2E8F0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                    <span className="badge" style={{ ...CAT_STYLE[item.cat], fontSize: 10 }}>{item.cat}</span>
                    <span className="mono" style={{ fontSize: 11, color: "#475569" }}>${AR(item.price)} c/u</span>
                  </div>
                </div>

                {/* Qty controls */}
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                  <button onClick={() => setQty(item.id, -1)} style={{ width: 26, height: 26, borderRadius: 7, background: "#1E2436", border: "none", color: "#64748B", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "background .12s" }} onMouseEnter={e => (e.currentTarget.style.background = "#242B3D")} onMouseLeave={e => (e.currentTarget.style.background = "#1E2436")}>−</button>
                  <span className="mono" style={{ width: 24, textAlign: "center", fontSize: 13, fontWeight: 600, color: "#F8FAFC" }}>{item.qty}</span>
                  <button onClick={() => setQty(item.id, +1)} style={{ width: 26, height: 26, borderRadius: 7, background: "#3B82F618", border: "1px solid #3B82F630", color: "#3B82F6", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "background .12s" }} onMouseEnter={e => (e.currentTarget.style.background = "#3B82F628")} onMouseLeave={e => (e.currentTarget.style.background = "#3B82F618")}>+</button>
                </div>

                {/* Subtotal */}
                <div style={{ flexShrink: 0, textAlign: "right", minWidth: 70 }}>
                  <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC" }}>${AR(item.price * item.qty)}</span>
                </div>

                {/* Delete */}
                <button
                  onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))}
                  style={{ width: 24, height: 24, borderRadius: 6, background: "transparent", border: "none", color: "#334155", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "color .12s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#F43F5E")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#334155")}
                >
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total bar */}
      {cart.length > 0 && (
        <div style={{
          padding: "12px 14px", flexShrink: 0,
          borderTop: "1px solid #1A1F2E",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "#0E1018",
        }}>
          <div>
            <div style={{ fontSize: 11, color: "#475569", marginBottom: 1 }}>{cart.length} producto{cart.length > 1 ? "s" : ""} · {cart.reduce((s, i) => s + i.qty, 0)} unidades</div>
            <div style={{ fontSize: 11, color: "#334155" }}>IVA incluido</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#475569", marginBottom: 1 }}>TOTAL</div>
            <div className="mono" style={{ fontSize: 26, fontWeight: 700, color: "#3B82F6", lineHeight: 1 }}>${AR(total)}</div>
          </div>
        </div>
      )}
    </div>
  );

  const PayPanel = (
    <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", height: "100%" }}>
      <div style={{ overflowY: "auto", flex: 1, padding: "12px 14px" }}>

        {/* Method selector */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".08em", color: "#334155", textTransform: "uppercase", marginBottom: 8 }}>Medio de Pago</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
            {[
              { key: "efectivo", label: "Efectivo", sub: "Cambio automático", emoji: "💵", accent: "#10B981" },
              { key: "qr_rpg",   label: "QR RPG / Neira", sub: "4% comisión", emoji: "📲", accent: "#8B5CF6" },
              { key: "qr_mp",    label: "QR Mercado Pago", sub: "3.81% comisión", emoji: "💙", accent: "#3B82F6" },
              { key: "quiniela", label: "Quiniela", sub: "70/30 split", emoji: "🎰", accent: "#F59E0B" },
            ].map(m => {
              const sel = pay === m.key;
              return (
                <button
                  key={m.key}
                  onClick={() => setPay(m.key as PayMethod)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "flex-start",
                    padding: "10px 11px", borderRadius: 12, cursor: "pointer",
                    background: sel ? `${m.accent}18` : "#0B0D13",
                    border: sel ? `1px solid ${m.accent}50` : "1px solid #1A1F2E",
                    transition: "all .15s",
                  }}
                >
                  <span style={{ fontSize: 20, marginBottom: 5 }}>{m.emoji}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: sel ? m.accent : "#94A3B8" }}>{m.label}</span>
                  <span style={{ fontSize: 10, color: "#334155", marginTop: 1 }}>{m.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Efectivo */}
        {pay === "efectivo" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 5 }}>Monto Recibido ($)</label>
              <input value={cash} onChange={e => setCash(e.target.value)} placeholder="0" className="kc-input mono" style={{ width: "100%", padding: "10px 12px", fontSize: 18, fontWeight: 700 }} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {["1000","2000","5000","10000","20000"].map(v => (
                <button key={v} onClick={() => setCash(v)} className="kc-btn-ghost mono" style={{ padding: "5px 10px", fontSize: 12, borderRadius: 8 }}>${parseInt(v).toLocaleString("es-AR")}</button>
              ))}
            </div>
            {cashNum > 0 && (
              <div style={{
                padding: "14px 14px", borderRadius: 12,
                background: change >= 0 ? "#10B98112" : "#F43F5E12",
                border: `1px solid ${change >= 0 ? "#10B98140" : "#F43F5E40"}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontSize: 13, color: "#64748B" }}>Vuelto / Cambio</span>
                <span className="mono" style={{ fontSize: 24, fontWeight: 800, color: change >= 0 ? "#10B981" : "#F43F5E" }}>${AR(change)}</span>
              </div>
            )}
          </div>
        )}

        {/* QR */}
        {(pay === "qr_rpg" || pay === "qr_mp") && total > 0 && (
          <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #1E2436" }}>
            {[
              { label: "Monto Bruto", val: AR(total), color: "#F8FAFC" },
              { label: `Comisión gateway (${(feeRate*100).toFixed(2)}%)`, val: `−$${AR(total * feeRate)}`, color: "#F43F5E" },
              ...(hasCigs ? [{ label: "Recargo digital cigarrillos (+10%)", val: `−$${AR(total * 0.10)}`, color: "#F59E0B" }] : []),
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 12px", background: i % 2 === 0 ? "#0B0D13" : "#0E1018", borderBottom: "1px solid #131722" }}>
                <span style={{ fontSize: 12, color: "#64748B" }}>{row.label}</span>
                <span className="mono" style={{ fontSize: 13, fontWeight: 600, color: row.color }}>{row.val}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 12px", background: "#8B5CF612" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8" }}>Neto a recibir</span>
              <span className="mono" style={{ fontSize: 16, fontWeight: 700, color: "#8B5CF6" }}>${AR(netQR)}</span>
            </div>
          </div>
        )}

        {/* Quiniela */}
        {pay === "quiniela" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 5 }}>Recaudación Bruta ($)</label>
              <input value={quinGross} onChange={e => setQuinGross(e.target.value)} placeholder="0" className="kc-input mono" style={{ width: "100%", padding: "10px 12px", fontSize: 18, fontWeight: 700 }} />
            </div>
            {quinNet > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                {[
                  { label: "Remisión Agencia", pct: "70%", val: quinNet * .70, color: "#F43F5E" },
                  { label: "Comisión Local", pct: "30%", val: quinNet * .30, color: "#F59E0B" },
                ].map(r => (
                  <div key={r.label} style={{ padding: "10px 12px", borderRadius: 10, background: "#0B0D13", border: "1px solid #1E2436" }}>
                    <div style={{ fontSize: 10, color: "#475569", marginBottom: 2 }}>{r.label}</div>
                    <div className="mono" style={{ fontSize: 15, fontWeight: 700, color: r.color }}>${AR(r.val)}</div>
                    <div className="mono" style={{ fontSize: 10, color: "#334155", marginTop: 1 }}>{r.pct}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ padding: "10px 14px 14px", flexShrink: 0, borderTop: "1px solid #131722", display: "flex", flexDirection: "column", gap: 7 }}>
        <button className="kc-btn-primary" style={{ width: "100%", padding: "13px", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M5 13l4 4L19 7"/></svg>
          Completar Venta {total > 0 && <span className="mono" style={{ opacity: .85 }}>· ${AR(total)}</span>}
        </button>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
          {[
            { label: "🖨 Ticket 80mm", title: "Imprimir Ticket Térmico" },
            { label: "📒 Fiado / CC",   title: "Cuenta Corriente" },
          ].map(b => (
            <button key={b.label} className="kc-btn-ghost" style={{ padding: "9px 0", fontSize: 12, textAlign: "center" }} title={b.title}>{b.label}</button>
          ))}
        </div>
        <button className="kc-btn-ghost" style={{ width: "100%", padding: "9px", fontSize: 12, color: "#334155" }}>👤 Consumo Personal al Costo</button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop: split layout ─────────────────────────── */}
      <div className="hidden lg:flex" style={{ height: "100%", overflow: "hidden" }}>
        {/* Left — cart */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          {CartPanel}
        </div>
        {/* Right — payment */}
        <div style={{ width: 320, flexShrink: 0, borderLeft: "1px solid #131722", display: "flex", flexDirection: "column", overflow: "hidden", background: "#0E1018" }}>
          {PayPanel}
        </div>
      </div>

      {/* ── Mobile: tabs ─────────────────────────────────── */}
      <div className="flex lg:hidden" style={{ height: "100%", flexDirection: "column", overflow: "hidden" }}>
        {/* Tab bar */}
        <div style={{ display: "flex", borderBottom: "1px solid #131722", flexShrink: 0, background: "#0E1018" }}>
          {(["cart", "pay"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              style={{
                flex: 1, padding: "10px 0", fontSize: 13, fontWeight: 600,
                background: "none", border: "none", cursor: "pointer",
                color: mobileTab === tab ? "#3B82F6" : "#334155",
                borderBottom: `2px solid ${mobileTab === tab ? "#3B82F6" : "transparent"}`,
                marginBottom: -1, transition: "color .12s",
              }}
            >{tab === "cart" ? `🛒 Carrito${cart.length > 0 ? ` (${cart.length})` : ""}` : "💳 Pago"}</button>
          ))}
        </div>
        {/* Content */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {mobileTab === "cart" ? CartPanel : PayPanel}
        </div>
      </div>

      {/* ── Scan modal ────────────────────────────────────── */}
      {scanOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "#0B0D13CC", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setScanOpen(false)}>
          <div style={{ width: "100%", maxWidth: 360, background: "#1A1F2E", border: "1px solid #242B3D", borderRadius: 20, padding: 20 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontWeight: 600, fontSize: 15, color: "#F8FAFC" }}>Escanear Código</h3>
              <button onClick={() => setScanOpen(false)} className="kc-btn-ghost" style={{ width: 30, height: 30, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
            <BarcodeScanner onScan={(code) => { /* handle scan */ console.log(code) }} onClose={() => setScanOpen(false)} />
            <button onClick={() => setScanOpen(false)} className="kc-btn-ghost" style={{ width: "100%", padding: "10px", marginTop: 12, textAlign: "center" }}>Cancelar</button>
          </div>
        </div>
      )}
      
      {showQuickAdd && (
          <ProductModal onClose={() => setShowQuickAdd(false)} />
      )}
    </>
  );
}
