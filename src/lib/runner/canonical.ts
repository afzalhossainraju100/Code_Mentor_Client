// Turns any value into a stable, readable string for exact comparison and display.
// Must stay in sync with code_mentor_server/src/engine/canonical.js (the server grades with it).

const MAX_DEPTH = 20

export function canonical(value: unknown, depth = 0, seen: Set<object> = new Set()): string {
  if (value === undefined) return 'undefined'
  if (value === null) return 'null'

  switch (typeof value) {
    case 'number':
      if (Number.isNaN(value)) return 'NaN'
      if (Object.is(value, -0)) return '0'
      return String(value)
    case 'string':
      return JSON.stringify(value)
    case 'boolean':
      return String(value)
    case 'bigint':
      return `${value}n`
    case 'function':
      return '[Function]'
    case 'symbol':
      return value.toString()
    default:
      break
  }

  const object = value as object
  if (depth >= MAX_DEPTH) return '[…]'
  if (seen.has(object)) return '[Circular]'
  seen.add(object)

  let text: string
  if (Array.isArray(object)) {
    text = `[${object.map((item) => canonical(item, depth + 1, seen)).join(',')}]`
  } else {
    const record = object as Record<string, unknown>
    const keys = Object.keys(record).sort()
    text = `{${keys.map((key) => `${JSON.stringify(key)}:${canonical(record[key], depth + 1, seen)}`).join(',')}}`
  }

  seen.delete(object)
  return text
}

/** Shorter version for the visualizer and console. */
export function preview(value: unknown, max = 80): string {
  const text = typeof value === 'string' ? JSON.stringify(value) : canonical(value)
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

/** Human-friendly spacing for display: [1,2,3] -> [1, 2, 3]. */
export function pretty(text: string): string {
  let result = ''
  let inString = false
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    result += char
    if (char === '"' && text[index - 1] !== '\\') inString = !inString
    if (!inString && (char === ',' || char === ':')) result += ' '
  }
  return result
}
