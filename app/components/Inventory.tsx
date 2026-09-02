import { useState } from "react";

const AR = (n: number) => n.toLocaleString("es-AR");
const TODAY = new Date();
const daysTo = (d: string) => Math.ceil((new Date(d).getTime() - TODAY.getTime()) / 86400000);

const DATA = [
  { id: 1, name: "Coca-Cola 500 ml",     cat: "Kiosco",      stock: 3,  min: 10, price: 1850, cost: 1200, expiry: "2026-10-15", offer: false },
  { id: 2, name: "Marlboro Rojo ×20",    cat: "Cigarrillos", stock: 12, min: 5,  price: 4200, cost: 3800, expiry: "2027-06-01", offer: false },
  { id: 3, name: "Agua Mineral 1.5 L",   cat: "Kiosco",      stock: 1,  min: 15, price: 1200, cost: 800,  expiry: "2026-09-20", offer: false },
  { id: 4, name: "Alfajor Havanna",      cat: "Kiosco",      stock: 8,  min: 10, price: 2100, cost: 1400, expiry: "2026-09-12", offer: true  },
  { id: 5, name: "Lucky Strike ×20",     cat: "Cigarrillos", stock: 4,  min: 3,  price: 3900, cost: 3500, expiry: "2027-03-01", offer: false },
  { id: 6, name: "Sprite 500 ml",        cat: "Kiosco",      stock: 20, min: 10, price: 1750, cost: 1100, expiry: "2026-12-01", offer: false },
  { id: 7, name: "Fanta Naranja 600 ml", cat: "Kiosco",      stock: 2,  min: 8,  price: 1800, cost: 1150, expiry: "2026-09-25", offer: false },
  { id: 8, name: "Philip Morris ×20",    cat: "Cigarrillos", stock: 6,  min: 5,  price: 4500, cost: 4100, expiry: "2027-04-01", offer: false },
];

type Filter = "all" | "low" | "expiry" | "offer";
type SortKey = "name" | "stock" | "price" | "expiry";

