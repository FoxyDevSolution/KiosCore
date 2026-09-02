import { useState } from "react";

const AR = (n: number) => n.toLocaleString("es-AR");

interface Purchase { date: string; items: string; total: number; paid: boolean }
interface Customer {
  id: number; name: string; phone: string; debt: number;
  lastPayment: string; vip: boolean; vipDiscount: number;
  history: Purchase[];
}

const CUSTOMERS: Customer[] = [
  {
    id: 1, name: "María González", phone: "2614-555-001", debt: 8500,
    lastPayment: "2026-08-20", vip: true, vipDiscount: 5,
    history: [
      { date: "2026-08-25", items: "Coca-Cola ×2, Alfajor ×3", total: 8200, paid: false },
      { date: "2026-08-15", items: "Marlboro ×1, Sprite ×2",   total: 7750, paid: true  },
      { date: "2026-07-30", items: "Agua ×4, Chicles ×3",       total: 6750, paid: true  },
    ],
  },
  {
    id: 2, name: "Carlos Pérez", phone: "2614-555-002", debt: 0,
    lastPayment: "2026-09-01", vip: false, vipDiscount: 0,
    history: [
      { date: "2026-09-01", items: "Lucky Strike ×2, Agua ×3", total: 11400, paid: true },
    ],
  },
  {
    id: 3, name: "Laura Fernández", phone: "2614-555-003", debt: 23400,
    lastPayment: "2026-07-10", vip: false, vipDiscount: 0,
    history: [
      { date: "2026-08-28", items: "Marlboro ×3, Coca-Cola ×5", total: 21850, paid: false },
      { date: "2026-08-10", items: "Alfajor ×10, Sprite ×4",    total: 28000, paid: false },
      { date: "2026-07-10", items: "Fanta ×6",                  total: 10800, paid: true  },
    ],
  },
  {
    id: 4, name: "Diego Morales", phone: "2614-555-004", debt: 4200,
    lastPayment: "2026-08-28", vip: true, vipDiscount: 10,
    history: [
      { date: "2026-08-30", items: "Lucky Strike ×1, Agua ×2", total: 6300, paid: false },
      { date: "2026-08-20", items: "Marlboro ×2",               total: 8400, paid: true  },
    ],
  },
  {
    id: 5, name: "Ana Rodríguez", phone: "2614-555-005", debt: 0,
    lastPayment: "2026-09-01", vip: true, vipDiscount: 8,
    history: [
      { date: "2026-09-01", items: "Alfajor ×5, Coca-Cola ×3", total: 16050, paid: true },
    ],
  },
];

