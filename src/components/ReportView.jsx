import { CalendarDays, Printer } from "lucide-react";
import { fmtDate } from "../data";

export default function ReportView({ reportData }) {
  const { ranked, maxCount, loggedDays, notesLog } = reportData;

  if (loggedDays === 0) {
    return (
      <div className="pc-card pc-empty">
        <div className="pc-empty-icon">
          <CalendarDays size={20} />
        </div>
        <p style={{ margin: 0 }}>Once you've logged a few entries, you can generate a doctor-ready summary here.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="pc-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 className="pc-card-title pc-display" style={{ fontSize: 16 }}>
              30-day summary
            </h2>
            <p className="pc-card-sub" style={{ marginBottom: 4 }}>
              {loggedDays} day{loggedDays === 1 ? "" : "s"} logged in the last 30 days. Bring this to your next
              appointment.
            </p>
          </div>
          <button className="pc-btn pc-btn-ghost pc-no-print" onClick={() => window.print()}>
            <Printer size={15} /> Print / Save PDF
          </button>
        </div>

        <h3 style={{ fontSize: 13.5, fontWeight: 700, marginTop: 18, marginBottom: 6 }}>Most frequent symptoms</h3>
        {ranked.map((r) => (
          <div className="pc-report-row" key={r.id}>
            <span style={{ width: 130, flexShrink: 0 }}>{r.label}</span>
            <div className="pc-report-bar-track">
              <div className="pc-report-bar-fill" style={{ width: `${(r.count / maxCount) * 100}%` }} />
            </div>
            <span style={{ width: 70, textAlign: "right", color: "var(--ink-soft)" }}>
              {r.count} day{r.count === 1 ? "" : "s"}
            </span>
          </div>
        ))}

        {notesLog.length > 0 && (
          <>
            <h3 style={{ fontSize: 13.5, fontWeight: 700, marginTop: 22, marginBottom: 6 }}>Recent notes</h3>
            {notesLog.map((n) => (
              <div key={n.date} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11.5, color: "var(--ink-soft)", fontWeight: 600 }}>{fmtDate(n.date)}</div>
                <div style={{ fontSize: 13.5 }}>{n.notes}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
