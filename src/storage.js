// Storage adapter for the deployable web version.
// Swaps Claude's artifact-only `window.storage` for real browser localStorage,
// keeping the same entries:YYYY-MM-DD key shape described in the README so the
// data model doesn't change if you later move this to a Supabase/Firebase backend.

const PREFIX = "phases:entries:";

export const storage = {
  async list() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) keys.push(k);
    }
    return { keys };
  },
  async get(key) {
    const value = localStorage.getItem(key);
    return value === null ? null : { value };
  },
  async set(key, value) {
    localStorage.setItem(key, value);
    return { key, value };
  },
};

export const entryKey = (dateKey) => `${PREFIX}${dateKey}`;
export const dateFromEntryKey = (key) => key.replace(PREFIX, "");
