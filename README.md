# Phases — Perimenopause Companion

A working symptom tracker for perimenopause: log symptoms in seconds, see
patterns over time, generate a doctor-ready summary, and read plain-language
explanations of what you're experiencing.

This is the **deployable web version** — a real Vite + React project, built
from the original Claude-artifact MVP. The three things that made the
original artifact Claude-only have been swapped out:

| | Artifact MVP | This project |
|---|---|---|
| Storage | `window.storage` (Claude-only) | `localStorage` via `src/storage.js` |
| Styling | injected `<style>` tag at runtime | static `src/styles/phases.css` |
| Bundle | one file, everything loads at once | code-split — see below |

## What's included

- **Log** — tap any of 8 common symptoms to cycle mild → moderate → severe, plus a free-text notes field
- **Trends** — a "this week" radial overview and a 30-day line chart per symptom
- **Report** — a printable 30-day summary (frequency ranking + recent notes) with a Print/Save-as-PDF button
- **Learn** — expandable explainers for each symptom, with whatever you've logged this week pinned to the top

## Running it

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

## Performance notes

`recharts` (the charting library) is only used by the Trends tab and is the
single heaviest dependency in the project. It's loaded via `React.lazy()` in
`App.jsx`, so it is **not** downloaded at all until someone opens Trends.
Verified with a network trace: the initial Log-tab paint only fetches the
entry bundle (~204 KB / ~66 KB gzip); the recharts-containing chunk (~373 KB /
~105 KB gzip) fetches only on first click into Trends.

`vite.config.js` sets `build.modulePreload: false` — Vite's default behavior
eagerly `<link rel="modulepreload">`s every chunk reachable via dynamic
import, which silently defeats lazy-loading by fetching the bytes upfront
anyway (execution stays deferred, but the network cost doesn't). Disabling it
keeps the lazy chunk genuinely lazy.

`dist/assets/*.gz` are pre-compressed copies of the JS/CSS. Most static hosts
(Netlify, Vercel, Cloudflare Pages, nginx with `gzip_static`) will serve these
automatically instead of compressing on the fly.

## Data model

Each day is stored as one `localStorage` record under key
`phases:entries:YYYY-MM-DD`:

```json
{
  "symptoms": { "hotflash": 2, "sleep": 1 },
  "notes": "Worse after coffee today"
}
```

`symptoms` values are 0 (not logged) to 3 (severe). Keys match the `id` field
in the `SYMPTOMS` array in `src/data.js` — add a new symptom by adding one
object there; the log grid, charts, and learn page all pick it up
automatically.

## Next step: accounts + multi-device sync

`localStorage` is per-browser, per-device — fine for a single-user MVP, not
for real accounts. When you need that:

1. Add a backend — Supabase or Firebase both give you auth + a database in
   under an hour.
2. Store entries as one row per `(user_id, date)` with a JSON `symptoms`
   column — same shape this project already uses.
3. Swap the three methods in `src/storage.js` (`list`, `get`, `set`) for
   calls to that backend. Nothing in `App.jsx` needs to change since it only
   talks to the `storage` interface, not to `localStorage` directly.

## Mobile (React Native)

If you want an installable iOS/Android app rather than a mobile web page:

1. `npx create-expo-app phases-native`
2. Swap `src/storage.js`'s `localStorage` calls for `AsyncStorage` from
   `@react-native-async-storage/async-storage` — same three-method interface.
3. Swap `recharts` for `victory-native` or `react-native-svg-charts` (`recharts`
   is web-only/SVG-DOM-based). The chart *data* — already computed in the
   `useMemo` hooks in `App.jsx` — doesn't need to change, only the rendering
   library.
4. Swap the `window.print()` PDF export in `ReportView.jsx` for
   `react-native-html-to-pdf`.

## Suggested next features (deliberately left out of the MVP)

- Cycle calendar overlay (so symptoms can be viewed against cycle day, not just calendar date)
- Push reminders to log
- Community/forum tab
- Wearable integration (sleep/HR data feeding the dashboard automatically)
- Doctor-share link instead of print-only export

## Disclaimer

This app is for personal symptom tracking only and does not provide medical advice.
Encourage users to discuss patterns with a licensed healthcare provider.
