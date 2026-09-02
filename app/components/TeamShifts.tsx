import { useState } from "react";

type Priority = "alta" | "media" | "baja";
type Status   = "pendiente" | "en_proceso" | "completado";

interface Note  { id: number; author: string; avatar: string; text: string; time: string; read: boolean }
interface Task  { id: number; title: string; priority: Priority; assignee: string; checks: { label: string; done: boolean }[]; status: Status }

const PRI: Record<Priority, { bg: string; fg: string; label: string }> = {
  alta:  { bg: "#F43F5E18", fg: "#F43F5E", label: "Alta" },
  media: { bg: "#F59E0B18", fg: "#F59E0B", label: "Media" },
  baja:  { bg: "#10B98118", fg: "#10B981", label: "Baja" },
};

const COLS: { key: Status; label: string; color: string }[] = [
  { key: "pendiente",   label: "Pendiente",   color: "#475569" },
  { key: "en_proceso",  label: "En Proceso",  color: "#F59E0B" },
  { key: "completado",  label: "Completado",  color: "#10B981" },
];

const INIT_NOTES: Note[] = [
  { id: 1, author: "Vendedora 1", avatar: "V1", text: "Queda poco cambio de $1.000 — pedir al banco mañana temprano antes de abrir.", time: "08:45", read: false },
  { id: 2, author: "Vendedora 2", avatar: "V2", text: "El proveedor de bebidas llega el lunes antes de las 10. Tienen que dejarle el espacio libre en la heladera.", time: "07:30", read: true },
  { id: 3, author: "Vendedora 1", avatar: "V1", text: "La terminal de carga SUBE tiene falla intermitente — si no levanta, reiniciar el módem.", time: "06:15", read: true },
];

const INIT_TASKS: Task[] = [
  { id: 1, title: "Pedido de cigarrillos a Tabacal",     priority: "alta",  assignee: "V1", status: "en_proceso", checks: [{ label: "Contar stock actual", done: true }, { label: "Enviar orden WhatsApp", done: false }] },
  { id: 2, title: "Reorganizar heladera",                priority: "media", assignee: "V2", status: "pendiente",  checks: [{ label: "Retirar vencidos", done: false }, { label: "Reponer bebidas", done: false }] },
  { id: 3, title: "Actualizar precios Marlboro",          priority: "alta",  assignee: "V1", status: "completado", checks: [{ label: "Revisar nueva lista", done: true }, { label: "Actualizar sistema", done: true }] },
  { id: 4, title: "Reponer exhibidor golosinas",          priority: "baja",  assignee: "V2", status: "pendiente",  checks: [{ label: "Revisar stock", done: false }] },
  { id: 5, title: "Renovar fondo rotativo SUBE/Claro",   priority: "media", assignee: "V1", status: "en_proceso", checks: [{ label: "Ir al banco", done: false }, { label: "Actualizar planilla", done: false }] },
];

