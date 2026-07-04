import { CheckCircle2 } from "lucide-react";
import { SYMPTOMS } from "../data";

export default function LogView({ draft, onTapSymptom, onNotesChange, onSave, saveMsg }) {
  return (
    <div>
      <div className="pc-card">
        <h2 className="pc-card-title pc-display">How are you feeling today?</h2>
        <p className="pc-card-sub">Tap a symptom to cycle through mild, moderate, and severe. Tap again to clear it.</p>
        <div className="pc-symptom-grid">
          {SYMPTOMS.map((s) => {
            const level = draft.symptoms[s.id] || 0;
            const Icon = s.icon;
            return (
              <button key={s.id} className="pc-symptom" onClick={() => onTapSymptom(s.id)}>
                <div className="pc-symptom-top">
                  <div className="pc-symptom-icon">
                    <Icon size={16} />
                  </div>
                  <div className="pc-symptom-label">{s.label}</div>
                </div>
                <div className="pc-dots">
                  {[1, 2, 3].map((lvl) => (
                    <div key={lvl} className={`pc-dot${level >= lvl ? ` lvl${lvl}` : ""}`} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pc-card">
        <h2 className="pc-card-title pc-display" style={{ fontSize: 16 }}>
          Notes
        </h2>
        <p className="pc-card-sub">Anything else worth remembering — triggers, context, questions for your doctor.</p>
        <textarea
          className="pc-notes"
          placeholder="e.g. Hot flashes seemed worse after coffee today…"
          value={draft.notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
        <div className="pc-save-row">
          <button className="pc-btn pc-btn-primary" onClick={onSave}>
            Save today's log
          </button>
          {saveMsg && (
            <span className="pc-save-msg">
              <CheckCircle2 size={15} /> Saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