export default function Customers() {
  const [data, setData]       = useState<Customer[]>(CUSTOMERS);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [search, setSearch]   = useState("");
  const [showPay, setShowPay] = useState(false);
  const [payAmt, setPayAmt]   = useState("");
  const [payNote, setPayNote] = useState("");

  const filtered = data.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const confirm = () => {
    if (!selected || !payAmt) return;
    const amt = parseFloat(payAmt) || 0;
    const updated = data.map(c => c.id === selected.id
      ? { ...c, debt: Math.max(0, c.debt - amt), lastPayment: new Date().toISOString().split("T")[0] }
      : c
    );
    setData(updated);
    setSelected(updated.find(c => c.id === selected.id) ?? null);
    setShowPay(false);
    setPayAmt("");
    setPayNote("");
  };

  const toggleVip = (id: number) => {
    const updated = data.map(c => c.id === id ? { ...c, vip: !c.vip, vipDiscount: !c.vip ? 5 : 0 } : c);
    setData(updated);
    if (selected?.id === id) setSelected(updated.find(c => c.id === id) ?? null);
  };

  const totalDebt = data.reduce((s, c) => s + c.debt, 0);

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>

      {/* ── List panel ─────────────────────────────────────── */}
      <div style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", overflow: "hidden", borderRight: "1px solid #131722" }}>
        {/* Stats header */}
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #131722", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>Clientes & Fiados</div>
              <div style={{ fontSize: 11, color: "#334155", marginTop: 1 }}>{data.length} clientes registrados</div>
            </div>
            <button className="kc-btn-primary" style={{ padding: "5px 11px", fontSize: 11 }}>+ Nuevo</button>
          </div>
          {/* Debt summary */}
          <div style={{ padding: "9px 12px", background: "#F43F5E0C", border: "1px solid #F43F5E25", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#64748B" }}>Deuda total en sistema</span>
            <span className="mono" style={{ fontSize: 14, fontWeight: 800, color: "#F43F5E" }}>${AR(totalDebt)}</span>
          </div>
          {/* Search */}
          <div style={{ position: "relative", marginTop: 8 }}>
            <svg style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }} width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#334155" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4-4"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente…" className="kc-input" style={{ width: "100%", paddingLeft: 28, paddingRight: 10, paddingTop: 7, paddingBottom: 7, fontSize: 12 }} />
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.map(c => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              style={{
                width: "100%", padding: "11px 14px", cursor: "pointer",
                borderBottom: "1px solid #0E1018", textAlign: "left",
                background: selected?.id === c.id ? "#131722" : "transparent",
                border: "none",
                borderLeft: selected?.id === c.id ? "2px solid #3B82F6" : "2px solid transparent",
                transition: "all .12s",
              }}
              onMouseEnter={e => { if (selected?.id !== c.id) e.currentTarget.style.background = "#0E1018"; }}
              onMouseLeave={e => { if (selected?.id !== c.id) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                  background: c.debt > 0 ? "#F43F5E15" : "#10B98115",
                  border: `1px solid ${c.debt > 0 ? "#F43F5E30" : "#10B98130"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800, color: c.debt > 0 ? "#F43F5E" : "#10B981",
                }}>{c.name.charAt(0)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                    {c.vip && <span className="badge" style={{ background: "#F59E0B18", color: "#F59E0B", fontSize: 9, flexShrink: 0 }}>VIP {c.vipDiscount}%</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "#334155", marginTop: 2 }}>{c.phone}</div>
                </div>
                <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: c.debt > 0 ? "#F43F5E" : "#10B981", flexShrink: 0 }}>
                  {c.debt > 0 ? `−$${AR(c.debt)}` : "✓"}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Detail panel ──────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {!selected ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, opacity: .35 }}>
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#475569" strokeWidth={1.2}><path strokeLinecap="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            <p style={{ fontSize: 13, color: "#334155" }}>Seleccioná un cliente para ver su historial</p>
          </div>
        ) : (
          <>
            {/* Customer header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #131722", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 13, flexShrink: 0,
                    background: selected.debt > 0 ? "#F43F5E12" : "#10B98112",
                    border: `1px solid ${selected.debt > 0 ? "#F43F5E30" : "#10B98130"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, fontWeight: 800, color: selected.debt > 0 ? "#F43F5E" : "#10B981",
                  }}>{selected.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>{selected.name}</div>
                    <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>📞 {selected.phone}</div>
                    <div style={{ fontSize: 11, color: "#334155", marginTop: 1 }}>
                      Últ. pago: <span className="mono">{new Date(selected.lastPayment).toLocaleDateString("es-AR")}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => toggleVip(selected.id)}
                    style={{
                      padding: "7px 13px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer",
                      background: selected.vip ? "#F59E0B18" : "#1E2436",
                      border: `1px solid ${selected.vip ? "#F59E0B40" : "#242B3D"}`,
                      color: selected.vip ? "#F59E0B" : "#64748B",
                      transition: "all .15s",
                    }}
                  >★ {selected.vip ? `VIP · ${selected.vipDiscount}%` : "VIP"}</button>
                  <button
                    onClick={() => setShowPay(true)}
                    style={{
                      padding: "7px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer",
                      background: "#10B98118", border: "1px solid #10B98140", color: "#10B981",
                      display: "flex", alignItems: "center", gap: 6,
                    }}
                  >
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" d="M12 6v12m-6-6h12"/></svg>
                    Registrar Pago
                  </button>
                </div>
              </div>

              {/* Debt + stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 8, marginTop: 14 }}>
                <div style={{
                  padding: "11px 14px", borderRadius: 11,
                  background: selected.debt > 0 ? "#F43F5E0C" : "#10B9810C",
                  border: `1px solid ${selected.debt > 0 ? "#F43F5E30" : "#10B98130"}`,
                }}>
                  <div style={{ fontSize: 10, color: "#475569", marginBottom: 3 }}>Deuda Total</div>
                  <div className="mono" style={{ fontSize: 22, fontWeight: 800, color: selected.debt > 0 ? "#F43F5E" : "#10B981", lineHeight: 1 }}>
                    {selected.debt > 0 ? `$${AR(selected.debt)}` : "Sin deuda"}
                  </div>
                </div>
                <div style={{ padding: "11px 14px", borderRadius: 11, background: "#0E1018", border: "1px solid #1A1F2E" }}>
                  <div style={{ fontSize: 10, color: "#475569", marginBottom: 3 }}>Compras registradas</div>
                  <div className="mono" style={{ fontSize: 22, fontWeight: 800, color: "#E2E8F0", lineHeight: 1 }}>{selected.history.length}</div>
                </div>
                <div style={{ padding: "11px 14px", borderRadius: 11, background: "#0E1018", border: "1px solid #1A1F2E" }}>
                  <div style={{ fontSize: 10, color: "#475569", marginBottom: 3 }}>Total consumido</div>
                  <div className="mono" style={{ fontSize: 22, fontWeight: 800, color: "#E2E8F0", lineHeight: 1 }}>${AR(selected.history.reduce((s, p) => s + p.total, 0))}</div>
                </div>
              </div>
            </div>

            {/* History timeline */}
            <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".07em", color: "#334155", textTransform: "uppercase", marginBottom: 12 }}>Historial de Compras Fiadas</div>
              <div style={{ position: "relative" }}>
                {/* Timeline line */}
                <div style={{ position: "absolute", left: 15, top: 0, bottom: 0, width: 1, background: "#131722" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {selected.history.map((p, i) => (
                    <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      {/* Dot */}
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                        background: p.paid ? "#10B98118" : "#F43F5E18",
                        border: `1px solid ${p.paid ? "#10B98140" : "#F43F5E40"}`,
                        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1,
                      }}>
                        <span style={{ fontSize: 12, color: p.paid ? "#10B981" : "#F43F5E" }}>{p.paid ? "✓" : "⋯"}</span>
                      </div>
                      {/* Card */}
                      <div style={{
                        flex: 1, padding: "11px 14px", borderRadius: 12,
                        background: "#131722", border: "1px solid #1E2436",
                        marginBottom: 2,
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                          <div>
                            <span className="mono" style={{ fontSize: 11, color: "#475569" }}>{new Date(p.date).toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" })}</span>
                            <span className="badge" style={{
                              background: p.paid ? "#10B98115" : "#F43F5E15",
                              color: p.paid ? "#10B981" : "#F43F5E",
                              marginLeft: 8,
                            }}>{p.paid ? "Pagado" : "Pendiente"}</span>
                          </div>
                          <span className="mono" style={{ fontSize: 15, fontWeight: 700, color: p.paid ? "#64748B" : "#F43F5E" }}>${AR(p.total)}</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#94A3B8" }}>{p.items}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Payment modal ─────────────────────────────────── */}
      {showPay && selected && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "#0B0D13D0", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShowPay(false)}>
          <div style={{ width: "100%", maxWidth: 400, background: "#1A1F2E", border: "1px solid #242B3D", borderRadius: 20, padding: 22, boxShadow: "0 8px 64px #00000080" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#F8FAFC" }}>Registrar Pago</h3>
              <button onClick={() => setShowPay(false)} className="kc-btn-ghost" style={{ width: 30, height: 30, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }}>✕</button>
            </div>

            <div style={{ padding: "10px 14px", background: "#F43F5E0C", border: "1px solid #F43F5E25", borderRadius: 10, marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "#64748B" }}>Deuda actual · {selected.name}</span>
              <span className="mono" style={{ fontSize: 14, fontWeight: 800, color: "#F43F5E" }}>${AR(selected.debt)}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 5 }}>Monto Recibido ($)</label>
                <input value={payAmt} onChange={e => setPayAmt(e.target.value)} type="number" placeholder="0" className="kc-input mono" style={{ width: "100%", padding: "11px 13px", fontSize: 20, fontWeight: 800 }} />
                {/* Quick amounts */}
                <div style={{ display: "flex", gap: 6, marginTop: 7 }}>
                  {[1000, 2000, 5000, selected.debt].filter(Boolean).slice(0, 4).map(v => (
                    <button key={v} onClick={() => setPayAmt(String(v))} className="kc-btn-ghost mono" style={{ flex: 1, padding: "5px 0", fontSize: 11, textAlign: "center" }}>${AR(v)}</button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 5 }}>Nota (opcional)</label>
                <input value={payNote} onChange={e => setPayNote(e.target.value)} placeholder="Ej: pago parcial efectivo" className="kc-input" style={{ width: "100%", padding: "9px 12px", fontSize: 13 }} />
              </div>

              {payAmt && (
                <div style={{ padding: "10px 14px", background: "#10B9810C", border: "1px solid #10B98130", borderRadius: 10, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>Deuda restante</span>
                  <span className="mono" style={{ fontSize: 14, fontWeight: 800, color: "#10B981" }}>${AR(Math.max(0, selected.debt - (parseFloat(payAmt) || 0)))}</span>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button onClick={() => setShowPay(false)} className="kc-btn-ghost" style={{ flex: 1, padding: "11px 0", textAlign: "center", fontSize: 14 }}>Cancelar</button>
              <button onClick={confirm} style={{ flex: 2, padding: "11px 0", background: "#10B981", color: "#fff", fontWeight: 700, fontSize: 14, borderRadius: 12, border: "none", cursor: "pointer", transition: "opacity .12s, transform .1s" }} onMouseEnter={e => (e.currentTarget.style.opacity = ".88")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>✓ Confirmar Pago</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
