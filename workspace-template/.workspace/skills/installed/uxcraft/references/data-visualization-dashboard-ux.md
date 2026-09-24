# Data Visualization and Dashboard UX

Use this reference for dashboards, reports, analytics, monitoring, admin panels, tables, and decision-support interfaces.

## Dashboard Principles

- Start with the decision the user must make.
- Prioritize signal over decoration.
- Show timeframe, unit, owner, freshness, and definitions.
- Separate overview, diagnosis, and action.
- Make drill-down paths clear.
- Handle missing, stale, partial, loading, and error states.

## Chart Selection

- Line: trend over time.
- Bar: compare categories.
- Stacked bar: composition with caution.
- Scatter: relationship or distribution.
- Histogram: distribution.
- Table: exact values, scanning, operational work.
- KPI card: single important measure with context.
- Avoid pie/donut charts for precise comparison.

## Chart Quality Checklist

- Title states insight or metric.
- Axes are labeled and not misleading.
- Units and timeframe are visible.
- Baseline and scale are appropriate.
- Colors are semantic and colorblind-safe.
- Legends are close to data or labels are direct.
- Annotations explain anomalies.
- Uncertainty and estimates are labeled.
- Screen-reader alternative or data table exists.

## Tables and Data Grids

- Support sorting, filtering, search, pagination/virtualization, column visibility, density controls, bulk actions, export, and row-level actions where relevant.
- Keep keyboard navigation and focus visible.
- Preserve user filters and table state when returning.
- Provide empty, no-results, loading, stale, and permission states.

## Alerting

Avoid alert fatigue. Severity, owner, cause, time, impact, and next action must be clear.
