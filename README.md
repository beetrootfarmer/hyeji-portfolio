# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Mind-map view

An alternative to the list view: the same career/project/skill content rendered as a D3 force-directed graph (`src/components/mindmap/MindMapView.tsx`), toggled via the LIST/MAP control next to the locale toggle. Data lives in `src/data/mindmap/` (`mindmap.ko.ts` / `mindmap.en.ts`, sharing one `types.ts` shape), structurally identical between locales.

### Architecture: simulation owns position, CSS/Framer owns everything else

The one rule the rest of this section follows: **D3's force simulation is the only thing allowed to set a node's or link's x/y** (via imperative `setAttribute('transform', ...)` on a tick, bypassing React re-renders for performance). Every other visual — entrance, hover, drag scale, dim/focus, pin indicator, search pulse — is CSS or Framer Motion, driven by React state/props, and never touches position.

Concretely, each node is two nested SVG groups:

- an outer `<g class="mindmap-node-position">`, positioned imperatively by the simulation's tick handler and drag behavior, and
- an inner `motion.g` (Framer Motion), whose `opacity`/`scale`/classes are fully declarative and never see D3's tick loop.

This split is why expand/collapse, search, dragging, and view-switching can all restyle nodes freely without ever fighting the physics simulation, and why switching LIST ↔ MAP uses `display: none` rather than unmounting `<MindMapView>` — the simulation and all pinned/expanded state survive the switch untouched.

### Interaction summary

- **Click** a node to select it (opens the detail side panel) and pan/zoom the camera to center it, offset for the panel's width. Career/project nodes also toggle their depth-2 case-study children.
- **Drag** to reposition and pin a node (dashed stroke, appears instantly); **double-click** to unpin (dashed → solid, animated).
- **Search** (top-left) matches node labels and tags with a 200ms debounce; matches get a one-time 600ms pulse ring (never repeats for the same match) and the camera auto-pans to a single match or fits multiple matches in view. The **Tags** button reveals toggleable tag-filter chips using the same match/spotlight mechanism. Selecting a node clears the active filter and vice versa — the two spotlight sources never fight.
- **Arrow keys** move a keyboard-focus ring to the nearest node in the pressed direction (within a ~60° cone); **Enter** activates the focused node like a click; **Escape** closes the panel and clears keyboard focus.
- On viewports ≤640px the graph is unreachable (MAP toggle hidden, forced to list view) — force-graph drag/pinch interactions don't translate well to small touch screens.

### `prefers-reduced-motion`

This is the one deliberately uncommon part: reduced-motion here doesn't just strip CSS transitions, it changes how the simulation itself runs. Normally the graph enters with `alpha(1)` and animates open over ~1s; under reduced motion, the simulation is stopped, ticked forward synchronously ~300 times to let it settle, and only the final positions are ever applied to the DOM — there's no motion to see because the layout is already resolved before first paint. Camera moves (`panToNode`/`fitToMatches`) skip their 700ms transition and jump straight to the target transform, and Framer Motion's `initial`/`transition` props collapse to instant (`duration: 0`) throughout the graph and the side panel. The one exception is direct-manipulation feedback (hover/drag scale, both under 150ms and only ever active while the pointer is actually down/hovering) — kept because it's a direct result of continuous user input rather than an autoplaying animation.

## Performance

Measured 2026-07-16 on `main` (`a125b5b`): production build (`npm run build`) served via `vite preview`, timings captured with Playwright/Chromium using the Navigation and Paint Timing APIs.

### Bundle size

| File | Raw | Gzip |
| --- | --- | --- |
| JS (single bundle) | 349.6 KB | 113.6 KB |
| CSS | 9.25 KB | 2.54 KB |
| HTML | 0.96 KB | 0.52 KB |

No code-splitting yet — React, ReactDOM, and Framer Motion all ship in one chunk.

### Load timing

| Metric | No throttle | Simulated Slow 4G |
| --- | --- | --- |
| TTFB | 1.7 ms | 1.4 ms |
| DOMContentLoaded | 345 ms | 915 ms |
| load event | 348 ms | 915 ms |
| First Contentful Paint | 588 ms | 1048 ms |

### Initial network requests (4 total)

- Google Fonts CSS (external, ~270–290 ms despite `preconnect` — the biggest single latency contributor)
- `index-*.css` (2.8 KB)
- `index-*.js` (114 KB gzip)
- `beeve1.jpg` card thumbnail (63 KB) — the other project-detail carousel images (`beeve2–4.jpg`) only load when a project is opened

### Takeaways

Light and fast for a static portfolio: sub-1s FCP even under simulated Slow 4G, 4 requests, ~176 KB transferred on first load. Lower-priority follow-ups if the site grows:

1. Self-host fonts (e.g. Fontsource) to remove the Google Fonts round-trip.
2. Lazy-load `ProjectDetail` (`React.lazy`) once there are enough projects to justify splitting it out of the main bundle.
3. Add explicit `loading="lazy"` to project images as more are added.
