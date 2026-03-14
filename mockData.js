/**
 * pages/DoctorDashboard/index.jsx
 * Reorganized Doctor Dashboard — contains:
 *  1. Stats overview
 *  2. Patient Posts (with comment quick-links)
 *  3. Patient Cases / AI Summaries
 *  4. Booked Appointments
 *
 * "Book Test" option is REMOVED per requirements.
 */

import { useState } from "react";
import { MOCK_SYMPTOM_REPORTS, MOCK_APPOINTMENTS } from "../../services/mockData";

/* ── Icons ───────────────────────────────────────────────────── */
const IC = {
  clipboard: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>,
  close: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  calendar: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  msg: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  activity: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  spark: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
};

const SymptomChip = ({ label }) => (
  <span
    style={{
      fontSize: 11,
      background: "var(--teal-bg)",
      color: "var(--teal2)",
      padding: "2px 8px",
      borderRadius: 10,
      fontWeight: 600,
      fontFamily: "var(--font-b)",
    }}
  >
    {label}
  </span>
);

const TriageBadge = ({ level }) => {
  const cfg = {
    high:   { bg: "rgba(239,68,68,.1)",  color: "#dc2626", border: "rgba(239,68,68,.25)" },
    medium: { bg: "rgba(245,158,11,.1)", color: "#b45309", border: "rgba(245,158,11,.25)" },
    low:    { bg: "rgba(34,197,94,.1)",  color: "#15803d", border: "rgba(34,197,94,.25)" },
  }[level] || {};
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        fontFamily: "var(--font-b)",
        textTransform: "uppercase",
        letterSpacing: ".04em",
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
      }}
    >
      {level}
    </span>
  );
};

/* ── Tab bar ─────────────────────────────────────────────────── */
const TABS = [
  { id: "cases",        label: "Patient Cases",      icon: "📋" },
  { id: "appointments", label: "Booked Appointments", icon: "📅" },
];

