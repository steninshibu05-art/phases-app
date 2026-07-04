import {
  Flame,
  Droplets,
  HeartPulse,
  Brain,
  BedDouble,
  CalendarDays,
  Wind,
  Sparkles,
} from "lucide-react";

export const SYMPTOMS = [
  {
    id: "hotflash",
    label: "Hot flashes",
    icon: Flame,
    learn:
      "Sudden waves of heat, often with flushing or sweating, caused by shifting estrogen levels affecting the body's temperature control. Most episodes last one to five minutes. Keeping a cool room and layered clothing can help, and a doctor can discuss options if they're frequent or disruptive.",
  },
  {
    id: "nightsweat",
    label: "Night sweats",
    icon: Droplets,
    learn:
      "Hot flashes that happen during sleep, often heavy enough to wake you or soak bedding. They share the same hormonal cause as daytime hot flashes. Breathable sleepwear and a cooler bedroom can reduce frequency for some people.",
  },
  {
    id: "mood",
    label: "Mood swings",
    icon: HeartPulse,
    learn:
      "Fluctuating estrogen can affect serotonin and other brain chemicals tied to mood, leading to irritability, low mood, or sudden shifts that feel out of character. Tracking when these occur relative to your cycle can help a doctor tell hormonal patterns apart from other causes.",
  },
  {
    id: "brainfog",
    label: "Brain fog",
    icon: Brain,
    learn:
      "Trouble concentrating, forgetfulness, or feeling mentally 'slow' is a commonly reported symptom during this transition, linked to hormonal shifts and often worsened by poor sleep. It's usually temporary, but worth mentioning to a doctor if it's affecting daily function.",
  },
  {
    id: "sleep",
    label: "Sleep trouble",
    icon: BedDouble,
    learn:
      "Difficulty falling or staying asleep is common, sometimes from night sweats, sometimes independent of them. Hormonal shifts can directly affect sleep architecture. Consistent sleep and wake times help, and persistent insomnia is worth raising with a clinician.",
  },
  {
    id: "cycle",
    label: "Irregular cycle",
    icon: CalendarDays,
    learn:
      "Cycles often become shorter, longer, heavier, lighter, or less predictable as hormone levels fluctuate. This is one of the earliest and most common signs of the transition. Significant changes, like very heavy bleeding, are still worth discussing with a doctor.",
  },
  {
    id: "fatigue",
    label: "Fatigue",
    icon: Wind,
    learn:
      "Persistent low energy can stem from disrupted sleep, hormonal shifts, or both. It's distinct from everyday tiredness in that it doesn't fully resolve with rest. Logging it alongside sleep and mood can reveal whether it tracks with other symptoms.",
  },
  {
    id: "anxiety",
    label: "Anxiety",
    icon: Sparkles,
    learn:
      "New or heightened anxiety, sometimes with a racing heart or restlessness, can accompany hormonal shifts even in people with no prior history of it. It often travels alongside sleep trouble and mood changes, which is useful context to share with a doctor.",
  },
];

export const SYMPTOM_MAP = Object.fromEntries(SYMPTOMS.map((s) => [s.id, s]));
export const LEVEL_LABEL = { 0: "Not logged", 1: "Mild", 2: "Moderate", 3: "Severe" };
export const RING_COLORS = ["#C99A3C", "#C0735C", "#5B3A66", "#7C9B83", "#8FA6C9", "#B98ABF", "#D9A05B", "#7CA39B"];

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
export function fmtDate(key) {
  const d = new Date(key + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}
export function lastNDates(n) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}
