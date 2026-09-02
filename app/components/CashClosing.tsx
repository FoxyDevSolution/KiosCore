import { useState } from "react";

const AR = (n: number) => n.toLocaleString("es-AR", { maximumFractionDigits: 0 });
const num = (s: string) => parseFloat(s.replace(/\./g, "")) || 0;

interface SliderRowProps { label: string; pct: number; amount: number; color: string; onChange: (v: number) => void }
const SliderRow = ({ label, pct, amount, color, onChange }: SliderRowProps) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: "#94A3B8" }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="mono" style={{ fontSize: 11, fontWeight: 600, color, minWidth: 30, textAlign: "right" }}>{pct}%</span>
        <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", minWidth: 80, textAlign: "right" }}>${AR(amount)}</span>
      </div>
    </div>
    <div className="kc-bar-track">
      <div className="kc-bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
    <input type="range" min={0} max={100} value={pct} onChange={e => onChange(Number(e.target.value))} style={{ marginTop: 4 }} />
  </div>
);

const NumInput = ({ label, value, onChange, accent = "#3B82F6" }: { label: string; value: string; onChange: (v: string) => void; accent?: string }) => (
  <div>
    <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 4, fontWeight: 500 }}>{label}</label>
    <input
      type="number"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="0"
      className="kc-input mono"
      style={{ width: "100%", padding: "9px 11px", fontSize: 14, fontWeight: 600 }}
      onFocus={e => { e.currentTarget.style.borderColor = accent + "60"; e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}12`; }}
      onBlur={e => { e.currentTarget.style.borderColor = "#242B3D"; e.currentTarget.style.boxShadow = "none"; }}
    />
  </div>
);

const BoxHeader = ({ n, label, total, color }: { n: string; label: string; total: number; color: string }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}18`, border: `1px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 800, color }}>{n}</span>
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0" }}>{label}</div>
      </div>
    </div>
    <div className="mono" style={{ fontSize: 20, fontWeight: 800, color }}>${AR(total)}</div>
  </div>
);

export default function CashClosing() {
  const [cash1, setCash1]           = useState("84200");
  const [quinGross, setQuinGross]   = useState("45000");
  const [cash2, setCash2]           = useState("31500");
  const [sube, setSube]             = useState("8000");
  const [cVirtual, setCVirtual]     = useState("12000");
  const [claro, setClaro]           = useState("5000");
  const [recargas, setRecargas]     = useState("8");
  const [kQR, setKQR]               = useState("22000");
  const [cQR, setCQR]               = useState("9500");
  const [physical, setPhysical]     = useState("115700");

  const [kRepo, setKRepo]     = useState(63);
  const [kSuel, setKSuel]     = useState(27);
  const [kGast, setKGast]     = useState(10);
  const [cRepo, setCRepo]     = useState(90);
  const [cSuel, setCSuel]     = useState(10);

  const quinAgency  = num(quinGross) * .70;
  const quinComis   = num(quinGross) * .30;
  const kioscoNet   = num(cash1) - quinAgency;

  const recargasAmt   = num(recargas) * 200;
  const fondoRotativo = 50000;
  const totalPlatform = num(sube) + num(cVirtual) + num(claro) + recargasAmt;
  const cigsNet       = Math.max(0, num(cash2) - fondoRotativo - totalPlatform);

  const kQRnet = num(kQR);
  const cQRnet = num(cQR);
  const theoretical = num(cash1) + num(cash2);
  const deviation   = num(physical) - theoretical;

  const SectionCard = ({ children, title, accent = "#3B82F6" }: { children: React.ReactNode; title: string; accent?: string }) => (
    <div style={{ background: "#131722", border: "1px solid #1E2436", borderRadius: 14, padding: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".07em", color: accent, textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent }} />
        {title}
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ overflowY: "auto", height: "100%", padding: "16px" }}>
      {/* ── Summary bar ──────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 8, marginBottom: 16 }}>
        {[
          { label: "Total Cajas", val: theoretical, color: "#F8FAFC" },
          { label: "Kiosco Neto", val: kioscoNet,   color: "#3B82F6" },
          { label: "Tabaco Neto", val: cigsNet,     color: "#8B5CF6" },
          { label: "QR Total",   val: kQRnet + cQRnet, color: "#06B6D4" },
        ].map(s => (
          <div key={s.label} style={{ background: "#0E1018", border: "1px solid #1A1F2E", borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: "#334155", marginBottom: 4 }}>{s.label}</div>
            <div className="mono" style={{ fontSize: 18, fontWeight: 800, color: s.color }}>${AR(s.val)}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 14, alignItems: "start" }}>
        {/* ── CAJA 1 ─────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: "#0B0D13", border: "1px solid #1A1F2E", borderRadius: 14, padding: 16 }}>
            <BoxHeader n="1" label="Caja 1 — Quiniela & Kiosco" total={num(cash1)} color="#10B981" />
            <NumInput label="Total Efectivo en Caja 1 ($)" value={cash1} onChange={setCash1} accent="#10B981" />
          </div>

          <SectionCard title="Separación Quiniela" accent="#F59E0B">
            <NumInput label="Recaudación Bruta Quiniela ($)" value={quinGross} onChange={setQuinGross} accent="#F59E0B" />
            {num(quinGross) > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                {[
                  { label: "Remisión Agencia", pct: "70%", val: quinAgency, c: "#F43F5E" },
                  { label: "Comisión Local",   pct: "30%", val: quinComis, c: "#F59E0B" },
                ].map(r => (
                  <div key={r.label} style={{ padding: "10px 12px", background: "#0B0D13", border: "1px solid #1A1F2E", borderRadius: 10 }}>
                    <div style={{ fontSize: 10, color: "#475569" }}>{r.label} · <span className="mono" style={{ color: r.c }}>{r.pct}</span></div>
                    <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: r.c, marginTop: 3 }}>${AR(r.val)}</div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {kioscoNet > 0 && (
            <SectionCard title={`Distribución Kiosco Neto · $${AR(kioscoNet)}`} accent="#3B82F6">
              <SliderRow label="Reposición (Proveedores)" pct={kRepo} amount={kioscoNet * kRepo / 100} color="#3B82F6" onChange={setKRepo} />
              <SliderRow label="Sueldos / Ganancia"       pct={kSuel} amount={kioscoNet * kSuel / 100} color="#10B981" onChange={setKSuel} />
              <SliderRow label="Gastos Operativos"        pct={kGast} amount={kioscoNet * kGast / 100} color="#F59E0B" onChange={setKGast} />
              <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>
                {kRepo + kSuel + kGast !== 100 && (
                  <span style={{ color: "#F43F5E" }}>⚠ Suma: {kRepo + kSuel + kGast}% (debe ser 100%)</span>
                )}
              </div>
            </SectionCard>
          )}
        </div>

        {/* ── CAJA 2 ─────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: "#0B0D13", border: "1px solid #1A1F2E", borderRadius: 14, padding: 16 }}>
            <BoxHeader n="2" label="Caja 2 — Cigarrillos & Cargas" total={num(cash2)} color="#8B5CF6" />
            <NumInput label="Total Efectivo en Caja 2 ($)" value={cash2} onChange={setCash2} accent="#8B5CF6" />
          </div>

          <SectionCard title="Plataformas Digitales" accent="#06B6D4">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <NumInput label="Saldo SUBE"          value={sube}     onChange={setSube}     accent="#06B6D4" />
              <NumInput label="Carga Virtual"        value={cVirtual} onChange={setCVirtual} accent="#06B6D4" />
              <NumInput label="Saldo Claro"          value={claro}    onChange={setClaro}    accent="#06B6D4" />
              <NumInput label="Cantidad Recargas"    value={recargas} onChange={setRecargas} accent="#06B6D4" />
            </div>
            <div style={{ marginTop: 10, padding: "9px 12px", background: "#0B0D13", border: "1px solid #1A1F2E", borderRadius: 10, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "#64748B" }}>Fondo Rotativo (mín. $50.000)</span>
              <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: "#06B6D4" }}>${AR(fondoRotativo)}</span>
            </div>
            <div style={{ padding: "9px 12px", background: "#0B0D13", border: "1px solid #1A1F2E", borderRadius: 10, display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 12, color: "#64748B" }}>Total plataformas</span>
              <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>${AR(totalPlatform)}</span>
            </div>
          </SectionCard>

          {cigsNet > 0 && (
            <SectionCard title={`Distribución Tabaco Neto · $${AR(cigsNet)}`} accent="#8B5CF6">
              <SliderRow label="Reposición Tabaco" pct={cRepo} amount={cigsNet * cRepo / 100} color="#8B5CF6" onChange={setCRepo} />
              <SliderRow label="Sueldos"            pct={cSuel} amount={cigsNet * cSuel / 100} color="#10B981" onChange={setCSuel} />
            </SectionCard>
          )}

          {/* QR Settlement */}
          <SectionCard title="Liquidación QR Digital" accent="#3B82F6">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              <NumInput label="QR Kiosco Neto ($)"      value={kQR} onChange={setKQR} accent="#3B82F6" />
              <NumInput label="QR Cigarrillos Neto ($)" value={cQR} onChange={setCQR} accent="#8B5CF6" />
            </div>
            {(kQRnet > 0 || cQRnet > 0) && (
              <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #1A1F2E" }}>
                {[
                  { label: "Kiosco QR — Reposición 70%", val: kQRnet * .70, c: "#3B82F6" },
                  { label: "Kiosco QR — Sueldos 30%",    val: kQRnet * .30, c: "#10B981" },
                  { label: "Cigars QR — Reposición 85%", val: cQRnet * .85, c: "#8B5CF6" },
                  { label: "Cigars QR — Sueldos 15%",    val: cQRnet * .15, c: "#10B981" },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: i % 2 === 0 ? "#0B0D13" : "#0E1018" }}>
                    <span style={{ fontSize: 12, color: "#64748B" }}>{r.label}</span>
                    <span className="mono" style={{ fontSize: 13, fontWeight: 600, color: r.c }}>${AR(r.val)}</span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Audit */}
          <SectionCard title="Auditoría Real vs Teórico" accent={Math.abs(deviation) < 100 ? "#10B981" : deviation < 0 ? "#F43F5E" : "#10B981"}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
              {[
                { label: "Caja 1 teórico", val: num(cash1), c: "#10B981" },
                { label: "Caja 2 teórico", val: num(cash2), c: "#8B5CF6" },
                { label: "Total teórico",  val: theoretical, c: "#E2E8F0" },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #131722" }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>{r.label}</span>
                  <span className="mono" style={{ fontSize: 13, fontWeight: 600, color: r.c }}>${AR(r.val)}</span>
                </div>
              ))}
            </div>
            <NumInput label="Efectivo Físico Contado ($)" value={physical} onChange={setPhysical} accent="#F59E0B" />
            {num(physical) > 0 && (
              <div style={{
                marginTop: 12, padding: "14px 16px", borderRadius: 12,
                background: Math.abs(deviation) < 100 ? "#10B98112" : deviation < 0 ? "#F43F5E12" : "#10B98112",
                border: `1px solid ${Math.abs(deviation) < 100 ? "#10B98130" : deviation < 0 ? "#F43F5E40" : "#10B98130"}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: Math.abs(deviation) < 100 ? "#10B981" : deviation < 0 ? "#F43F5E" : "#10B981" }}>
                    {Math.abs(deviation) < 100 ? "✓ Sin desvío" : deviation < 0 ? "⚠ Faltante detectado" : "↑ Sobrante en caja"}
                  </div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>Real − Teórico</div>
                </div>
                <span className="mono" style={{ fontSize: 24, fontWeight: 800, color: Math.abs(deviation) < 100 ? "#10B981" : deviation < 0 ? "#F43F5E" : "#10B981" }}>
                  {deviation >= 0 ? "+" : ""}${AR(deviation)}
                </span>
              </div>
            )}
          </SectionCard>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, marginTop: 16, paddingBottom: 8 }}>
        <button className="kc-btn-ghost" style={{ flex: 1, padding: "12px 0", textAlign: "center", fontSize: 14 }}>⚙ Ajustar Porcentajes</button>
        <button className="kc-btn-primary" style={{ flex: 2, padding: "12px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M5 13l4 4L19 7"/></svg>
          Confirmar Cierre y Guardar Planilla
        </button>
      </div>
    </div>
  );
}
