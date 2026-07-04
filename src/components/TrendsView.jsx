import {
  RadialBarChart,
  RadialBar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Sparkles } from "lucide-react";
import { SYMPTOMS, LEVEL_LABEL } from "../data";

export default function TrendsView({ ringData, trendData, trendSymptom, setTrendSymptom, hasAnyEntries }) {
  if (!hasAnyEntries) {
    return (
      <div className="pc-card pc-empty">
        <div className="pc-empty-icon">
          <Sparkles size={20} />
        </div>
        <p style={{ margin: 0 }}>Log a few days of symptoms and your patterns will appear here.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="pc-card">
        <h2 className="pc-card-title pc-display" style={{ fontSize: 16 }}>
          This week's phase
        </h2>
        <p className="pc-card-sub">Average intensity of each symptom you've logged in the last 7 days.</p>
        {ringData.length === 0 ? (
          <p style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>No symptoms logged in the last 7 days.</p>
        ) : (
          <div className="pc-ring-wrap">
            <ResponsiveContainer width="100%" height={240}>
              <RadialBarChart
                innerRadius="22%"
                outerRadius="100%"
                data={ringData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar background dataKey="value" cornerRadius={8} />
                <Tooltip
                  formatter={(value, name, props) => [`${props.payload.value}% avg intensity`, props.payload.name]}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="pc-ring-legend">
              {ringData.map((d) => (
                <div className="pc-legend-item" key={d.name}>
                  <span className="pc-legend-dot" style={{ background: d.fill }} />
                  {d.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pc-card">
        <h2 className="pc-card-title pc-display" style={{ fontSize: 16 }}>
          30-day trend
        </h2>
        <p className="pc-card-sub">Pick a symptom to see how it's tracked over the last month.</p>
        <div className="pc-symptom-pills">
          {SYMPTOMS.map((s) => (
            <button
              key={s.id}
              className={`pc-pill${trendSymptom === s.id ? " active" : ""}`}
              onClick={() => setTrendSymptom(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--ink-soft)" }} interval={4} />
            <YAxis
              domain={[0, 3]}
              ticks={[0, 1, 2, 3]}
              tickFormatter={(v) => LEVEL_LABEL[v]}
              tick={{ fontSize: 10, fill: "var(--ink-soft)" }}
              width={70}
            />
            <Tooltip formatter={(v) => LEVEL_LABEL[v]} labelFormatter={(l) => `Date: ${l}`} />
            <Line type="monotone" dataKey="level" stroke="var(--plum)" strokeWidth={2} dot={{ r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