/* ── Main Dashboard ──────────────────────────────────────────── */
export const DoctorDashboard = ({ user, posts, onNavigateToFeed }) => {
  const [activeTab, setActiveTab] = useState("cases");
  const [reports, setReports] = useState(MOCK_SYMPTOM_REPORTS);
  const [selectedCase, setSelectedCase] = useState(null);
  const [noteText, setNoteText] = useState("");

  const appointments = MOCK_APPOINTMENTS.filter((a) => a.doctorId === user?.id);
  const patientPostCount = posts?.filter((p) => p.type === "patient_post").length || 0;

  const saveNote = () => {
    if (!noteText.trim() || !selectedCase) return;
    setReports((rs) =>
      rs.map((r) =>
        r.id !== selectedCase.id
          ? r
          : { ...r, doctorNotes: noteText.trim(), doctorId: user?.id }
      )
    );
    setSelectedCase((prev) => ({ ...prev, doctorNotes: noteText.trim() }));
    setNoteText("");
  };

  const triageOrder = { high: 0, medium: 1, low: 2 };
  const sortedReports = [...reports].sort(
    (a, b) => triageOrder[a.triage] - triageOrder[b.triage]
  );

  return (
    <div className="ai-page">
      {/* ── Page header ── */}
      <div className="ai-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg,#1a73e8,#1558b0)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(26,115,232,0.3)",
            }}
          >
            {IC.clipboard}
          </div>
          <div>
            <h1
              style={{
                fontFamily: "var(--font-d)",
                fontSize: 22,
                fontWeight: 400,
                color: "var(--text)",
                fontStyle: "italic",
              }}
            >
              Doctor Dashboard
            </h1>
            <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 1 }}>
              Welcome back, {user?.name}
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { label: "Total Cases",    value: reports.length,                             icon: "📋", color: "var(--teal)" },
          { label: "High Priority",  value: reports.filter((r) => r.triage === "high").length, icon: "🔴", color: "#dc2626" },
          { label: "Reviewed",       value: reports.filter((r) => r.doctorNotes).length,      icon: "✅", color: "#15803d" },
          { label: "Patient Posts",  value: patientPostCount,                           icon: "💬", color: "#8b5cf6",
            action: onNavigateToFeed },
        ].map((s) => (
          <div
            key={s.label}
            className="ai-card fu"
            onClick={s.action}
            style={{
              textAlign: "center",
              padding: "16px 12px",
              cursor: s.action ? "pointer" : "default",
              transition: "transform .18s",
            }}
            onMouseEnter={(e) => { if (s.action) e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <p style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>{s.label}</p>
            {s.action && (
              <p style={{ fontSize: 10, color: "var(--teal2)", marginTop: 3, fontWeight: 700 }}>
                View →
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Quick action banner: view & comment on patient posts */}
      <div
        className="doc-banner fu"
        style={{ marginBottom: 16, cursor: "pointer" }}
        onClick={onNavigateToFeed}
      >
        <span style={{ fontSize: 24 }}>💬</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, fontSize: 13.5, color: "var(--teal2)" }}>
            View & Comment on Patient Posts
          </p>
          <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
            Go to the Home Feed to see patient posts and leave your medical guidance.
          </p>
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--teal2)",
            background: "var(--teal-bg2)",
            padding: "6px 14px",
            borderRadius: 50,
          }}
        >
          Go to Feed →
        </span>
      </div>

      {/* ── Tabs ── */}
      <div
        style={{
          display: "flex",
          gap: 0,
          borderBottom: "1px solid var(--border)",
          marginBottom: 16,
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "10px 20px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-b)",
              color: activeTab === t.id ? "var(--teal)" : "var(--text3)",
              borderBottom: `2px solid ${activeTab === t.id ? "var(--teal)" : "transparent"}`,
              transition: "all .2s",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Patient Cases ── */}
      {activeTab === "cases" && (
        <div className="ai-card accent-blue fu">
          <div style={{ overflowX: "auto" }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Symptoms</th>
                  <th>Triage</th>
                  <th>AI Summary</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {sortedReports.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => { setSelectedCase(r); setNoteText(r.doctorNotes || ""); }}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <div style={{ fontWeight: 700 }}>{r.patientName}</div>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>
                        Age {r.age} · {r.city}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {r.symptoms.map((s) => (
                          <SymptomChip key={s} label={s} />
                        ))}
                      </div>
                    </td>
                    <td>
                      <TriageBadge level={r.triage} />
                    </td>
                    <td
                      style={{
                        fontSize: 12,
                        color: "var(--text2)",
                        maxWidth: 180,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.aiSummary.slice(0, 55)}…
                    </td>
                    <td>
                      {r.doctorNotes ? (
                        <span style={{ color: "#15803d", fontSize: 12, fontWeight: 700 }}>
                          ✓ Added
                        </span>
                      ) : (
                        <span style={{ color: "var(--text3)", fontSize: 12 }}>Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab: Booked Appointments ── */}
      {activeTab === "appointments" && (
        <div className="fi">
          {appointments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px", color: "var(--text3)" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
              <p
                style={{
                  fontFamily: "var(--font-d)",
                  fontSize: 18,
                  fontStyle: "italic",
                  color: "var(--text2)",
                }}
              >
                No appointments booked yet
              </p>
            </div>
          ) : (
            appointments.map((a, i) => (
              <div
                key={a.id}
                className={`ai-card fu s${Math.min(i + 1, 6)}`}
                style={{ marginBottom: 12 }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background:
                          a.patientAvatar === "?"
                            ? "#6b7280"
                            : "linear-gradient(135deg,#f59e0b,#d97706)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 800,
                        color: "#fff",
                        flexShrink: 0,
                        fontFamily: "var(--font-b)",
                      }}
                    >
                      {a.patientAvatar}
                    </div>
                    <div>
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          color: "var(--text)",
                          fontFamily: "var(--font-b)",
                        }}
                      >
                        {a.patientName}
                      </p>
                      <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 2, fontFamily: "var(--font-b)" }}>
                        {a.reason}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: "var(--font-b)",
                        padding: "3px 10px",
                        borderRadius: 20,
                        textTransform: "uppercase",
                        letterSpacing: ".04em",
                        background:
                          a.status === "confirmed"
                            ? "rgba(34,197,94,.1)"
                            : "rgba(245,158,11,.1)",
                        color: a.status === "confirmed" ? "#15803d" : "#b45309",
                        border: `1px solid ${
                          a.status === "confirmed"
                            ? "rgba(34,197,94,.25)"
                            : "rgba(245,158,11,.25)"
                        }`,
                        marginBottom: 6,
                      }}
                    >
                      {a.status === "confirmed" ? "✓ Confirmed" : "⏳ Pending"}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--teal2)", fontWeight: 700, fontFamily: "var(--font-b)" }}>
                      {IC.calendar} {a.time}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Case Detail Modal ── */}
      {selectedCase && (
        <div className="overlay" onClick={() => setSelectedCase(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ padding: 0, maxWidth: 560 }}>
            <div
              style={{
                background: "linear-gradient(135deg,#1a73e8,#1558b0)",
                padding: "20px 24px",
                borderRadius: "28px 28px 0 0",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <h3 style={{ fontFamily: "var(--font-d)", fontSize: 20, fontStyle: "italic", fontWeight: 400 }}>
                  {selectedCase.patientName}
                </h3>
                <p style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
                  Age {selectedCase.age} · {selectedCase.city} · {selectedCase.duration}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <TriageBadge level={selectedCase.triage} />
                <button
                  onClick={() => setSelectedCase(null)}
                  style={{
                    background: "rgba(255,255,255,.15)",
                    border: "none",
                    borderRadius: "50%",
                    width: 30,
                    height: 30,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  {IC.close}
                </button>
              </div>
            </div>

            <div style={{ padding: "20px 24px" }}>
              {/* Symptoms */}
              <div className="ai-card accent-teal" style={{ marginBottom: 12 }}>
                <p style={{ fontWeight: 800, fontSize: 12, color: "var(--teal2)", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 8 }}>
                  Symptoms ({selectedCase.severity} severity)
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {selectedCase.symptoms.map((s) => (
                    <span key={s} className="symptom-chip">{s}</span>
                  ))}
                </div>
              </div>

              {/* AI Summary */}
              <div className="ai-card accent-blue" style={{ marginBottom: 12 }}>
                <p style={{ fontWeight: 800, fontSize: 12, color: "#1558b0", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 8 }}>
                  AI Summary
                </p>
                <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>
                  {selectedCase.aiSummary}
                </p>
              </div>

              {/* Existing doctor notes */}
              {selectedCase.doctorNotes && (
                <div className="ai-card accent-gold" style={{ marginBottom: 12 }}>
                  <p style={{ fontWeight: 800, fontSize: 12, color: "#b45309", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 8 }}>
                    Doctor Notes
                  </p>
                  <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>
                    {selectedCase.doctorNotes}
                  </p>
                </div>
              )}

              {/* Add/update note */}
              <div style={{ marginTop: 12 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 8 }}>
                  {selectedCase.doctorNotes ? "Update Notes" : "Add Doctor Notes"}
                </p>
                <textarea
                  className="inp"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add diagnosis, confirm/reject AI suggestions…"
                  rows={3}
                  style={{ resize: "none", marginBottom: 8 }}
                />
                <button
                  className="btn-p"
                  onClick={saveNote}
                  disabled={!noteText.trim()}
                  style={{ padding: "10px 20px", borderRadius: 50 }}
                >
                  {IC.check} Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
