import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { SYMPTOMS } from "../data";

export default function LearnView({ recentSymptomIds }) {
  const [openId, setOpenId] = useState(recentSymptomIds[0] || null);

  const ordered = useMemo(() => {
    const recentSet = new Set(recentSymptomIds);
    const recent = SYMPTOMS.filter((s) => recentSet.has(s.id)).sort(
      (a, b) => recentSymptomIds.indexOf(a.id) - recentSymptomIds.indexOf(b.id)
    );
    const rest = SYMPTOMS.filter((s) => !recentSet.has(s.id));
    return [...recent, ...rest];
  }, [recentSymptomIds]);

  return (
    <div className="pc-card">
      <h2 className="pc-card-title pc-display" style={{ fontSize: 16 }}>
        Understanding your symptoms
      </h2>
      <p className="pc-card-sub">Plain-language explanations. Symptoms you've logged this week are pinned to the top.</p>
      {ordered.map((s) => {
        const Icon = s.icon;
        const isRecent = recentSymptomIds.includes(s.id);
        const isOpen = openId === s.id;
        return (
          <div className="pc-accordion-item" key={s.id}>
            <div
              className={`pc-accordion-head${isRecent ? " pinned" : ""}`}
              onClick={() => setOpenId(isOpen ? null : s.id)}
            >
              <div className="pc-accordion-left">
                <div className="pc-symptom-icon">
                  <Icon size={16} />
                </div>
                <span style={{ fontWeight: 600, fontSize: 13.5 }}>{s.label}</span>
                {isRecent && <span className="pc-recent-tag">This week</span>}
              </div>
              <ChevronDown
                size={16}
                style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .15s ease" }}
              />
            </div>
            {isOpen && <div className="pc-accordion-body">{s.learn}</div>}
          </div>
        );
      })}
    </div>
  );
}
