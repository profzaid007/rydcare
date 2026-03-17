RydCare Agent Guide
===================

Purpose
- Give agentic tools a concise, opinionated map of this static landing page repo and its conventions.
- Keep progressive enhancement intact: the page should work with JavaScript disabled, with JS only adding niceties (i18n, counters, persistence).
- Favor accessibility, semantic HTML, and small vanilla JS. No frameworks or bundlers are currently used.

Repository Layout
- index.html: single-page layout, Tailwind CDN plus custom CSS, embeds SVG icons, hidden checkboxes for dark mode and mobile nav.
- css/styles.css: primary styling, theme variables, layout, animations, dark mode driven by :has(#dark-toggle:checked).
- js/i18n.js: fetches translations, updates elements with data-i18n / data-i18n-placeholder, stores preferredLang in localStorage.
- js/counter.js: IntersectionObserver + requestAnimationFrame to animate numbers from data-target once per page load.
- translations/*.json: en is complete; ta and hi contain [TA]/[HI] placeholders to be localized; keys mirror data-i18n usage.
- logosandassets/: brand imagery; filenames include spaces, so quote paths in HTML/CSS/JS.
- No package.json, build tooling, or test harness. Everything is static.
- No Cursor or Copilot rules present (no .cursor/ or .cursorrules, no .github/copilot-instructions.md).

Run / Preview
- Primary: open index.html directly in a browser for quick checks.
- Recommended: serve locally to avoid CORS on JSON fetches: `python3 -m http.server 8000` then visit http://localhost:8000.
- Alternative: `npx serve .` from the repo root if Node is available.
- For mobile states, use browser dev tools device emulation; dark mode uses the #dark-toggle checkbox, not prefers-color-scheme.

Build / Lint / Test
- Build: none required; assets are static. If you introduce Tailwind CLI or bundling, document commands here.
- Lint/format: no configured tooling. Match existing style—4-space indents, trailing commas avoided, double quotes in JSON, single quotes in JS.
- Suggested optional checks (run only if added to the repo): `npx prettier --check "**/*.{html,css,js,json}"` or `npx eslint` once configured.
- Tests: none. Manual QA only. When asked for a “single test,” describe the manual scenario (e.g., load page, toggle dark mode, switch language, scroll counters).
- Accessibility sanity checks: tab through header, mobile menu, FAQ (<details>), and newsletter form; ensure focus rings remain visible after CSS changes.

HTML Conventions
- Semantic structure: header/nav, main sections (hero, stats, why, services, faq), footer. Keep heading hierarchy logical (h1 → h2 → h3).
- Interactivity without JS: dark mode and mobile menu rely on hidden checkboxes with peer selectors; FAQ uses <details>/<summary>. Preserve these patterns.
- Data attributes: text nodes rely on data-i18n keys; placeholders use data-i18n-placeholder. Add both when introducing new copy.
- Forms: newsletter input uses required and aria attributes; keep labels (sr-only) and aria-required in sync when editing.
- Anchors: in-page nav uses #home/#services/#why-us/#faq; maintain IDs if you move sections. Include aria-labels on icon-only links.

CSS / Theming
- Color tokens: primary (FAA307 range), accent aligns with primary, neutrals in gray-50…gray-900, backgrounds (bg-primary/secondary/tertiary), text tokens (text-primary/secondary/tertiary).
- Gradients: --gradient-primary/secondary/accent/soft set the orange-forward look; respect brand orange as the hero accent.
- Dark mode: :root:has(#dark-toggle:checked) overrides backgrounds, text, gradients, and glow shadows. Changes must remain legible on both themes.
- Shadows and motion: reuse --shadow-* and transitions (--transition-fast/base/slow/bounce). Avoid adding heavy box-shadows that break the clean glassy feel.
- Layout helpers: .container (max 1280px), section padding via --section-padding. Keep consistent spacing and avoid inline styles unless needed for imagery sizing.
- Tailwind: CDN-powered utilities coexist with custom CSS. Prefer utility classes for quick tweaks; add to styles.css for reusable patterns.
- Animations: respect prefers-reduced-motion if you add new keyframes; existing transitions are subtle.

JavaScript Style
- Vanilla only; no bundler. Use const/let, arrow functions acceptable but existing files use function declarations—match local style.
- Keep scripts idempotent on repeat load where possible. i18n.js saves language to localStorage and retries English on fetch failure.
- counter.js: formatNumber preserves suffixes (M+, K+, ★, +). IntersectionObserver threshold is 0.5; don’t animate on every scroll.
- Error handling: catch fetch failures, log concise console errors, and provide safe fallbacks (e.g., default to en translations).
- DOM access: guard for element existence (as in lang-select). Defer until DOMContentLoaded when touching the DOM.
- Avoid global pollution beyond current pattern; if adding modules, keep filenames small and include via <script src> after CSS.

Internationalization
- Keys live in translations/*.json and map directly to data-i18n/data-i18n-placeholder attributes.
- en.json is source of truth; ta.json and hi.json contain placeholders like "[TA]"/"[HI]". Replace with real translations before shipping.
- When adding new text, update all translation files; fall back to English if non-critical copy is missing but avoid shipping placeholders.
- Keep JSON strictly double-quoted and trailing-comma-free.

Accessibility & Content
- Maintain alt text on all images; logo <img> tags already include alt. For decorative SVGs inside <svg>, current usage relies on aria-label on parents—preserve it.
- Focus states: buttons/links rely on outlines and hover color changes; do not remove outlines. Ensure contrast meets WCAG AA in both themes.
- FAQ uses native <details>; leave summary text meaningful and keep paragraphs concise.
- Forms: keep required validation and placeholder translations in sync; add proper labels for any new inputs.

Performance & Assets
- Tailwind comes from CDN; if offline builds are introduced, document the new pipeline and replace CDN links accordingly.
- Images live under logosandassets/ with spaced folder names—quote paths in HTML/CSS. Prefer WebP for new assets and add loading="lazy" for non-critical imagery.
- Keep JS light; avoid adding large libraries. IntersectionObserver and fetch are the heaviest current APIs.

Design Notes
- Typography: Google Fonts Inter (body) and Space Grotesk (display). Keep headings bold and body medium weight for clarity.
- Visual tone: orange-forward gradients with deep navy backgrounds in dark mode; maintain the clean, glassmorphic header (semi-transparent with blur).
- Buttons: .btn, .btn-primary, .btn-secondary classes exist in styles.css—reuse them rather than inventing new ad-hoc styles.
- Cards (services, features, stats) use rounded corners, soft shadows, and subtle hover lift. Match padding and border-radius patterns already present.

Detailed Color Tokens (css/styles.css)
- Primary: --primary-50 #FFF8E7, --primary-100 #FFEACC, --primary-500 #FAA307, --primary-600 #E89307, --primary-700 #D68307, --primary-900 #8B5704.
- Accent mirrors primary: --accent-500 #FAA307, --accent-600 #E89307; brand specifics: --dark-navy #00111C, --off-white #F8F8F8, --rydcare-orange #FAA307.
- Neutrals: --gray-50 #f8fafc → --gray-900 #0f172a cover backgrounds and text defaults.
- Background/text tokens: --bg-primary/secondary/tertiary, --text-primary/secondary/tertiary, --border-color.
- Gradients: --gradient-primary (135deg orange), --gradient-secondary (orange to deep), --gradient-accent (90deg orange sweep), --gradient-soft (pale orange wash).
- Shadows/transition tokens: --shadow-sm/md/lg/xl/2xl, glow variants in dark mode, --transition-fast/base/slow/bounce.

Component / Section Structure (index.html)
- Header: sticky glassmorphic nav, logo image at logosandassets/RydCare /RC Car Logo/RC Transparent PNG.png, desktop links plus dark-mode and language controls, mobile hamburger bound to #menu-toggle.
- Hero: h1 with gradient span, subtitle, primary/secondary CTAs, right-side logo illustration, scroll indicator cue.
- Stats: four cards using .stat-card, each .stat-number holds data-target for counter.js; icons are inline SVGs.
- Why Choose Us: three feature cards with icon, h3, paragraph, and link (arrow character part of copy).
- Services: six service cards, each with icon, h3, description, three bullet features; data-i18n keys match translations/services.* tree.
- FAQ: six <details> items with summary/question and paragraph answer; works without JS.
- Footer: four columns (brand + socials, quick links, services list, newsletter form) and a footer-bottom row with legal links; includes social SVGs.
- Back to top: anchor with arrow SVG linking to #top; relies on CSS positioning.

JavaScript Function Notes
- i18n.js: getTranslation(obj, path) reduces dot paths with optional chaining; updateContent swaps textContent and placeholder; loadLanguage fetches translations/{lang}.json, updates DOM, saves localStorage preferredLang, and syncs dropdown; on failure logs concise console.error and retries en.
- Counter.js: formatNumber respects suffixes in the original content (M+, K+, ★, +) to avoid losing symbols; animateCounter uses ease-out cubic to drive requestAnimationFrame; initCounters observes .stat-number[data-target] once using Set to avoid reruns; threshold 0.5 prevents premature triggering.
- Style expectations: keep functions small and pure; prefer early returns; log errors with context; avoid wrapping logic in IIFEs unless needed.

Naming & Formatting
- HTML IDs and classes use kebab-case; JS functions/variables use lowerCamelCase.
- Indentation across HTML/CSS/JS is 4 spaces; avoid tabs. Keep lines reasonably short for readability.
- Strings in JS use single quotes; JSON stays double-quoted; avoid trailing commas per existing files.
- Keep inline styles rare; prefer CSS classes. Reserve inline SVGs for icons as already present.

Error Handling & Resilience
- Fetch failures in i18n should fall back to English; avoid breaking the page if translation JSON is missing.
- Guard DOM lookups (querySelector) when attaching listeners to avoid null dereferences, matching current patterns.
- For new network calls, prefer try/catch with user-safe fallbacks; log concise messages, not stack dumps.
- Preserve progressive enhancement: features should gracefully degrade when JS is unavailable or fails.

Internationalization Copy Tips
- Keep copy concise and action-oriented; maintain brand voice around reliability, safety, and speed.
- When adding keys, mirror the nested structure already used (nav, hero, stats, why, services, faq, footer) to keep translations organized.
- Add data-i18n and data-i18n-placeholder for any new text/inputs; default English should remain human-readable even if JS fails.

Manual QA Scenarios (use when asked for a “single test”)
- Without JS: load index.html, toggle dark mode via checkbox label, open/close mobile menu, expand FAQ items; ensure content visible and navigation smooth.
- With JS: change language via dropdown (verify translations swap), scroll stats to trigger counters once, refresh to confirm language persists, check console clean.
- Accessibility spot checks: tab order through nav controls, newsletter input focus ring, summary elements keyboard toggle, back-to-top focusable.
- Responsiveness: view at ~375px mobile and 1280px desktop; ensure grid cards stack then align; header remains sticky and legible.

Asset Guidance
- Logos and images are PNG/JPEG/PDF/SVG/EPS variants under logosandassets/RydCare /. Prefer PNG/SVG in HTML, with quoted paths to handle spaces.
- Add loading="lazy" to non-critical <img> and constrain sizes via CSS classes (not inline height/width unless necessary for layout).

Future Tooling Hooks
- If you introduce Tailwind CLI, document the exact build command (e.g., npx tailwindcss -i input.css -o css/tailwind.css --minify) and whether CDN links should be removed.
- If adding tests, note the runner and how to execute a single file/spec (e.g., npx vitest file.test.js -t "case").
- If introducing formatting, capture config (tabWidth 4, singleQuote true, etc.) so agents align automatically.

Performance Reminders
- Keep CSS/JS small; avoid adding large libraries. Consider deferring any heavy scripts and respect prefers-reduced-motion for new animations.
- IntersectionObserver already prevents repeated counter animations; reuse that pattern for future scroll effects.

Deployment Notes
- Static hosting friendly; ensure relative paths stay correct if hosted at domain root. If deploying under a subpath, update asset references or add <base> only if necessary and tested.

Repository Hygiene
- No node_modules expected; do not add lockfiles unless tooling is introduced intentionally.
- Respect existing assets; do not rename files with spaces unless you update all references.

Collaboration Defaults
- Default to ASCII in new files; only introduce Unicode if copy requires it (e.g., translations).
- Keep comments minimal and purposeful—only for non-obvious logic.
- Preserve existing brand tone and visual identity; avoid adding random colors or fonts without alignment to current palette and typography.

Extending the Page
- New sections: wrap in <section id="..." class="..."> with .container, h2.section-title, p.section-subtitle for consistency; add i18n keys.
- New interactive widgets: prefer CSS-only where feasible; if JS is required, keep it small and progressive (works without JS, enhances with it).
- Dark mode additions: ensure custom components read the same CSS variables so they flip automatically when #dark-toggle is checked.

Asset and Path Safety
- Paths include spaces (e.g., logosandassets/RydCare /RC Car Logo/RC Transparent PNG.png); always wrap in quotes.
- Keep file naming consistent if adding assets (use hyphens or underscores to avoid more spaces).

Version Control Expectations
- No git hooks or CI here. If adding tooling, document new commands in this file and keep changes minimal.
- Do not remove user changes in unrelated files; this repo may be dirty in your working tree.

If You Add Tooling Later
- Document new npm scripts (build/lint/test) here with exact commands and how to run a single test or file.
- Capture any formatter rules (Prettier/Eslint style) so agents can conform automatically.

Open Questions / Missing Pieces
- There are no automated tests, linters, or type systems; assume manual QA. If you add any, record how to run them here.
- No Cursor or Copilot instruction files exist; if they are added, summarize their rules in this section.
