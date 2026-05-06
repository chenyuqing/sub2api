# sub2api design system

## color

sub2api should use a warm operational palette, not a flat teal SaaS palette.

Primary roles:
- `paper` for the main canvas
- `ink` for text, headers, and structure
- `copper` for primary actions and emphasis
- `amber` for highlights and state transitions
- `teal` only for success, status, and confirmation

Rules:
- Keep the default canvas light and slightly warm.
- Use deep slate / ink in dark mode, not pure black.
- Reserve saturated color for important actions only.
- Avoid one-color themes where every surface, button, and badge uses the same hue.

## typography

Use a confident sans-serif system with a tighter hierarchy than the current UI.

Rules:
- Headings should be compact, bold, and clearly separated from body copy.
- Body text should remain calm and readable.
- Numeric data should be stronger than surrounding labels.
- Avoid Title Case everywhere; sentence case is the default.
- Keep code and machine values in monospace only when it improves legibility.

## spacing

Use more whitespace than the existing dashboard.

Rules:
- Prefer 8px rhythm, then expand to 16/24/32 for section breaks.
- Summary blocks should have more breathing room than dense tables.
- Do not cram every page into identical card padding.
- Let the most important item own the first visual stop.

## layout

The app should feel like a control surface, not a generic admin template.

Rules:
- Keep a stable left rail for navigation.
- Use a clear content column with optional supporting panels.
- Summary and metrics should span wider than detail views.
- Auth pages should feel more atmospheric and less dense.
- Admin pages can be denser, but they still need separation between tools.

## components

Cards:
- Use cards only when they create hierarchy or grouping.
- Prefer subtle borders and surface contrast over heavy shadows.
- Differentiate summary cards from detail cards.

Buttons:
- Primary action: copper fill.
- Secondary action: neutral surface.
- Tertiary action: ghost or text.
- Avoid making every button equally loud.

Tables:
- Keep tables compact and readable.
- Use row hover and restrained zebra treatment.
- Highlight the important column instead of every cell.

Forms:
- Inputs should be clean with visible focus states.
- Validation must be inline and direct.
- Error states should be calm, not theatrical.

## motion

Motion should help scanability, not decorate the page.

Rules:
- Use short transitions.
- Prefer transform and opacity.
- Stagger entry only when it helps comprehension.
- Avoid noisy looping motion unless it communicates status.

## voice

UI copy should sound direct and specific.

Rules:
- Use plain language.
- Avoid hype words such as “seamless”, “next-gen”, and “game-changer”.
- Prefer actionable labels over marketing phrasing.
- Error messages should explain the failure and the next step.

## brand

sub2api is an operational gateway product.

Personality:
- dependable
- technical
- measured
- practical

Visual cues:
- warm editorial contrast
- clear hierarchy
- restrained ornament
- purposeful highlights

## anti-patterns

Avoid:
- one-color teal dashboards
- generic white cards with gray borders everywhere
- random blobs and decorative noise without function
- oversized glassmorphism
- identical card grids on every page
- buttons that all look like primary actions
- flat auth pages that feel disconnected from the product

