import { useState } from "react";

const AR = (n: number) => n.toLocaleString("es-AR", { maximumFractionDigits: 0 });

export default function ProductModal({ onClose }: { onClose: () => void }) {
  const [barcode, setBarcode]     = useState("");
  const [name, setName]           = useState("");
  const [cat, setCat]             = useState<"Kiosco" | "Cigarrillos">("Kiosco");
  const [cost, setCost]           = useState("");
  const [margin, setMargin]       = useState("30");
  const [rounding, setRounding]   = useState(true);
  const [stock, setStock]         = useState("");
  const [minStock, setMinStock]   = useState("");
  const [expiry, setExpiry]       = useState("");

  const costN   = parseFloat(cost) || 0;
  const marginN = parseFloat(margin) || 0;
  const raw     = costN * (1 + marginN / 100);
  const rounded = rounding ? Math.ceil(raw / 10) * 10 : raw;
  const repoPct = rounded > 0 ? (costN / rounded) * 100 : 0;
  const threshold = cat === "Cigarrillos" ? 90 : 63;
  const overThreshold = repoPct > threshold;
  const hasCalc = costN > 0 && marginN > 0;

  const InputField = ({
    label, value, onChange, type = "text", placeholder = "", accent,
  }: {
    label: string; value: string; onChange: (v: string) => void;
    type?: string; placeholder?: string; accent?: string;
  }) => (
    <div>
      <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 5, fontWeight: 500 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="kc-input"
        style={{ width: "100%", padding: "9px 11px", fontSize: 13 }}
        onFocus={e => { e.currentTarget.style.borderColor = accent || "#3B82F660"; e.currentTarget.style.boxShadow = `0 0 0 3px ${(accent || "#3B82F6") + "18"}`; }}
        onBlur={e => { e.currentTarget.style.borderColor = "#242B3D"; e.currentTarget.style.boxShadow = "none"; }}
      />
    </div>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ height: 1, flex: 1, background: "#1E2436" }} />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em", color: "#334155", textTransform: "uppercase" }}>{title}</span>
        <div style={{ height: 1, flex: 1, background: "#1E2436" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "#0B0D13D0", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }} className="sm:items-center" onClick={onClose}>
      <div
        style={{
          width: "100%", maxWidth: 520,
          maxHeight: "92vh", overflowY: "auto",
          background: "#131722",
          borderRadius: "20px 20px 0 0",
          border: "1px solid #1E2436",
          boxShadow: "0 -8px 64px #00000080",
        }}
        className="sm:rounded-[20px]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          position: "sticky", top: 0, background: "#131722", zIndex: 10,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px 14px",
          borderBottom: "1px solid #1E2436",
        }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-.01em" }}>Nuevo Producto</h2>
            <p style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>Calculadora de reposición integrada</p>
          </div>
          <button onClick={onClose} className="kc-btn-ghost" style={{ width: 32, height: 32, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 9 }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 20 }}>

          <Section title="Identificación">
            <InputField label="Código de Barras" value={barcode} onChange={setBarcode} placeholder="7790001234567" />
            <InputField label="Nombre del Producto" value={name} onChange={setName} placeholder="Ej: Coca-Cola 500 ml" />
            {/* Category toggle */}
            <div>
              <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 5, fontWeight: 500 }}>Categoría</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                {(["Kiosco", "Cigarrillos"] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    style={{
                      padding: "10px 0", borderRadius: 11, cursor: "pointer",
                      fontWeight: 600, fontSize: 13,
                      background: cat === c ? (c === "Cigarrillos" ? "#8B5CF618" : "#3B82F618") : "#0B0D13",
                      border: cat === c ? `1px solid ${c === "Cigarrillos" ? "#8B5CF650" : "#3B82F650"}` : "1px solid #1E2436",
                      color: cat === c ? (c === "Cigarrillos" ? "#8B5CF6" : "#3B82F6") : "#475569",
                      transition: "all .15s",
                    }}
                  >
                    {c === "Cigarrillos" ? "🚬 " : "🛍️ "}{c}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          <Section title="Precio y Margen">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <InputField label="Costo de Compra ($)" value={cost} onChange={setCost} type="number" placeholder="0" accent="#10B981" />
              <InputField label="Margen de Ganancia (%)" value={margin} onChange={setMargin} type="number" placeholder="30" accent="#3B82F6" />
            </div>

            {/* Margin slider */}
            <div style={{ paddingTop: 2 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: "#334155" }}>0%</span>
                <span className="mono" style={{ fontSize: 11, color: "#3B82F6", fontWeight: 600 }}>{marginN}%</span>
                <span style={{ fontSize: 11, color: "#334155" }}>100%</span>
              </div>
              <input type="range" min={0} max={100} value={marginN} onChange={e => setMargin(e.target.value)} />
            </div>

            {/* Result card */}
            {hasCalc && (
              <div style={{
                borderRadius: 13, overflow: "hidden",
                border: "1px solid #1E2436",
                background: "#0B0D13",
              }}>
                {/* Price display */}
                <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #131722" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#475569", marginBottom: 3 }}>Precio Venta Sugerido</div>
                    <div className="mono" style={{ fontSize: 28, fontWeight: 800, color: "#3B82F6", lineHeight: 1 }}>${AR(rounded)}</div>
                    {rounding && raw !== rounded && (
                      <div className="mono" style={{ fontSize: 11, color: "#334155", marginTop: 3 }}>Sin redondeo: ${AR(raw)}</div>
                    )}
                  </div>
                  {/* Rounding toggle */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                    <span style={{ fontSize: 10, color: "#475569" }}>Redondeo comercial</span>
                    <div
                      className="kc-toggle-track"
                      style={{ background: rounding ? "#3B82F6" : "#1E2436", cursor: "pointer" }}
                      onClick={() => setRounding(!rounding)}
                    >
                      <div className="kc-toggle-thumb" style={{ transform: rounding ? "translateX(16px)" : "translateX(0)" }} />
                    </div>
                  </div>
                </div>

                {/* Repo pct */}
                <div style={{
                  padding: "12px 16px",
                  background: overThreshold ? "#F43F5E0C" : "#10B9810C",
                  borderTop: `1px solid ${overThreshold ? "#F43F5E30" : "#10B98130"}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: overThreshold ? "#F43F5E" : "#10B981" }}>
                        {overThreshold ? "⚠ Alerta — Reposición alta" : "✓ Reposición en rango"}
                      </div>
                      <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>
                        Umbral {cat}: {threshold}% · Costo / Precio Venta
                      </div>
                    </div>
                    <span className="mono" style={{ fontSize: 22, fontWeight: 800, color: overThreshold ? "#F43F5E" : "#10B981" }}>
                      {repoPct.toFixed(1)}%
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="kc-bar-track">
                    <div className="kc-bar-fill" style={{
                      width: `${Math.min(100, repoPct)}%`,
                      background: overThreshold
                        ? "linear-gradient(90deg,#F59E0B,#F43F5E)"
                        : "linear-gradient(90deg,#3B82F6,#10B981)",
                    }} />
                  </div>
                  {overThreshold && (
                    <p style={{ fontSize: 11, color: "#F43F5E", marginTop: 8 }}>
                      El costo supera el umbral de seguridad. Aumentá el margen o revisá el precio de compra.
                    </p>
                  )}
                </div>
              </div>
            )}
          </Section>

          <Section title="Inventario">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <InputField label="Unidades Iniciales" value={stock} onChange={setStock} type="number" placeholder="0" />
              <InputField label="Stock Mínimo Alerta" value={minStock} onChange={setMinStock} type="number" placeholder="5" accent="#F59E0B" />
            </div>
            <InputField label="Fecha de Vencimiento" value={expiry} onChange={setExpiry} type="date" accent="#F59E0B" />
          </Section>
        </div>

        {/* Footer */}
        <div style={{
          position: "sticky", bottom: 0, background: "#131722",
          padding: "12px 20px 18px",
          borderTop: "1px solid #1E2436",
          display: "flex", gap: 10,
        }}>
          <button onClick={onClose} className="kc-btn-ghost" style={{ flex: 1, padding: "12px 0", fontSize: 14, textAlign: "center" }}>Cancelar</button>
          <button className="kc-btn-primary" style={{ flex: 2, padding: "12px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M5 13l4 4L19 7"/></svg>
            Guardar en Inventario
          </button>
        </div>
      </div>
    </div>
  );
}
