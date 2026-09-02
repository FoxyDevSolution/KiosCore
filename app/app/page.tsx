"use client"

import { useState } from "react";
import POSScreen from "../components/POSScreen";
import ProductModal from "../components/ProductModal";
import CashClosing from "../components/CashClosing";
import Inventory from "../components/Inventory";
import TeamShifts from "../components/TeamShifts";
import Customers from "../components/Customers";

type Screen = "pos" | "closing" | "inventory" | "team" | "customers";

const NAV: { key: Screen; label: string; short: string; icon: React.ReactNode; accent?: string }[] = [
  {
    key: "pos", label: "POS / Checkout", short: "POS", accent: "#3B82F6",
    icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="2" y="3" width="20" height="13" rx="2"/><path d="M8 21h8M12 16v5" strokeLinecap="round"/></svg>,
  },
  {
    key: "closing", label: "Arqueo Diario", short: "Arqueo", accent: "#10B981",
    icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" d="M12 6v6l4 2"/><circle cx="12" cy="12" r="9"/></svg>,
  },
  {
    key: "inventory", label: "Inventario", short: "Stock", accent: "#F59E0B",
    icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" d="M20 7H4a1 1 0 00-1 1v10a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1z"/><path strokeLinecap="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M10 14h4"/></svg>,
  },
  {
    key: "team", label: "Equipo & Turnos", short: "Equipo", accent: "#8B5CF6",
    icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" d="M17 20h5v-1a4 4 0 00-5.5-3.7M9 20H4v-1a4 4 0 015.5-3.7M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>,
  },
  {
    key: "customers", label: "Clientes & Fiados", short: "Fiados", accent: "#F43F5E",
    icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
  },
];

const NOW = new Date().toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

export default function App() {
  const [screen, setScreen] = useState<Screen>("pos");
  const [showProductModal, setShowProductModal] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const active = NAV.find(n => n.key === screen)!;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0B0D13", overflow: "hidden" }}>

      {/* ── Sidebar (desktop) ─────────────────────────────── */}
      <aside style={{
        display: "flex", flexDirection: "column", flexShrink: 0,
        width: collapsed ? 60 : 216,
        background: "#0E1018",
        borderRight: "1px solid #1A1F2E",
        transition: "width .2s cubic-bezier(.4,0,.2,1)",
        overflow: "hidden",
      }} className="hidden lg:flex">

        {/* Brand */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: collapsed ? "18px 0" : "18px 16px",
          justifyContent: collapsed ? "center" : "flex-start",
          borderBottom: "1px solid #1A1F2E", flexShrink: 0,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px #3B82F640",
          }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.2}>
              <path strokeLinecap="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <path strokeLinecap="round" d="M9 22V12h6v10"/>
            </svg>
          </div>
          {!collapsed && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#F8FAFC", letterSpacing: "-.01em", whiteSpace: "nowrap" }}>KiosCore</div>
              <div style={{ fontSize: 11, color: "#334155", whiteSpace: "nowrap" }}>Sistema de Gestión</div>
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "8px 6px", overflowY: "auto", overflowX: "hidden" }}>
          {NAV.map(item => {
            const isActive = screen === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setScreen(item.key)}
                title={collapsed ? item.label : undefined}
                style={{
                  display: "flex", alignItems: "center",
                  gap: 10, width: "100%",
                  padding: collapsed ? "10px 0" : "9px 10px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  borderRadius: 10, border: "none", cursor: "pointer",
                  marginBottom: 2,
                  background: isActive ? `${item.accent}18` : "transparent",
                  color: isActive ? item.accent : "#475569",
                  transition: "background .12s, color .12s",
                }}
              >
                <span style={{ flexShrink: 0, display: "flex" }}>{item.icon}</span>
                {!collapsed && (
                  <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 500, whiteSpace: "nowrap" }}>{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "8px 6px 10px", borderTop: "1px solid #1A1F2E", flexShrink: 0 }}>
          {!collapsed && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 10px", borderRadius: 10,
              background: "#0B0D13", border: "1px solid #1A1F2E",
              marginBottom: 6,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: "#131722", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: "#3B82F6",
              }}>V1</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#CBD5E1" }}>Vendedora 1</div>
                <div style={{ fontSize: 11, color: "#334155" }}>Turno Mañana</div>
              </div>
              <span className="pulse" style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#10B981", flexShrink: 0 }} />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
              padding: "7px 0", borderRadius: 8, border: "none",
              background: "#131722", color: "#334155", cursor: "pointer",
              transition: "background .12s, color .12s",
            }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
              <path strokeLinecap="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* ── Main column ───────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Desktop topbar */}
        <header className="hidden lg:flex" style={{
          alignItems: "center", justifyContent: "space-between",
          padding: "0 20px", height: 52, flexShrink: 0,
          background: "#0B0D13", borderBottom: "1px solid #131722",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: active.accent }} />
            <h1 style={{ fontSize: 13, fontWeight: 600, color: "#CBD5E1" }}>{active.label}</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "monospace", fontSize: 11, color: "#334155" }}>{NOW}</span>
          </div>
        </header>

        {/* Screen */}
        <main style={{ flex: 1, overflow: "hidden" }}>
          {screen === "pos"       && <POSScreen onAddProduct={() => setShowProductModal(true)} />}
          {screen === "closing"   && <CashClosing />}
          {screen === "inventory" && <Inventory />}
          {screen === "team"      && <TeamShifts />}
          {screen === "customers" && <Customers />}
        </main>
      </div>

      {showProductModal && <ProductModal onClose={() => setShowProductModal(false)} />}
    </div>
  );
}
