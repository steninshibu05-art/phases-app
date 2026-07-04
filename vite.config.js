import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Don't eagerly modulepreload dynamically-imported chunks (e.g. recharts) —
    // that would fetch them on first paint and defeat the point of lazy-loading
    // the Trends tab's dependency. Rollup's default automatic chunking already
    // isolates code that's only reachable through a dynamic import() (i.e. the
    // recharts library, only used by the lazy-loaded TrendsView) into its own
    // chunk correctly — forcing manualChunks here actually broke that boundary
    // by statically merging shared submodules back into the entry, so we let
    // Rollup's default splitting do its job instead.
    modulePreload: false,
  },
})