export default function Inventory() {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort]     = useState<SortKey>("name");
  const [asc, setAsc]       = useState(true);
  const [offerRow, setOfferRow] = useState<number | null>(null);
  const [offerPct, setOfferPct] = useState("15");

  const low    = DATA.filter(i => i.stock < i.min);
  const expiry = DATA.filter(i => daysTo(i.expiry) <= 30);
  const offers = DATA.filter(i => i.offer);

  const filtered = DATA
    .filter(i => {
      if (filter === "low")    return i.stock < i.min;
      if (filter === "expiry") return daysTo(i.expiry) <= 30;
      if (filter === "offer")  return i.offer;
      return true;
    })
    .sort((a, b) => {
      const dir = asc ? 1 : -1;
      if (sort === "name")   return a.name.localeCompare(b.name) * dir;
      if (sort === "stock")  return (a.stock - b.stock) * dir;
      if (sort === "price")  return (a.price - b.price) * dir;
      if (sort === "expiry") return (new Date(a.expiry).getTime() - new Date(b.expiry).getTime()) * dir;
      return 0;
    });

  const toggleSort = (key: SortKey) => {
    if (sort === key) setAsc(!asc);
    else { setSort(key); setAsc(true); }
  };

  const SortTh = ({ label, k }: { label: string; k: SortKey }) => (
    <th className="kc-table" style={{ cursor: "pointer", userSelect: "none" }} onClick={() => toggleSort(k)}>
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {label}
        <span style={{ opacity: sort === k ? 1 : .2, color: "#3B82F6" }}>{sort === k ? (asc ? "↑" : "↓") : "↕"}</span>
      </span>
    </th>
  );

  const shoppingText = low.map(i => `• ${i.name}: necesitás ${i.min - i.stock} unidades (stock actual: ${i.stock})`).join("\n");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* ── Header ────────────────────────────────────────── */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #131722", flexShrink: 0 }}>
        {/* Stats row */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12, overflowX: "auto" }}>
          {[
            { label: "Total Productos", val: DATA.length, color: "#F8FAFC", sub: "en catálogo" },
            { label: "Bajo Stock",      val: low.length,    color: "#F43F5E", sub: `< mín requerido` },
            { label: "Próx. a Vencer",  val: expiry.length, color: "#F59E0B", sub: "≤ 30 días" },
            { label: "En Oferta",       val: offers.length, color: "#10B981", sub: "activas" },
          ].map(s => (
            <div key={s.label} style={{
              padding: "10px 14px", background: "#0E1018", border: "1px solid #1A1F2E",
              borderRadius: 10, flexShrink: 0,
            }}>
              <div style={{ fontSize: 10, color: "#334155" }}>{s.label}</div>
              <div className="mono" style={{ fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1.1 }}>{s.val}</div>
              <div style={{ fontSize: 10, color: "#334155", marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Filter + actions row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6, flex: 1, flexWrap: "wrap" }}>
            {([
              { key: "all",    label: "Todos",             count: DATA.length,    c: "#3B82F6" },
              { key: "low",    label: "Bajo Stock",        count: low.length,    c: "#F43F5E" },
              { key: "expiry", label: "Próximos a Vencer", count: expiry.length, c: "#F59E0B" },
              { key: "offer",  label: "En Oferta",         count: offers.length, c: "#10B981" },
            ] as { key: Filter; label: string; count: number; c: string }[]).map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "5px 11px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                  background: filter === f.key ? `${f.c}18` : "#0E1018",
                  border: filter === f.key ? `1px solid ${f.c}50` : "1px solid #1A1F2E",
                  color: filter === f.key ? f.c : "#475569",
                  cursor: "pointer", transition: "all .12s",
                }}
              >
                {f.label}
                <span className="mono" style={{ fontSize: 10, background: "#0B0D1380", padding: "1px 5px", borderRadius: 4 }}>{f.count}</span>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 7 }}>
            <button
              onClick={() => navigator.clipboard?.writeText(`📦 *Lista de Compras KiosCore*\n\n${shoppingText}`)}
              className="kc-btn-ghost"
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 11px", fontSize: 12 }}
            >
              📱 WhatsApp
            </button>
            <button className="kc-btn-primary" style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 13px", fontSize: 12 }}>
              📋 Lista de Compras
            </button>
          </div>
        </div>
      </div>

      {/* ── Desktop table ─────────────────────────────────── */}
      <div className="hidden md:block" style={{ flex: 1, overflowY: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#0B0D13", position: "sticky", top: 0, zIndex: 2 }}>
            <tr style={{ borderBottom: "1px solid #131722" }}>
              <SortTh label="Producto" k="name" />
              <th className="kc-table" style={{ color: "#475569" }}>Cat.</th>
              <SortTh label="Stock" k="stock" />
              <SortTh label="Vencimiento" k="expiry" />
              <SortTh label="Precio" k="price" />
              <th className="kc-table" style={{ color: "#475569" }}>Costo</th>
              <th className="kc-table" style={{ color: "#475569" }}>Margen</th>
              <th className="kc-table" style={{ color: "#475569" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, idx) => {
              const isLow     = item.stock < item.min;
              const days      = daysTo(item.expiry);
              const isExpiry  = days <= 30;
              const margin    = ((item.price - item.cost) / item.price * 100).toFixed(0);
              return (
                <>
                  <tr
                    key={item.id}
                    style={{ background: idx % 2 === 0 ? "#0B0D13" : "#0D0F18", transition: "background .1s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#131722")}
                    onMouseLeave={e => (e.currentTarget.style.background = idx % 2 === 0 ? "#0B0D13" : "#0D0F18")}
                  >
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid #0E1018" }}>
                      <div style={{ fontWeight: 500, fontSize: 13, color: "#E2E8F0" }}>{item.name}</div>
                      {item.offer && <span className="badge" style={{ background: "#10B98118", color: "#10B981", marginTop: 3 }}>Oferta</span>}
                    </td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid #0E1018" }}>
                      <span className="badge" style={{ background: item.cat === "Cigarrillos" ? "#8B5CF618" : "#3B82F618", color: item.cat === "Cigarrillos" ? "#8B5CF6" : "#3B82F6" }}>{item.cat}</span>
                    </td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid #0E1018" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span className="mono" style={{ fontWeight: 700, fontSize: 14, color: isLow ? "#F43F5E" : "#E2E8F0" }}>{item.stock}</span>
                        {isLow && <span className="badge" style={{ background: "#F43F5E15", color: "#F43F5E", fontSize: 10 }}>min {item.min}</span>}
                      </div>
                      {/* Mini stock bar */}
                      <div className="kc-bar-track" style={{ width: 60, marginTop: 4 }}>
                        <div className="kc-bar-fill" style={{ width: `${Math.min(100, item.stock / item.min * 100)}%`, background: isLow ? "#F43F5E" : "#10B981" }} />
                      </div>
                    </td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid #0E1018" }}>
                      <span className="mono" style={{ fontSize: 12, color: isExpiry ? "#F59E0B" : "#475569" }}>
                        {new Date(item.expiry).toLocaleDateString("es-AR")}
                      </span>
                      {isExpiry && <span className="badge" style={{ background: "#F59E0B15", color: "#F59E0B", display: "block", marginTop: 2, fontSize: 10 }}>{days}d</span>}
                    </td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid #0E1018" }}>
                      <span className="mono" style={{ fontWeight: 700, fontSize: 13, color: "#F8FAFC" }}>${AR(item.price)}</span>
                    </td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid #0E1018" }}>
                      <span className="mono" style={{ fontSize: 12, color: "#64748B" }}>${AR(item.cost)}</span>
                    </td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid #0E1018" }}>
                      <span className="mono" style={{ fontSize: 12, color: "#10B981" }}>{margin}%</span>
                    </td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid #0E1018" }}>
                      <button
                        onClick={() => setOfferRow(offerRow === item.id ? null : item.id)}
                        style={{
                          padding: "4px 10px", borderRadius: 7, fontSize: 11, fontWeight: 600,
                          background: offerRow === item.id ? "#F59E0B20" : "#1A1F2E",
                          border: `1px solid ${offerRow === item.id ? "#F59E0B50" : "#242B3D"}`,
                          color: offerRow === item.id ? "#F59E0B" : "#64748B",
                          cursor: "pointer", transition: "all .12s",
                        }}
                      >% Oferta</button>
                    </td>
                  </tr>
                  {offerRow === item.id && (
                    <tr key={`offer-${item.id}`} style={{ background: "#F59E0B08" }}>
                      <td colSpan={8} style={{ padding: "10px 14px", borderBottom: "1px solid #0E1018" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 13, color: "#94A3B8" }}>Descuento sobre <strong style={{ color: "#F8FAFC" }}>{item.name}</strong></span>
                          <input
                            value={offerPct}
                            onChange={e => setOfferPct(e.target.value)}
                            className="kc-input mono"
                            placeholder="% descuento"
                            style={{ width: 80, padding: "6px 10px", fontSize: 13 }}
                          />
                          <span className="mono" style={{ fontSize: 13, color: "#64748B" }}>
                            → Precio oferta: ${AR(item.price * (1 - Number(offerPct) / 100))}
                          </span>
                          <button className="kc-btn-primary" style={{ padding: "6px 14px", fontSize: 12 }}>Aplicar</button>
                          <button onClick={() => setOfferRow(null)} className="kc-btn-ghost" style={{ padding: "6px 10px", fontSize: 12 }}>Cancelar</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ─────────────────────────────────── */}
      <div className="md:hidden" style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(item => {
            const isLow    = item.stock < item.min;
            const days     = daysTo(item.expiry);
            const isExpiry = days <= 30;
            const margin   = ((item.price - item.cost) / item.price * 100).toFixed(0);
            return (
              <div key={item.id} style={{ background: "#131722", border: "1px solid #1E2436", borderRadius: 13, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                    <div style={{ display: "flex", gap: 5, marginTop: 4, flexWrap: "wrap" }}>
                      <span className="badge" style={{ background: item.cat === "Cigarrillos" ? "#8B5CF618" : "#3B82F618", color: item.cat === "Cigarrillos" ? "#8B5CF6" : "#3B82F6" }}>{item.cat}</span>
                      {isLow    && <span className="badge" style={{ background: "#F43F5E18", color: "#F43F5E" }}>Bajo stock</span>}
                      {isExpiry && <span className="badge" style={{ background: "#F59E0B18", color: "#F59E0B" }}>{days}d</span>}
                      {item.offer && <span className="badge" style={{ background: "#10B98118", color: "#10B981" }}>Oferta</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <span className="mono" style={{ fontSize: 16, fontWeight: 800, color: "#F8FAFC" }}>${AR(item.price)}</span>
                    <div className="mono" style={{ fontSize: 11, color: "#10B981" }}>{margin}% margen</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, color: "#475569" }}>Stock:</span>
                    <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: isLow ? "#F43F5E" : "#E2E8F0" }}>{item.stock}</span>
                    <span style={{ fontSize: 11, color: "#334155" }}>/ mín {item.min}</span>
                  </div>
                  <button
                    onClick={() => setOfferRow(offerRow === item.id ? null : item.id)}
                    style={{ padding: "4px 10px", borderRadius: 7, fontSize: 11, fontWeight: 600, background: "#F59E0B15", border: "1px solid #F59E0B30", color: "#F59E0B", cursor: "pointer" }}
                  >% Oferta</button>
                </div>
                {offerRow === item.id && (
                  <div style={{ marginTop: 10, display: "flex", gap: 7 }}>
                    <input value={offerPct} onChange={e => setOfferPct(e.target.value)} className="kc-input mono" placeholder="%" style={{ width: 70, padding: "7px 10px", fontSize: 13 }} />
                    <button className="kc-btn-primary" style={{ flex: 1, padding: "7px 0", fontSize: 12 }}>Aplicar ${AR(item.price * (1 - Number(offerPct) / 100))}</button>
                    <button onClick={() => setOfferRow(null)} className="kc-btn-ghost" style={{ padding: "7px 12px", fontSize: 12 }}>✕</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