export default function TeamShifts() {
  const [notes, setNotes] = useState<Note[]>(INIT_NOTES);
  const [tasks, setTasks] = useState<Task[]>(INIT_TASKS);
  const [newNote, setNewNote] = useState("");
  const [newTask, setNewTask] = useState("");
  const [drag, setDrag] = useState<number | null>(null);

  const markRead = (id: number) => setNotes(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  const addNote  = () => {
    if (!newNote.trim()) return;
    setNotes(p => [{ id: Date.now(), author: "Vendedora 1", avatar: "V1", text: newNote, time: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }), read: false }, ...p]);
    setNewNote("");
  };
  const addTask  = () => {
    if (!newTask.trim()) return;
    setTasks(p => [...p, { id: Date.now(), title: newTask, priority: "media", assignee: "V1", status: "pendiente", checks: [] }]);
    setNewTask("");
  };
  const moveTask = (id: number, status: Status) => setTasks(p => p.map(t => t.id === id ? { ...t, status } : t));
  const toggleCheck = (tid: number, ci: number) => setTasks(p => p.map(t => t.id === tid ? { ...t, checks: t.checks.map((c, i) => i === ci ? { ...c, done: !c.done } : c) } : t));

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>

      {/* ── Notes panel ──────────────────────────────────── */}
      <div style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", overflow: "hidden", borderRight: "1px solid #131722" }} className="hidden lg:flex">
        <div style={{ padding: "14px 14px 10px", borderBottom: "1px solid #131722", flexShrink: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", marginBottom: 2 }}>📒 Pase de Guardia</div>
          <div style={{ fontSize: 11, color: "#334155" }}>{notes.filter(n => !n.read).length} sin leer</div>
        </div>

        <div style={{ padding: "10px 12px", borderBottom: "1px solid #131722", flexShrink: 0 }}>
          <textarea
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            placeholder="Escribí una nota para el turno siguiente…"
            rows={3}
            className="kc-input"
            style={{ width: "100%", padding: "8px 10px", fontSize: 12, resize: "none", display: "block", marginBottom: 8 }}
          />
          <button onClick={addNote} className="kc-btn-primary" style={{ width: "100%", padding: "8px 0", fontSize: 12 }}>+ Agregar Nota</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
          {notes.map(note => (
            <div
              key={note.id}
              style={{
                padding: "10px 12px", borderRadius: 12,
                background: note.read ? "#0E1018" : "#131722",
                border: note.read ? "1px solid #1A1F2E" : "1px solid #3B82F630",
                transition: "all .15s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: "#3B82F618", border: "1px solid #3B82F630", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#3B82F6" }}>{note.avatar}</div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#3B82F6" }}>{note.author}</span>
                  {!note.read && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#3B82F6" }} />}
                </div>
                <span className="mono" style={{ fontSize: 10, color: "#334155" }}>{note.time}</span>
              </div>
              <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.55 }}>{note.text}</p>
              {!note.read && (
                <button
                  onClick={() => markRead(note.id)}
                  style={{ fontSize: 10, color: "#334155", background: "none", border: "none", cursor: "pointer", marginTop: 7, padding: 0, transition: "color .12s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#64748B")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#334155")}
                >✓ Marcar como leído</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Kanban ─────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Kanban header */}
        <div style={{ padding: "12px 14px 10px", borderBottom: "1px solid #131722", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>Tablero de Tareas</div>
            <div style={{ fontSize: 11, color: "#334155", marginTop: 1 }}>{tasks.filter(t => t.status !== "completado").length} activas</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTask()}
              placeholder="Nueva tarea…"
              className="kc-input"
              style={{ padding: "7px 11px", fontSize: 12, width: 200 }}
            />
            <button onClick={addTask} className="kc-btn-primary" style={{ padding: "7px 14px", fontSize: 12 }}>+ Tarea</button>
          </div>
        </div>

        {/* Kanban columns */}
        <div style={{ flex: 1, overflowX: "auto", overflowY: "hidden", padding: "12px 14px" }}>
          <div style={{ display: "flex", gap: 12, height: "100%", minWidth: 520 }}>
            {COLS.map(col => {
              const colTasks = tasks.filter(t => t.status === col.key);
              return (
                <div
                  key={col.key}
                  style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 160 }}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => drag !== null && moveTask(drag, col.key)}
                >
                  {/* Column header */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 12px", borderRadius: "10px 10px 0 0",
                    background: "#0E1018", border: "1px solid #1A1F2E", borderBottom: "none",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: col.color }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: col.color }}>{col.label}</span>
                    </div>
                    <span className="mono" style={{ fontSize: 11, color: "#334155", background: "#131722", padding: "1px 7px", borderRadius: 5 }}>{colTasks.length}</span>
                  </div>

                  {/* Drop zone */}
                  <div style={{
                    flex: 1, overflowY: "auto",
                    background: "#0B0D13", border: "1px solid #1A1F2E",
                    borderRadius: "0 0 10px 10px", padding: "8px",
                    display: "flex", flexDirection: "column", gap: 8,
                  }}>
                    {colTasks.map(task => {
                      const done = task.checks.filter(c => c.done).length;
                      const tot  = task.checks.length;
                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={() => setDrag(task.id)}
                          onDragEnd={() => setDrag(null)}
                          style={{
                            padding: "11px 12px", borderRadius: 11, cursor: "grab",
                            background: "#131722", border: "1px solid #1E2436",
                            opacity: drag === task.id ? .4 : 1,
                            transition: "border-color .12s, opacity .15s",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = "#242B3D")}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = "#1E2436")}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 7 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#E2E8F0", lineHeight: 1.4, flex: 1, paddingRight: 6 }}>{task.title}</span>
                            <span className="badge" style={{ ...PRI[task.priority], flexShrink: 0 }}>{PRI[task.priority].label}</span>
                          </div>

                          {task.checks.length > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 8 }}>
                              {task.checks.map((ch, ci) => (
                                <div
                                  key={ci}
                                  onClick={() => toggleCheck(task.id, ci)}
                                  style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}
                                >
                                  <div style={{
                                    width: 14, height: 14, borderRadius: 4, flexShrink: 0,
                                    background: ch.done ? "#10B98120" : "#1E2436",
                                    border: `1px solid ${ch.done ? "#10B98150" : "#242B3D"}`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    transition: "all .12s",
                                  }}>
                                    {ch.done && <svg width="8" height="8" fill="none" viewBox="0 0 12 12"><path stroke="#10B981" strokeWidth={2.2} strokeLinecap="round" d="M1.5 6.5l3 3 6-7"/></svg>}
                                  </div>
                                  <span style={{ fontSize: 11, color: ch.done ? "#334155" : "#94A3B8", textDecoration: ch.done ? "line-through" : "none" }}>{ch.label}</span>
                                </div>
                              ))}
                              {tot > 0 && (
                                <div className="kc-bar-track" style={{ marginTop: 3 }}>
                                  <div className="kc-bar-fill" style={{ width: `${done / tot * 100}%`, background: "#10B981" }} />
                                </div>
                              )}
                            </div>
                          )}

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ width: 22, height: 22, borderRadius: 6, background: "#3B82F618", border: "1px solid #3B82F630", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#3B82F6" }}>{task.assignee}</div>
                            <div style={{ display: "flex", gap: 4 }}>
                              {col.key !== "pendiente" && (
                                <button onClick={() => moveTask(task.id, col.key === "en_proceso" ? "pendiente" : "en_proceso")} style={{ width: 22, height: 22, borderRadius: 5, background: "#1E2436", border: "none", color: "#64748B", cursor: "pointer", fontSize: 11 }}>←</button>
                              )}
                              {col.key !== "completado" && (
                                <button onClick={() => moveTask(task.id, col.key === "pendiente" ? "en_proceso" : "completado")} style={{ width: 22, height: 22, borderRadius: 5, background: "#1E2436", border: "none", color: "#64748B", cursor: "pointer", fontSize: 11 }}>→</button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {colTasks.length === 0 && (
                      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", opacity: .25 }}>
                        <span style={{ fontSize: 11, color: "#475569" }}>Arrastrá una tarea aquí</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
