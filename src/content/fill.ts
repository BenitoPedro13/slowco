// Fills `{placeholder}` slots in a docs/05-CONTENT.md string. Unknown keys stay visible as
// `{key}` so a missing value is caught in review instead of silently disappearing.
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
