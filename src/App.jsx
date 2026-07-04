import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from "react";
import { Moon, Loader2 } from "lucide-react";
import { SYMPTOMS, SYMPTOM_MAP, RING_COLORS, todayKey, fmtDate, lastNDates } from "./data";
import { storage, entryKey, dateFromEntryKey } from "./storage";
import LogView from "./components/LogView";

// Trends/Report/Learn are code-split: recharts (the heaviest dependency) only
// downloads once someone actually opens the Trends tab, so the initial paint
// only needs Log's much smaller dependency graph.
const TrendsView = lazy(() => import("./components/TrendsView"));
const ReportView = lazy(() => import("./components/ReportView"));
const LearnView = lazy(() => import("./components/LearnView"));

function TabFallback() {
  return (
    <div className="pc-loading">
      <Loader2 size={28} className="pc-spin" />
      <span>Loading…</span>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("log");
  const [entries, setEntries] = useState({}); // { 'YYYY-MM-DD': { symptoms: {id:level}, notes } }
  const [loading, setLoading] = useState(true);
  const [storageOk, setStorageOk] = useState(true);
  const [saveMsg, setSaveMsg] = useState(false);
  const [trendSymptom, setTrendSymptom] = useState("hotflash");

  const today = todayKey();
  const draft = entries[today] || { symptoms: {}, notes: "" };

  // Load all entries on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const listResult = await storage.list();
        const keys = listResult && listResult.keys ? listResult.keys : [];
        const next = {};
        for (const k of keys) {
          try {
            const r = await storage.get(k);
            if (r && r.value) {
              next[dateFromEntryKey(k)] = JSON.parse(r.value);
            }
          } catch (e) {
            // skip unreadable key
          }
        }
        if (!cancelled) {
          setEntries(next);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setStorageOk(false);
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateDraftSymptom = useCallback(
    (id) => {
      setEntries((prev) => {
        const current = prev[today] || { symptoms: {}, notes: "" };
        const currentLevel = current.symptoms[id] || 0;
        const nextLevel = (currentLevel + 1) % 4;
        const nextSymptoms = { ...current.symptoms, [id]: nextLevel };
        return { ...prev, [today]: { ...current, symptoms: nextSymptoms } };
      });
    },
    [today]
  );

  const updateDraftNotes = useCallback(
    (val) => {
      setEntries((prev) => {
        const current = prev[today] || { symptoms: {}, notes: "" };
        return { ...prev, [today]: { ...current, notes: val } };
      });
    },
    [today]
  );

  async function saveToday() {
    const entry = entries[today] || { symptoms: {}, notes: "" };
    try {
      await storage.set(entryKey(today), JSON.stringify(entry));
      setSaveMsg(true);
      setTimeout(() => setSaveMsg(false), 2200);
    } catch (e) {
      setStorageOk(false);
    }
  }

  // Last 7 days average intensity per symptom, for the ring chart
  const ringData = useMemo(() => {
    const days = lastNDates(7);
    return SYMPTOMS.map((s, i) => {
      let total = 0;
      let count = 0;
      days.forEach((d) => {
        const lvl = entries[d]?.symptoms?.[s.id];
        if (lvl) {
          total += lvl;
          count += 1;
        }
      });
      const avg = count ? total / count : 0;
      return {
        name: s.label,
        value: Math.round((avg / 3) * 100),
        fill: RING_COLORS[i % RING_COLORS.length],
      };
    }).filter((d) => d.value > 0);
  }, [entries]);

  // 30-day trend line for selected symptom
  const trendData = useMemo(() => {
    const days = lastNDates(30);
    return days.map((d) => ({
      date: d.slice(5),
      level: entries[d]?.symptoms?.[trendSymptom] || 0,
    }));
  }, [entries, trendSymptom]);

  // Recently logged symptom ids (last 7 days), most frequent first
  const recentSymptomIds = useMemo(() => {
    const days = lastNDates(7);
    const counts = {};
    days.forEach((d) => {
      const syms = entries[d]?.symptoms || {};
      Object.entries(syms).forEach(([id, lvl]) => {
        if (lvl > 0) counts[id] = (counts[id] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id);
  }, [entries]);

  // 30-day report data
  const reportData = useMemo(() => {
    const days = lastNDates(30);
    const counts = {};
    let loggedDays = 0;
    const notesLog = [];
    days.forEach((d) => {
      const e = entries[d];
      if (!e) return;
      const syms = e.symptoms || {};
      const hasAny = Object.values(syms).some((v) => v > 0);
      if (hasAny || e.notes) loggedDays += 1;
      Object.entries(syms).forEach(([id, lvl]) => {
        if (lvl > 0) counts[id] = (counts[id] || 0) + 1;
      });
      if (e.notes && e.notes.trim()) {
        notesLog.push({ date: d, notes: e.notes.trim() });
      }
    });
    const ranked = Object.entries(counts)
      .map(([id, count]) => ({ id, count, label: SYMPTOM_MAP[id]?.label || id }))
      .sort((a, b) => b.count - a.count);
    const maxCount = ranked.length ? ranked[0].count : 1;
    return { ranked, maxCount, loggedDays, notesLog: notesLog.slice(-6).reverse() };
  }, [entries]);

  const hasAnyEntries = Object.keys(entries).length > 0;

  return (
    <div className="pc-root">
      <div className="pc-shell">
        <div className="pc-header">
          <div className="pc-brand">
            <div className="pc-brand-mark">
              <Moon size={18} fill="white" strokeWidth={1} />
            </div>
            <div>
              <div className="pc-brand-name pc-display">Phases</div>
              <div className="pc-date">{fmtDate(today)}</div>
            </div>
          </div>
        </div>

        {!storageOk && (
          <div className="pc-card" style={{ background: "var(--clay-soft)", borderColor: "var(--clay)" }}>
            <p style={{ margin: 0, fontSize: 13.5 }}>
              Storage isn't available right now, so entries won't be saved between visits. You can still explore the app.
            </p>
          </div>
        )}

        <div className="pc-tabs pc-no-print">
          {[
            { id: "log", label: "Log" },
            { id: "trends", label: "Trends" },
            { id: "report", label: "Report" },
            { id: "learn", label: "Learn" },
          ].map((t) => (
            <button
              key={t.id}
              className={`pc-tab${tab === t.id ? " active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <TabFallback />
        ) : (
          <Suspense fallback={<TabFallback />}>
            {tab === "log" && (
              <LogView
                draft={draft}
                onTapSymptom={updateDraftSymptom}
                onNotesChange={updateDraftNotes}
                onSave={saveToday}
                saveMsg={saveMsg}
              />
            )}
            {tab === "trends" && (
              <TrendsView
                ringData={ringData}
                trendData={trendData}
                trendSymptom={trendSymptom}
                setTrendSymptom={setTrendSymptom}
                hasAnyEntries={hasAnyEntries}
              />
            )}
            {tab === "report" && <ReportView reportData={reportData} />}
            {tab === "learn" && <LearnView recentSymptomIds={recentSymptomIds} />}
          </Suspense>
        )}
      </div>
    </div>
  );
}
