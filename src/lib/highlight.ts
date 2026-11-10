// A tiny JavaScript syntax highlighter (no dependencies).
// It is intentionally simple: good enough for short beginner exercises.

export type TokenType = 'keyword' | 'string' | 'number' | 'comment' | 'boolean' | 'function' | 'operator' | 'punct' | 'plain'
export type Token = { type: TokenType; text: string }

const KEYWORDS = 'const|let|var|function|return|if|else|for|while|do|of|in|new|break|continue|switch|case|default|class|typeof|try|catch|finally|throw|this'
const PATTERN = new RegExp(
  [
    String.raw`(\/\/[^\n]*|\/\*[\s\S]*?\*\/)`, // 1 comment
    String.raw`("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|` + '`(?:\\\\.|[^`\\\\])*`)', // 2 string
    String.raw`(\b\d+(?:\.\d+)?\b)`, // 3 number
    String.raw`(\b(?:${KEYWORDS})\b)`, // 4 keyword
    String.raw`(\b(?:true|false|null|undefined|NaN|Infinity)\b)`, // 5 literal
    String.raw`([A-Za-z_$][\w$]*)(?=\s*\()`, // 6 function call / declaration name
    String.raw`([=!<>+\-*/%&|?:]+)`, // 7 operator
    String.raw`([{}()[\];,.])`, // 8 punctuation
  ].join('|'),
  'g',
)

const GROUP_TYPES: TokenType[] = ['comment', 'string', 'number', 'keyword', 'boolean', 'function', 'operator', 'punct']

function tokenize(code: string): Token[] {
  const tokens: Token[] = []
  let last = 0
  for (const match of code.matchAll(PATTERN)) {
    const index = match.index ?? 0
    if (index > last) tokens.push({ type: 'plain', text: code.slice(last, index) })
    const group = match.slice(1).findIndex((value) => value !== undefined)
    tokens.push({ type: GROUP_TYPES[group] ?? 'plain', text: match[0] })
    last = index + match[0].length
  }
  if (last < code.length) tokens.push({ type: 'plain', text: code.slice(last) })
  return tokens
}

/** Tokens split into lines (multi-line comments/strings are split across lines correctly). */
export function highlightLines(code: string): Token[][] {
  const lines: Token[][] = [[]]
  for (const token of tokenize(code)) {
    const parts = token.text.split('\n')
    parts.forEach((part, index) => {
      if (index > 0) lines.push([])
      if (part) lines[lines.length - 1].push({ type: token.type, text: part })
    })
  }
  return lines
}
